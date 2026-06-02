from fastapi import APIRouter, Depends, HTTPException
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from database.database import get_db
from models.domain import User
from dependencies.auth import get_current_user
from middleware.rbac import require_roles
from schemas.medicine import ClinicMedicineCreate, ClinicMedicineUpdate, ClinicMedicineResponse
from services.medicine_service import MedicineService

router = APIRouter(prefix="/api/v1/medicines", tags=["Medicines Library"])

def get_medicine_service(db: AsyncSession = Depends(get_db)) -> MedicineService:
    return MedicineService(db)

@router.post("", response_model=ClinicMedicineResponse)
@require_roles(["SUPER_ADMIN", "DOCTOR"])
async def create_medicine(
    data: ClinicMedicineCreate,
    current_user: User = Depends(get_current_user),
    service: MedicineService = Depends(get_medicine_service)
):
    return await service.create_medicine(data)

@router.get("", response_model=List[ClinicMedicineResponse])
@require_roles(["SUPER_ADMIN", "DOCTOR", "RECEPTIONIST"])
async def list_medicines(
    search: str = None,
    current_user: User = Depends(get_current_user),
    service: MedicineService = Depends(get_medicine_service)
):
    return await service.list_medicines(search)

@router.get("/{id}", response_model=ClinicMedicineResponse)
@require_roles(["SUPER_ADMIN", "DOCTOR", "RECEPTIONIST"])
async def get_medicine(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: MedicineService = Depends(get_medicine_service)
):
    med = await service.get_medicine(id)
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return med

@router.put("/{id}", response_model=ClinicMedicineResponse)
@require_roles(["SUPER_ADMIN", "DOCTOR"])
async def update_medicine(
    id: uuid.UUID,
    data: ClinicMedicineUpdate,
    current_user: User = Depends(get_current_user),
    service: MedicineService = Depends(get_medicine_service)
):
    med = await service.update_medicine(id, data)
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return med

@router.delete("/{id}")
@require_roles(["SUPER_ADMIN"])
async def delete_medicine(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: MedicineService = Depends(get_medicine_service)
):
    await service.delete_medicine(id)
    return {"status": "deleted"}
