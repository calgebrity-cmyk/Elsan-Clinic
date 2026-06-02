from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from dependencies.auth import get_current_user
from middleware.rbac import require_roles
from models.domain import User
from schemas.staff import StaffCreate, StaffUpdate, StaffResponse
from repositories.staff import StaffRepository
from services.staff import StaffService

router = APIRouter(prefix="/api/v1/staff", tags=["Staff Management"])

def get_staff_service(db: AsyncSession = Depends(get_db)) -> StaffService:
    return StaffService(StaffRepository(db))

def map_response(user: User) -> StaffResponse:
    return StaffResponse(
        id=str(user.id),
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        role=user.role.value,
        is_active=user.is_active,
        created_at=user.created_at,
        updated_at=user.updated_at
    )

@router.post("", response_model=StaffResponse)
@require_roles(["SUPER_ADMIN"])
async def create_staff(
    data: StaffCreate,
    current_user: User = Depends(get_current_user),
    service: StaffService = Depends(get_staff_service)
):
    user = await service.create_staff(data)
    return map_response(user)

@router.get("", response_model=List[StaffResponse])
@require_roles(["SUPER_ADMIN"])
async def list_staff(
    current_user: User = Depends(get_current_user),
    service: StaffService = Depends(get_staff_service)
):
    users = await service.get_all_staff()
    return [map_response(u) for u in users]

@router.get("/{id}", response_model=StaffResponse)
@require_roles(["SUPER_ADMIN"])
async def get_staff(
    id: str,
    current_user: User = Depends(get_current_user),
    service: StaffService = Depends(get_staff_service)
):
    user = await service.get_staff(id)
    return map_response(user)

@router.put("/{id}", response_model=StaffResponse)
@require_roles(["SUPER_ADMIN"])
async def update_staff(
    id: str,
    data: StaffUpdate,
    current_user: User = Depends(get_current_user),
    service: StaffService = Depends(get_staff_service)
):
    user = await service.update_staff(id, data)
    return map_response(user)

@router.patch("/{id}/activate", response_model=StaffResponse)
@require_roles(["SUPER_ADMIN"])
async def activate_staff(
    id: str,
    current_user: User = Depends(get_current_user),
    service: StaffService = Depends(get_staff_service)
):
    user = await service.set_active_status(id, True)
    return map_response(user)

@router.patch("/{id}/deactivate", response_model=StaffResponse)
@require_roles(["SUPER_ADMIN"])
async def deactivate_staff(
    id: str,
    current_user: User = Depends(get_current_user),
    service: StaffService = Depends(get_staff_service)
):
    user = await service.set_active_status(id, False)
    return map_response(user)
