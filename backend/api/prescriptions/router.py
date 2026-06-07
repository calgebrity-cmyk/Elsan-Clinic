from fastapi import APIRouter, Depends, HTTPException
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from database.database import get_db
from models.domain import User, Visit, Patient, Prescription
from dependencies.auth import get_current_user
from middleware.rbac import require_roles
from schemas.prescription import PrescriptionCreate, PrescriptionUpdate, PrescriptionResponse
from services.prescription_service import PrescriptionService
from services.audit_service import AuditService
from services.cloudinary_service import generate_signed_url
from sqlalchemy.future import select
from datetime import datetime, timezone

router = APIRouter(prefix="/api/v1/prescriptions", tags=["Prescriptions"])

def get_prescription_service(db: AsyncSession = Depends(get_db)) -> PrescriptionService:
    return PrescriptionService(db)

@router.get("/history", response_model=List[PrescriptionResponse])
@require_roles(["SUPER_ADMIN", "DOCTOR", "RECEPTIONIST"])
async def get_prescription_history(
    patient_id: uuid.UUID = None,
    doctor_id: uuid.UUID = None,
    visit_id: uuid.UUID = None,
    start_date: datetime = None,
    end_date: datetime = None,
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    service: PrescriptionService = Depends(get_prescription_service)
):
    if current_user.role == "DOCTOR" and not doctor_id:
        # A doctor can only view their own prescriptions by default unless searching globally (handled by auth layer in real app)
        doctor_id = current_user.doctor_profile.id if hasattr(current_user, 'doctor_profile') else None

    history = await service.get_prescription_history(patient_id, doctor_id, visit_id, start_date, end_date, skip, limit)
    return history

@router.post("", response_model=PrescriptionResponse)
@require_roles(["SUPER_ADMIN", "DOCTOR"])
async def create_prescription(
    data: PrescriptionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    service: PrescriptionService = Depends(get_prescription_service)
):
    # In a real scenario, fetch actual clinic settings, doctor info, and patient info from DB
    
    # Override doctor_id with actual doctor's ID if user is a DOCTOR
    from models.domain import Doctor
    if current_user.role == "DOCTOR":
        doctor_res = await db.execute(select(Doctor).where(Doctor.user_id == current_user.id))
        doctor = doctor_res.scalar_one_or_none()
        if not doctor:
            raise HTTPException(status_code=400, detail="Doctor profile not found")
        data.doctor_id = doctor.id

    # Fetching patient for the PDF
    patient_res = await db.execute(select(Patient).where(Patient.id == data.patient_id))
    patient = patient_res.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    clinic_data = {"name": "Elsan Clinic", "phone": "+91 98765 43210"}
    doctor_data = {"name": current_user.full_name, "specialization": "General Physician"}
    patient_data = {"name": patient.full_name, "id": patient.patient_code, "age": str(patient.age), "gender": patient.gender, "phone": patient.phone, "date": "Today"}
    
    # We assume 'notes' and 'next_visit' could be fetched from the Visit table
    if data.visit_id:
        visit_res = await db.execute(select(Visit).where(Visit.id == data.visit_id))
        visit = visit_res.scalar_one_or_none()
        if not visit:
            raise HTTPException(status_code=404, detail="Visit not found")
            
        # Update existing visit if new data is provided
        if data.next_visit_date:
            visit.next_visit_date = datetime.strptime(data.next_visit_date, "%Y-%m-%d").date()
        if data.symptoms:
            visit.symptoms = data.symptoms
    else:
        # Auto-create visit
        visit = Visit(
            patient_id=data.patient_id,
            doctor_id=data.doctor_id,
            symptoms=data.symptoms or "Follow up / Prescription generation",
            next_visit_date=datetime.strptime(data.next_visit_date, "%Y-%m-%d").date() if data.next_visit_date else None
        )
        db.add(visit)
        await db.flush() # To get visit.id
        data.visit_id = visit.id

    notes = visit.doctor_notes if visit and visit.doctor_notes else visit.symptoms if visit else ""
    next_visit = str(visit.next_visit_date) if visit and visit.next_visit_date else ""

    prescription = await service.create_prescription(data, clinic_data, doctor_data, patient_data, notes, next_visit)
    
    await db.commit()
    
    return prescription

@router.get("/verify/{id}")
async def verify_prescription(
    id: uuid.UUID,
    service: PrescriptionService = Depends(get_prescription_service)
):
    # Public Endpoint
    presc = await service.get_prescription(id)
    if not presc:
        raise HTTPException(status_code=404, detail="Prescription not found")
        
    return {
        "status": "VALID",
        "prescription_id": presc.id,
        "patient_name": presc.patient.full_name if presc.patient else "Unknown",
        "doctor_name": presc.doctor.user.full_name if presc.doctor else "Unknown",
        "date": presc.created_at,
        "pdf_url": presc.pdf_url
    }

@router.get("/{id}", response_model=PrescriptionResponse)
@require_roles(["SUPER_ADMIN", "DOCTOR", "RECEPTIONIST"])
async def get_prescription(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: PrescriptionService = Depends(get_prescription_service)
):
    presc = await service.get_prescription(id)
    if not presc:
        raise HTTPException(status_code=404, detail="Prescription not found")
    return presc

@router.get("/{id}/download")
@require_roles(["SUPER_ADMIN", "DOCTOR", "RECEPTIONIST"])
async def download_prescription(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    service: PrescriptionService = Depends(get_prescription_service)
):
    presc = await service.get_prescription(id)
    if not presc:
        raise HTTPException(status_code=404, detail="Prescription not found")

    # Log the download event
    audit = AuditService(db)
    await audit.log_event(
        user_id=current_user.id,
        action="DOWNLOAD_PDF",
        entity_type="PRESCRIPTION",
        entity_id=presc.id
    )

    # Increment download count
    presc.download_count += 1
    presc.last_downloaded_at = datetime.now(timezone.utc)
    await db.commit()

    return {"download_url": presc.pdf_url}

@router.get("/{id}/signed-url")
@require_roles(["SUPER_ADMIN", "DOCTOR", "RECEPTIONIST"])
async def get_signed_url(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: PrescriptionService = Depends(get_prescription_service)
):
    presc = await service.get_prescription(id)
    if not presc or not presc.cloudinary_public_id:
        raise HTTPException(status_code=404, detail="Prescription PDF not found")

    signed_url = generate_signed_url(presc.cloudinary_public_id)
    return {"signed_url": signed_url}

@router.post("/{id}/regenerate-pdf", response_model=PrescriptionResponse)
@require_roles(["SUPER_ADMIN", "DOCTOR"])
async def regenerate_pdf(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    service: PrescriptionService = Depends(get_prescription_service)
):
    presc = await service.get_prescription(id)
    if not presc:
        raise HTTPException(status_code=404, detail="Prescription not found")

    # In a real app we fetch updated patient/doctor details again.
    # We pass placeholders to the service regenerator for demonstration
    clinic_data = {"name": "Elsan Clinic", "phone": "+91 98765 43210"}
    doctor_data = {"name": presc.doctor.user.full_name if presc.doctor else "", "specialization": presc.doctor.specialization if presc.doctor else ""}
    patient_data = {"name": presc.patient.full_name if presc.patient else "", "id": presc.patient.patient_code if presc.patient else "", "age": str(presc.patient.age) if presc.patient else "", "gender": presc.patient.gender if presc.patient else "", "phone": presc.patient.phone if presc.patient else "", "date": "Updated"}
    
    notes = presc.visit.doctor_notes if presc.visit else ""
    next_visit = str(presc.visit.next_visit_date) if presc.visit and presc.visit.next_visit_date else ""

    # Call service method (we will modify service to handle regeneration)
    updated_presc = await service.regenerate_prescription_pdf(id, clinic_data, doctor_data, patient_data, notes, next_visit)
    
    audit = AuditService(db)
    await audit.log_event(
        user_id=current_user.id,
        action="REGENERATE_PDF",
        entity_type="PRESCRIPTION",
        entity_id=presc.id
    )

    return updated_presc
