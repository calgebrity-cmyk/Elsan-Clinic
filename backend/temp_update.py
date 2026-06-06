import asyncio
from database.database import AsyncSessionLocal
from sqlalchemy import update
from models.domain import Patient

async def main():
    async with AsyncSessionLocal() as s:
        await s.execute(
            update(Patient)
            .where(Patient.registered_by_name == None)
            .values(registered_by_name="Front Desk Reception")
        )
        await s.execute(
            update(Patient)
            .where(Patient.registered_by_name == "Receptionist")
            .values(registered_by_name="Front Desk Reception")
        )
        await s.commit()

if __name__ == "__main__":
    asyncio.run(main())
