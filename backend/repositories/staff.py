from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.domain import User, RoleEnum

class StaffRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    async def get_by_phone(self, phone: str) -> User | None:
        result = await self.db.execute(select(User).where(User.phone == phone))
        return result.scalars().first()

    async def get_by_id(self, user_id: str) -> User | None:
        result = await self.db.execute(
            select(User).where(User.id == user_id, User.role.in_([RoleEnum.SUPER_ADMIN, RoleEnum.RECEPTIONIST]))
        )
        return result.scalars().first()

    async def get_all_staff(self) -> list[User]:
        result = await self.db.execute(
            select(User).where(User.role.in_([RoleEnum.SUPER_ADMIN, RoleEnum.RECEPTIONIST]))
        )
        return list(result.scalars().all())

    async def create(self, user: User) -> User:
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def update(self, user: User) -> User:
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
