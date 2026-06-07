from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_
from typing import List, Optional
import uuid

from models.domain import Patient, PatientDoctorMapping, Doctor, User
from schemas.patients import PatientCreate, PatientUpdate

class PatientRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_patients(self, skip: int = 0, limit: int = 100) -> List[Patient]:
        result = await self.db.execute(select(Patient).order_by(Patient.created_at.desc()).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def get_patient_by_id(self, patient_id: uuid.UUID) -> Optional[Patient]:
        result = await self.db.execute(select(Patient).filter(Patient.id == patient_id))
        return result.scalar_one_or_none()

    async def search_patients(self, query: str) -> List[Patient]:
        search = f"%{query}%"
        stmt = select(Patient).filter(
            or_(
                Patient.full_name.ilike(search),
                Patient.phone.ilike(search),
                Patient.patient_code.ilike(search)
            )
        ).order_by(Patient.created_at.desc())
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def create_patient(self, data: dict) -> Patient:
        patient = Patient(**data)
        self.db.add(patient)
        await self.db.flush()
        return patient

    async def update_patient(self, patient: Patient, update_data: dict) -> Patient:
        for key, value in update_data.items():
            setattr(patient, key, value)
        await self.db.flush()
        return patient

    async def delete_patient(self, patient: Patient) -> None:
        patient.is_active = False
        await self.db.flush()

    async def assign_doctor(self, patient_id: uuid.UUID, doctor_id: uuid.UUID) -> PatientDoctorMapping:
        # First, deactivate any existing mapping
        stmt = select(PatientDoctorMapping).filter(
            PatientDoctorMapping.patient_id == patient_id,
            PatientDoctorMapping.is_active == True
        )
        result = await self.db.execute(stmt)
        existing = result.scalar_one_or_none()
        if existing:
            existing.is_active = False

        mapping = PatientDoctorMapping(
            patient_id=patient_id,
            doctor_id=doctor_id,
            is_active=True
        )
        self.db.add(mapping)
        await self.db.flush()
        return mapping

    async def get_assigned_doctor(self, patient_id: uuid.UUID) -> Optional[Doctor]:
        from sqlalchemy.orm import selectinload
        stmt = select(Doctor).join(PatientDoctorMapping).filter(
            PatientDoctorMapping.patient_id == patient_id,
            PatientDoctorMapping.is_active == True
        ).options(selectinload(Doctor.user))
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_doctor_assigned_patients(self, doctor_id: uuid.UUID) -> List[Patient]:
        stmt = select(Patient).join(PatientDoctorMapping).filter(
            PatientDoctorMapping.doctor_id == doctor_id,
            PatientDoctorMapping.is_active == True,
            Patient.is_active == True
        ).order_by(Patient.created_at.desc())
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
