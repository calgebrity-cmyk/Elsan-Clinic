from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from models.domain import User, Doctor, RoleEnum

class DoctorRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    async def get_by_phone(self, phone: str) -> User | None:
        result = await self.db.execute(select(User).where(User.phone == phone))
        return result.scalars().first()

    async def get_doctor_by_id(self, doctor_id: str) -> Doctor | None:
        result = await self.db.execute(
            select(Doctor).options(selectinload(Doctor.user)).where(Doctor.id == doctor_id)
        )
        return result.scalars().first()

    async def get_all_doctors(self) -> list[Doctor]:
        result = await self.db.execute(
            select(Doctor).options(selectinload(Doctor.user))
        )
        return list(result.scalars().all())

    async def create(self, user: User, doctor: Doctor) -> Doctor:
        self.db.add(user)
        # Flush to get user.id before assigning it to doctor
        await self.db.flush()
        doctor.user_id = user.id
        self.db.add(doctor)
        await self.db.commit()
        await self.db.refresh(doctor)
        # Ensure user relationship is loaded
        await self.db.refresh(doctor, ['user'])
        return doctor

    async def update(self, user: User, doctor: Doctor) -> Doctor:
        self.db.add(user)
        self.db.add(doctor)
        await self.db.commit()
        await self.db.refresh(doctor)
        await self.db.refresh(doctor, ['user'])
        return doctor

    async def delete(self, user: User, doctor: Doctor) -> None:
        await self.db.delete(doctor)
        await self.db.delete(user)
        await self.db.commit()
