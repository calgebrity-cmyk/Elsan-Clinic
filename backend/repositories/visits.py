from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
import uuid

from models.domain import Visit
from schemas.visits import VisitCreate, VisitUpdate

class VisitRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_visits(self) -> List[Visit]:
        from sqlalchemy.orm import selectinload
        from models.domain import Doctor
        result = await self.db.execute(
            select(Visit)
            .options(selectinload(Visit.doctor).selectinload(Doctor.user), selectinload(Visit.patient))
            .order_by(Visit.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_visits_by_patient(self, patient_id: uuid.UUID) -> List[Visit]:
        from sqlalchemy.orm import selectinload
        from models.domain import Doctor
        result = await self.db.execute(
            select(Visit)
            .filter(Visit.patient_id == patient_id)
            .options(selectinload(Visit.doctor).selectinload(Doctor.user), selectinload(Visit.patient))
            .order_by(Visit.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_visit_by_id(self, visit_id: uuid.UUID) -> Optional[Visit]:
        from sqlalchemy.orm import selectinload
        from models.domain import Doctor
        result = await self.db.execute(
            select(Visit)
            .filter(Visit.id == visit_id)
            .options(selectinload(Visit.doctor).selectinload(Doctor.user), selectinload(Visit.patient))
        )
        return result.scalar_one_or_none()

    async def create_visit(self, data: dict) -> Visit:
        visit = Visit(**data)
        self.db.add(visit)
        await self.db.flush()
        return visit

    async def update_visit(self, visit: Visit, update_data: dict) -> Visit:
        for key, value in update_data.items():
            setattr(visit, key, value)
        await self.db.flush()
        return visit

    async def delete_visit(self, visit: Visit) -> None:
        await self.db.delete(visit)
        await self.db.flush()
