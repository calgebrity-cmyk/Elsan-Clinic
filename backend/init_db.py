import asyncio
from database.database import engine, Base
from models.domain import User, AuditLog, Prescription, ClinicMedicine, PrescriptionMedicine

async def init_models():
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created successfully!")

if __name__ == "__main__":
    asyncio.run(init_models())
