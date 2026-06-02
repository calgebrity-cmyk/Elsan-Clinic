from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, case
from sqlalchemy.future import select
from datetime import datetime, timezone
from models.domain import User, Doctor, Patient, Visit, Prescription, Appointment, WhatsAppLog, RoleEnum, WhatsAppStatus, AppointmentStatus

class DashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_total_patients(self) -> int:
        result = await self.db.execute(select(func.count(Patient.id)))
        return result.scalar() or 0

    async def get_total_doctors(self) -> int:
        result = await self.db.execute(select(func.count(Doctor.id)))
        return result.scalar() or 0

    async def get_total_staff(self) -> int:
        result = await self.db.execute(select(func.count(User.id)).where(User.role.in_([RoleEnum.SUPER_ADMIN, RoleEnum.RECEPTIONIST])))
        return result.scalar() or 0

    async def get_total_visits(self) -> int:
        result = await self.db.execute(select(func.count(Visit.id)))
        return result.scalar() or 0

    async def get_total_prescriptions(self) -> int:
        result = await self.db.execute(select(func.count(Prescription.id)))
        return result.scalar() or 0

    async def get_todays_appointments(self) -> int:
        today = datetime.now(timezone.utc).date()
        result = await self.db.execute(select(func.count(Appointment.id)).where(Appointment.appointment_date == today))
        return result.scalar() or 0

    async def get_whatsapp_deliveries(self) -> int:
        result = await self.db.execute(select(func.count(WhatsAppLog.id)).where(WhatsAppLog.status == WhatsAppStatus.DELIVERED))
        return result.scalar() or 0

    # Aggregation methods
    async def get_patient_growth(self) -> list[tuple]:
        # Truncate by day
        stmt = select(
            func.date(Patient.created_at).label("date"), 
            func.count(Patient.id).label("count")
        ).group_by(func.date(Patient.created_at)).order_by(func.date(Patient.created_at))
        result = await self.db.execute(stmt)
        return result.all()

    async def get_visit_stats(self, group_by: str = "day") -> list[tuple]:
        if group_by == "month":
            # PostgreSQL specific: date_trunc
            stmt = select(
                func.date_trunc('month', Visit.created_at).label("date"),
                func.count(Visit.id).label("count")
            ).group_by(func.date_trunc('month', Visit.created_at)).order_by(func.date_trunc('month', Visit.created_at))
        else:
            stmt = select(
                func.date(Visit.created_at).label("date"),
                func.count(Visit.id).label("count")
            ).group_by(func.date(Visit.created_at)).order_by(func.date(Visit.created_at))
        
        result = await self.db.execute(stmt)
        return result.all()

    async def get_doctor_performance(self) -> list[tuple]:
        stmt = select(
            User.full_name,
            func.count(Visit.id.distinct()).label("total_visits"),
            func.count(Prescription.id.distinct()).label("total_prescriptions")
        ).select_from(Doctor).join(User, Doctor.user_id == User.id)\
         .outerjoin(Visit, Visit.doctor_id == Doctor.id)\
         .outerjoin(Prescription, Prescription.doctor_id == Doctor.id)\
         .group_by(User.full_name)
        result = await self.db.execute(stmt)
        return result.all()

    async def get_appointment_trends(self) -> list[tuple]:
        stmt = select(
            Appointment.appointment_date,
            func.sum(case((Appointment.status == AppointmentStatus.SCHEDULED, 1), else_=0)).label("scheduled"),
            func.sum(case((Appointment.status == AppointmentStatus.COMPLETED, 1), else_=0)).label("completed"),
            func.sum(case((Appointment.status == AppointmentStatus.CANCELLED, 1), else_=0)).label("cancelled")
        ).group_by(Appointment.appointment_date).order_by(Appointment.appointment_date)
        result = await self.db.execute(stmt)
        return result.all()
