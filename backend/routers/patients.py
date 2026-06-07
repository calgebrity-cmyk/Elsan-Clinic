from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid

from database.database import get_db
from dependencies.auth import get_current_user
from middleware.rbac import require_roles
from models.domain import User
from schemas.patients import PatientCreate, PatientUpdate, PatientResponse
from repositories.patients import PatientRepository
from services.patients import PatientService

router = APIRouter(prefix="/api/v1/patients", tags=["Patient Management"])

def get_patient_service(db: AsyncSession = Depends(get_db)) -> PatientService:
    return PatientService(PatientRepository(db), db)

def map_patient_response(patient, assigned_doctor=None) -> PatientResponse:
    resp_dict = {
        "id": patient.id,
        "patient_code": patient.patient_code,
        "full_name": patient.full_name,
        "age": patient.age,
        "gender": patient.gender,
        "blood_group": patient.blood_group,
        "phone": patient.phone,
        "address": patient.address,
        "medical_history": patient.medical_history,
        "email": patient.email,
        "emergency_contact": patient.emergency_contact,
        "allergies": patient.allergies,
        "current_symptoms": patient.current_symptoms,
        "notes": patient.notes,
        "is_active": patient.is_active,
        "created_at": patient.created_at,
        "updated_at": patient.updated_at,
    }
    if assigned_doctor:
        resp_dict["assigned_doctor_id"] = assigned_doctor.id
        resp_dict["assigned_doctor_name"] = assigned_doctor.user.full_name
    return PatientResponse(**resp_dict)

@router.get("/search", response_model=List[PatientResponse])
@require_roles(["SUPER_ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE"])
async def search_patients(
    q: str = Query(..., min_length=2),
    current_user: User = Depends(get_current_user),
    service: PatientService = Depends(get_patient_service)
):
    patients = await service.search_patients(q)
    return [map_patient_response(p) for p in patients]

@router.get("/doctor/assigned", response_model=List[PatientResponse])
@require_roles(["SUPER_ADMIN", "DOCTOR"])
async def list_doctor_assigned_patients(
    current_user: User = Depends(get_current_user),
    service: PatientService = Depends(get_patient_service)
):
    # Only allow doctors to fetch their own assigned patients unless admin
    if current_user.role == "DOCTOR":
        if not hasattr(current_user, "doctor_profile") or not current_user.doctor_profile:
            raise HTTPException(status_code=400, detail="Doctor profile not found for user")
        doctor_id = str(current_user.doctor_profile.id)
    else:
        # If admin, maybe require passing a doctor_id, but for now we just fail if not doctor.
        # Ideally accept doctor_id as optional query param.
        raise HTTPException(status_code=400, detail="Only doctors can view their assigned patients using this endpoint. Admins use standard list.")

    patients = await service.get_doctor_assigned_patients(doctor_id)
    return [map_patient_response(p) for p in patients]

@router.get("", response_model=List[PatientResponse])
@require_roles(["SUPER_ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE"])
async def list_patients(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    service: PatientService = Depends(get_patient_service)
):
    patients = await service.get_all_patients(skip, limit)
    # Note: assigned doctor is not eager loaded here for performance. 
    # Can optimize later with joinedload if needed.
    return [map_patient_response(p) for p in patients]

@router.get("/{id}", response_model=PatientResponse)
@require_roles(["SUPER_ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE"])
async def get_patient(
    id: str,
    current_user: User = Depends(get_current_user),
    service: PatientService = Depends(get_patient_service)
):
    patient = await service.get_patient(id)
    assigned_doctor = await service.get_assigned_doctor(patient.id)
    return map_patient_response(patient, assigned_doctor)

@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
@require_roles(["SUPER_ADMIN", "RECEPTIONIST"])
async def create_patient(
    data: PatientCreate,
    current_user: User = Depends(get_current_user),
    service: PatientService = Depends(get_patient_service)
):
    patient = await service.create_patient(data)
    assigned_doctor = await service.get_assigned_doctor(patient.id)
    return map_patient_response(patient, assigned_doctor)

@router.put("/{id}", response_model=PatientResponse)
@require_roles(["SUPER_ADMIN", "RECEPTIONIST"])
async def update_patient(
    id: str,
    data: PatientUpdate,
    current_user: User = Depends(get_current_user),
    service: PatientService = Depends(get_patient_service)
):
    patient = await service.update_patient(id, data)
    assigned_doctor = await service.get_assigned_doctor(patient.id)
    return map_patient_response(patient, assigned_doctor)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
@require_roles(["SUPER_ADMIN", "RECEPTIONIST"])
async def delete_patient(
    id: str,
    current_user: User = Depends(get_current_user),
    service: PatientService = Depends(get_patient_service)
):
    await service.delete_patient(id)

@router.get("/{id}/history")
@require_roles(["SUPER_ADMIN", "DOCTOR", "RECEPTIONIST", "NURSE"])
async def get_patient_history(
    id: str,
    current_user: User = Depends(get_current_user),
    service: PatientService = Depends(get_patient_service)
):
    history = await service.get_patient_history(id)
    # Return as raw dict, FastAPI will serialize it to JSON.
    return history
