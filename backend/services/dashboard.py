from repositories.dashboard import DashboardRepository
from schemas.dashboard import (
    DashboardOverview, PatientGrowthResponse, TrendPoint, 
    VisitStatsResponse, DoctorPerformanceResponse, DoctorPerformancePoint,
    AppointmentTrendResponse, AppointmentTrendPoint
)

class DashboardService:
    def __init__(self, repo: DashboardRepository):
        self.repo = repo

    async def get_overview(self) -> DashboardOverview:
        return DashboardOverview(
            total_patients=await self.repo.get_total_patients(),
            total_doctors=await self.repo.get_total_doctors(),
            total_staff=await self.repo.get_total_staff(),
            total_visits=await self.repo.get_total_visits(),
            total_prescriptions=await self.repo.get_total_prescriptions(),
            todays_appointments=await self.repo.get_todays_appointments(),
            whatsapp_deliveries=await self.repo.get_whatsapp_deliveries()
        )

    async def get_patient_growth(self) -> PatientGrowthResponse:
        data = await self.repo.get_patient_growth()
        trends = [TrendPoint(date=str(row[0]), count=row[1]) for row in data if row[0] is not None]
        return PatientGrowthResponse(trends=trends)

    async def get_visit_stats(self) -> VisitStatsResponse:
        daily_data = await self.repo.get_visit_stats(group_by="day")
        monthly_data = await self.repo.get_visit_stats(group_by="month")
        
        daily_trends = [TrendPoint(date=str(row[0]), count=row[1]) for row in daily_data if row[0] is not None]
        
        # Monthly trunc usually returns datetime object in asyncpg, so extract date format YYYY-MM
        monthly_trends = []
        for row in monthly_data:
            if row[0] is not None:
                d = row[0]
                if hasattr(d, "strftime"):
                    monthly_trends.append(TrendPoint(date=d.strftime("%Y-%m"), count=row[1]))
                else:
                    monthly_trends.append(TrendPoint(date=str(d), count=row[1]))

        return VisitStatsResponse(daily=daily_trends, monthly=monthly_trends)

    async def get_doctor_performance(self) -> DoctorPerformanceResponse:
        data = await self.repo.get_doctor_performance()
        performance = [
            DoctorPerformancePoint(doctor_name=row[0], total_visits=row[1], total_prescriptions=row[2])
            for row in data
        ]
        return DoctorPerformanceResponse(performance=performance)

    async def get_appointment_trends(self) -> AppointmentTrendResponse:
        data = await self.repo.get_appointment_trends()
        trends = [
            AppointmentTrendPoint(
                date=str(row[0]), 
                scheduled=int(row[1] or 0), 
                completed=int(row[2] or 0), 
                cancelled=int(row[3] or 0)
            ) 
            for row in data if row[0] is not None
        ]
        return AppointmentTrendResponse(trends=trends)
