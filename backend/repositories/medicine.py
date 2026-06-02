import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_
from models.domain import ClinicMedicine
from schemas.medicine import ClinicMedicineCreate, ClinicMedicineUpdate

class MedicineRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: ClinicMedicineCreate) -> ClinicMedicine:
        medicine = ClinicMedicine(**data.model_dump())
        self.db.add(medicine)
        await self.db.flush()
        await self.db.refresh(medicine)
        return medicine

    async def get_by_id(self, med_id: uuid.UUID) -> ClinicMedicine | None:
        result = await self.db.execute(select(ClinicMedicine).where(ClinicMedicine.id == med_id))
        return result.scalar_one_or_none()

    async def get_all(self, search: str = None) -> list[ClinicMedicine]:
        stmt = select(ClinicMedicine)
        if search:
            stmt = stmt.where(or_(
                ClinicMedicine.name.ilike(f"%{search}%"),
                ClinicMedicine.generic_name.ilike(f"%{search}%")
            ))
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def update(self, medicine: ClinicMedicine, data: ClinicMedicineUpdate) -> ClinicMedicine:
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(medicine, key, value)
        await self.db.flush()
        await self.db.refresh(medicine)
        return medicine

    async def delete(self, medicine: ClinicMedicine) -> None:
        await self.db.delete(medicine)
        await self.db.flush()
