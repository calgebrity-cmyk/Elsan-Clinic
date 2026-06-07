import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from models.domain import Prescription, PrescriptionMedicine, Doctor
from schemas.prescription import PrescriptionCreate, PrescriptionUpdate

class PrescriptionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: PrescriptionCreate) -> Prescription:
        presc_data = data.model_dump(exclude={"medicines", "symptoms", "next_visit_date"})
        prescription = Prescription(**presc_data)
        self.db.add(prescription)
        await self.db.flush()
        
        for med_data in data.medicines:
            med_dict = med_data.model_dump()
            presc_med = PrescriptionMedicine(**med_dict, prescription_id=prescription.id)
            self.db.add(presc_med)
            
        await self.db.flush()
        await self.db.refresh(prescription)
        
        # Load relationships
        result = await self.db.execute(
            select(Prescription)
            .options(selectinload(Prescription.medicines))
            .where(Prescription.id == prescription.id)
        )
        return result.scalar_one()

    async def get_by_id(self, presc_id: uuid.UUID) -> Prescription | None:
        result = await self.db.execute(
            select(Prescription)
            .options(
                selectinload(Prescription.medicines),
                selectinload(Prescription.doctor).selectinload(Doctor.user),
                selectinload(Prescription.patient),
                selectinload(Prescription.visit)
            )
            .where(Prescription.id == presc_id)
        )
        return result.scalar_one_or_none()

    async def get_by_patient(self, patient_id: uuid.UUID) -> list[Prescription]:
        result = await self.db.execute(
            select(Prescription)
            .options(selectinload(Prescription.medicines))
            .where(Prescription.patient_id == patient_id)
            .order_by(Prescription.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_history(self, patient_id: uuid.UUID = None, doctor_id: uuid.UUID = None, visit_id: uuid.UUID = None, start_date=None, end_date=None, skip: int = 0, limit: int = 100) -> list[Prescription]:
        stmt = select(Prescription).options(
            selectinload(Prescription.medicines),
            selectinload(Prescription.doctor).selectinload(Doctor.user),
            selectinload(Prescription.patient),
            selectinload(Prescription.visit)
        )
        
        if patient_id:
            stmt = stmt.where(Prescription.patient_id == patient_id)
        if doctor_id:
            stmt = stmt.where(Prescription.doctor_id == doctor_id)
        if visit_id:
            stmt = stmt.where(Prescription.visit_id == visit_id)
        if start_date:
            stmt = stmt.where(Prescription.created_at >= start_date)
        if end_date:
            stmt = stmt.where(Prescription.created_at <= end_date)
            
        stmt = stmt.order_by(Prescription.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def update(self, prescription: Prescription, data: PrescriptionUpdate) -> Prescription:
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(prescription, key, value)
        await self.db.flush()
        await self.db.refresh(prescription)
        return prescription

    async def update_pdf_urls(self, presc_id: uuid.UUID, pdf_url: str, public_id: str) -> None:
        result = await self.db.execute(select(Prescription).where(Prescription.id == presc_id))
        presc = result.scalar_one_or_none()
        if presc:
            presc.pdf_url = pdf_url
            presc.cloudinary_public_id = public_id
            await self.db.flush()
