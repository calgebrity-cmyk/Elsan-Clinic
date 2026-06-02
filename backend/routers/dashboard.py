from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from dependencies.auth import get_current_user
from middleware.rbac import require_roles
from models.domain import User
from repositories.dashboard import DashboardRepository
from services.dashboard import DashboardService
from schemas.dashboard import (
    DashboardOverview, PatientGrowthResponse, 
    VisitStatsResponse, DoctorPerformanceResponse, AppointmentTrendResponse
)

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard & Analytics"])

def get_dashboard_service(db: AsyncSession = Depends(get_db)) -> DashboardService:
    return DashboardService(DashboardRepository(db))

@router.get("/overview", response_model=DashboardOverview)
@require_roles(["SUPER_ADMIN"])
async def get_overview(
    current_user: User = Depends(get_current_user),
    service: DashboardService = Depends(get_dashboard_service)
):
    return await service.get_overview()

@router.get("/patient-growth", response_model=PatientGrowthResponse)
@require_roles(["SUPER_ADMIN"])
async def get_patient_growth(
    current_user: User = Depends(get_current_user),
    service: DashboardService = Depends(get_dashboard_service)
):
    return await service.get_patient_growth()

@router.get("/visit-stats", response_model=VisitStatsResponse)
@require_roles(["SUPER_ADMIN"])
async def get_visit_stats(
    current_user: User = Depends(get_current_user),
    service: DashboardService = Depends(get_dashboard_service)
):
    return await service.get_visit_stats()

@router.get("/doctor-performance", response_model=DoctorPerformanceResponse)
@require_roles(["SUPER_ADMIN"])
async def get_doctor_performance(
    current_user: User = Depends(get_current_user),
    service: DashboardService = Depends(get_dashboard_service)
):
    return await service.get_doctor_performance()

@router.get("/appointment-trends", response_model=AppointmentTrendResponse)
@require_roles(["SUPER_ADMIN"])
async def get_appointment_trends(
    current_user: User = Depends(get_current_user),
    service: DashboardService = Depends(get_dashboard_service)
):
    return await service.get_appointment_trends()
