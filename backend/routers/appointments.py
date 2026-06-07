from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime, date, time

from database.database import get_db
from dependencies.auth import get_current_user
from models.domain import User, Appointment, AppointmentStatus

router = APIRouter(prefix="/api/v1/appointments", tags=["Appointment Management"])

@router.get("")
async def get_appointments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Appointment).options(selectinload(Appointment.patient))
    
    # Optional: Filter by today or future dates only
    # stmt = stmt.where(Appointment.appointment_date >= date.today())
    
    if current_user.role == "DOCTOR":
        # Need to join with Doctor to filter by user_id
        from models.domain import Doctor
        stmt = stmt.join(Doctor).where(Doctor.user_id == current_user.id)
        
    stmt = stmt.order_by(Appointment.appointment_date, Appointment.appointment_time)
    result = await db.execute(stmt)
    appointments = result.scalars().all()
    return appointments

@router.post("")
async def create_appointment(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_appt = Appointment(
        patient_id=data.get("patient_id"),
        doctor_id=data.get("doctor_id") or None,
        appointment_date=datetime.strptime(data.get("appointment_date"), "%Y-%m-%d").date(),
        appointment_time=datetime.strptime(data.get("appointment_time"), "%H:%M").time(),
        status=AppointmentStatus.SCHEDULED,
        notes=data.get("notes")
    )
    db.add(new_appt)
    await db.commit()
    await db.refresh(new_appt)
    return new_appt

@router.post("/public")
async def create_public_appointment(
    data: dict,
    db: AsyncSession = Depends(get_db)
):
    from models.domain import Patient, Doctor, User
    import random
    
    # Create or get patient
    phone = data.get("phone")
    result = await db.execute(select(Patient).where(Patient.phone == phone))
    patient = result.scalar_one_or_none()
    
    if not patient:
        patient_code = f"PAT{random.randint(10000, 99999)}"
        patient = Patient(
            patient_code=patient_code,
            full_name=data.get("full_name"),
            age=int(data.get("age", 30)),
            gender=data.get("gender", "Unknown"),
            phone=phone
        )
        db.add(patient)
        await db.flush()

    # Get doctor by name or fallback to first
    doc_name = data.get("doctor_name", "")
    doctor = None
    if doc_name and doc_name != "Any Available Doctor":
        result = await db.execute(select(Doctor).join(User).where(User.full_name.ilike(f"%{doc_name}%")))
        doctor = result.scalar_one_or_none()
    
    if not doctor:
        result = await db.execute(select(Doctor))
        doctor = result.scalars().first()
        if not doctor:
            raise HTTPException(status_code=400, detail="No doctors available in the clinic.")
            
    appt_time_str = data.get("appointment_time", "10:00")
    if not appt_time_str:
        appt_time_str = "10:00"

    new_appt = Appointment(
        patient_id=patient.id,
        doctor_id=doctor.id,
        appointment_date=datetime.strptime(data.get("appointment_date"), "%Y-%m-%d").date(),
        appointment_time=datetime.strptime(appt_time_str, "%H:%M").time(),
        status=AppointmentStatus.SCHEDULED,
        notes=data.get("notes")
    )
    db.add(new_appt)
    await db.commit()
    await db.refresh(new_appt)
    return {"message": "Appointment created successfully", "appointment_id": str(new_appt.id)}

@router.put("/{id}/assign-doctor")
async def assign_doctor_to_appointment(
    id: str,
    data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    doctor_id = data.get("doctor_id")
    if not doctor_id:
        raise HTTPException(status_code=400, detail="Doctor ID is required")
        
    result = await db.execute(select(Appointment).where(Appointment.id == id))
    appointment = result.scalar_one_or_none()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    appointment.doctor_id = doctor_id
    await db.commit()
    await db.refresh(appointment)
    return appointment

@router.put("/{id}/status")
async def update_appointment_status(
    id: str,
    data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    status_val = data.get("status")
    if not status_val:
        raise HTTPException(status_code=400, detail="Status is required")
        
    try:
        new_status = AppointmentStatus(status_val)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status value")
        
    result = await db.execute(select(Appointment).where(Appointment.id == id))
    appointment = result.scalar_one_or_none()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    appointment.status = new_status
    await db.commit()
    await db.refresh(appointment)
    return appointment
