import uuid
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from repositories.visits import VisitRepository
from schemas.visits import VisitCreate, VisitUpdate
from models.domain import Visit

class VisitService:
    def __init__(self, repository: VisitRepository, db: AsyncSession):
        self.repository = repository
        self.db = db

    async def get_all_visits(self):
        return await self.repository.get_all_visits()

    async def get_visits_by_patient(self, patient_id: str):
        try:
            pid = uuid.UUID(patient_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid patient ID")
            
        return await self.repository.get_visits_by_patient(pid)

    async def get_visit(self, visit_id: str):
        try:
            vid = uuid.UUID(visit_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid visit ID")
            
        visit = await self.repository.get_visit_by_id(vid)
        if not visit:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Visit not found")
        return visit

    async def create_visit(self, data: VisitCreate):
        visit_data = data.model_dump(exclude_unset=True)
        # Convert string UUIDs to UUID objects for Postgres UUID columns
        try:
            visit_data["patient_id"] = uuid.UUID(data.patient_id)
            visit_data["doctor_id"] = uuid.UUID(data.doctor_id)
            if data.appointment_id:
                visit_data["appointment_id"] = uuid.UUID(data.appointment_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid UUID format for IDs")

        visit = await self.repository.create_visit(visit_data)
        await self.db.commit()
        return await self.repository.get_visit_by_id(visit.id)

    async def update_visit(self, visit_id: str, data: VisitUpdate):
        visit = await self.get_visit(visit_id)
        update_data = data.model_dump(exclude_unset=True)
        
        updated_visit = await self.repository.update_visit(visit, update_data)
        await self.db.commit()
        return await self.repository.get_visit_by_id(updated_visit.id)

    async def delete_visit(self, visit_id: str):
        visit = await self.get_visit(visit_id)
        await self.repository.delete_visit(visit)
        await self.db.commit()
