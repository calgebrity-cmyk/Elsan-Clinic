from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from database.database import get_db
from dependencies.auth import get_current_user
from middleware.rbac import require_roles
from models.domain import User
from schemas.visits import VisitCreate, VisitUpdate, VisitResponse
from repositories.visits import VisitRepository
from services.visits import VisitService

router = APIRouter(prefix="/api/v1/visits", tags=["Visit Management"])

def get_visit_service(db: AsyncSession = Depends(get_db)) -> VisitService:
    return VisitService(VisitRepository(db), db)

def map_visit_response(visit) -> VisitResponse:
    resp_dict = {
        "id": visit.id,
        "patient_id": visit.patient_id,
        "doctor_id": visit.doctor_id,
        "appointment_id": visit.appointment_id,
        "symptoms": visit.symptoms,
        "diagnosis": visit.diagnosis,
        "doctor_notes": visit.doctor_notes,
        "next_visit_date": visit.next_visit_date,
        "created_at": visit.created_at,
    }
    
    # Check if relationships are loaded (we can add eager loading later if needed)
    if hasattr(visit, 'doctor') and visit.doctor:
        resp_dict["doctor_name"] = visit.doctor.user.full_name
    if hasattr(visit, 'patient') and visit.patient:
        resp_dict["patient_name"] = visit.patient.full_name
        
    return VisitResponse(**resp_dict)

@router.get("", response_model=List[VisitResponse])
@require_roles(["SUPER_ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE", "DIRECTOR", "ANALYST"])
async def get_all_visits(
    current_user: User = Depends(get_current_user),
    service: VisitService = Depends(get_visit_service)
):
    visits = await service.get_all_visits()
    return [map_visit_response(v) for v in visits]

@router.get("/patient/{patient_id}", response_model=List[VisitResponse])
@require_roles(["SUPER_ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE"])
async def get_patient_visits(
    patient_id: str,
    current_user: User = Depends(get_current_user),
    service: VisitService = Depends(get_visit_service)
):
    visits = await service.get_visits_by_patient(patient_id)
    return [map_visit_response(v) for v in visits]

@router.get("/{id}", response_model=VisitResponse)
@require_roles(["SUPER_ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE"])
async def get_visit(
    id: str,
    current_user: User = Depends(get_current_user),
    service: VisitService = Depends(get_visit_service)
):
    visit = await service.get_visit(id)
    return map_visit_response(visit)

@router.post("", response_model=VisitResponse, status_code=status.HTTP_201_CREATED)
@require_roles(["SUPER_ADMIN", "RECEPTIONIST", "DOCTOR"])
async def create_visit(
    data: VisitCreate,
    current_user: User = Depends(get_current_user),
    service: VisitService = Depends(get_visit_service)
):
    visit = await service.create_visit(data)
    return map_visit_response(visit)

@router.put("/{id}", response_model=VisitResponse)
@require_roles(["SUPER_ADMIN", "DOCTOR"])
async def update_visit(
    id: str,
    data: VisitUpdate,
    current_user: User = Depends(get_current_user),
    service: VisitService = Depends(get_visit_service)
):
    visit = await service.update_visit(id, data)
    return map_visit_response(visit)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
@require_roles(["SUPER_ADMIN"])
async def delete_visit(
    id: str,
    current_user: User = Depends(get_current_user),
    service: VisitService = Depends(get_visit_service)
):
    await service.delete_visit(id)
