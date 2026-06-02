from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File
import uuid
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from dependencies.auth import get_current_user
from middleware.rbac import require_roles
from models.domain import User, Doctor
from schemas.doctors import DoctorCreate, DoctorUpdate, DoctorResponse
from repositories.doctors import DoctorRepository
from services.doctors import DoctorService
from services.signature_service import SignatureService

router = APIRouter(prefix="/api/v1/doctors", tags=["Doctor Management"])

def get_doctor_service(db: AsyncSession = Depends(get_db)) -> DoctorService:
    return DoctorService(DoctorRepository(db))

def map_response(doctor: Doctor) -> DoctorResponse:
    user = doctor.user
    return DoctorResponse(
        id=str(doctor.id),
        user_id=str(user.id),
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        specialization=doctor.specialization,
        qualification=doctor.qualification,
        experience_years=doctor.experience_years,
        consultation_fee=doctor.consultation_fee,
        consultation_timings=doctor.consultation_timings,
        signature_url=doctor.signature_url,
        is_active=user.is_active,
        status=doctor.status,
        created_at=doctor.created_at,
        updated_at=doctor.updated_at
    )

@router.post("", response_model=DoctorResponse, status_code=status.HTTP_201_CREATED)
@require_roles(["SUPER_ADMIN"])
async def create_doctor(
    data: DoctorCreate,
    current_user: User = Depends(get_current_user),
    service: DoctorService = Depends(get_doctor_service)
):
    doctor = await service.create_doctor(data)
    return map_response(doctor)

@router.get("", response_model=List[DoctorResponse])
@require_roles(["SUPER_ADMIN"])
async def list_doctors(
    current_user: User = Depends(get_current_user),
    service: DoctorService = Depends(get_doctor_service)
):
    doctors = await service.get_all_doctors()
    return [map_response(d) for d in doctors]

@router.get("/{id}", response_model=DoctorResponse)
@require_roles(["SUPER_ADMIN"])
async def get_doctor(
    id: str,
    current_user: User = Depends(get_current_user),
    service: DoctorService = Depends(get_doctor_service)
):
    doctor = await service.get_doctor(id)
    return map_response(doctor)

@router.put("/{id}", response_model=DoctorResponse)
@require_roles(["SUPER_ADMIN"])
async def update_doctor(
    id: str,
    data: DoctorUpdate,
    current_user: User = Depends(get_current_user),
    service: DoctorService = Depends(get_doctor_service)
):
    doctor = await service.update_doctor(id, data)
    return map_response(doctor)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
@require_roles(["SUPER_ADMIN"])
async def delete_doctor(
    id: str,
    current_user: User = Depends(get_current_user),
    service: DoctorService = Depends(get_doctor_service)
):
    await service.delete_doctor(id)

@router.patch("/{id}/activate", response_model=DoctorResponse)
@require_roles(["SUPER_ADMIN"])
async def activate_doctor(
    id: str,
    current_user: User = Depends(get_current_user),
    service: DoctorService = Depends(get_doctor_service)
):
    doctor = await service.set_active_status(id, True)
    return map_response(doctor)

@router.patch("/{id}/deactivate", response_model=DoctorResponse)
@require_roles(["SUPER_ADMIN"])
async def deactivate_doctor(
    id: str,
    current_user: User = Depends(get_current_user),
    service: DoctorService = Depends(get_doctor_service)
):
    doctor = await service.set_active_status(id, False)
    return map_response(doctor)

@router.post("/{doctor_id}/signature", response_model=DoctorResponse)
@require_roles(["SUPER_ADMIN", "DOCTOR"])
async def upload_signature(
    doctor_id: uuid.UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = SignatureService(db)
    doctor = await service.upload_signature(doctor_id, file, current_user.id)
    return map_response(doctor)

@router.delete("/{doctor_id}/signature")
@require_roles(["SUPER_ADMIN", "DOCTOR"])
async def delete_signature(
    doctor_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = SignatureService(db)
    success = await service.delete_signature(doctor_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Signature not found")
    return {"status": "success", "message": "Signature deleted"}
