import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from repositories.medicine import MedicineRepository
from schemas.medicine import ClinicMedicineCreate, ClinicMedicineUpdate

class MedicineService:
    def __init__(self, db: AsyncSession):
        self.repo = MedicineRepository(db)

    async def create_medicine(self, data: ClinicMedicineCreate):
        return await self.repo.create(data)

    async def get_medicine(self, med_id: uuid.UUID):
        return await self.repo.get_by_id(med_id)

    async def list_medicines(self, search: str = None):
        return await self.repo.get_all(search)

    async def update_medicine(self, med_id: uuid.UUID, data: ClinicMedicineUpdate):
        medicine = await self.repo.get_by_id(med_id)
        if not medicine:
            return None
        return await self.repo.update(medicine, data)

    async def delete_medicine(self, med_id: uuid.UUID):
        medicine = await self.repo.get_by_id(med_id)
        if medicine:
            await self.repo.delete(medicine)
        return True
