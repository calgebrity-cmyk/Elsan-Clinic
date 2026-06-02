import asyncio
from database.database import AsyncSessionLocal
from models.domain import User, RoleEnum
from core.security import get_password_hash
from sqlalchemy import select

async def seed_admin():
    async with AsyncSessionLocal() as session:
        # Check if admin already exists
        result = await session.execute(select(User).where(User.email == "admin@elsan.com"))
        admin = result.scalar_one_or_none()
        
        if not admin:
            admin = User(
                full_name="Super Admin",
                email="admin@elsan.com",
                phone="+910000000000",
                password_hash=get_password_hash("admin123"),
                role=RoleEnum.SUPER_ADMIN,
                is_active=True
            )
            session.add(admin)
            await session.commit()
            print("Super Admin created: admin@elsan.com / admin123")
        else:
            print("Admin already exists.")

if __name__ == "__main__":
    asyncio.run(seed_admin())
