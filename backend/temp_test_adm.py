import asyncio
from database.database import AsyncSessionLocal
from sqlalchemy import select
from models.domain import Patient, Doctor, Admission

async def main():
    async with AsyncSessionLocal() as s:
        p = (await s.execute(select(Patient).limit(1))).scalar_one()
        d = (await s.execute(select(Doctor).limit(1))).scalar_one()
        
        adm = Admission(
            patient_id=p.id,
            admitting_doctor_id=d.id,
            reason_for_admission="Test fix",
            room_bed_number="101"
        )
        s.add(adm)
        await s.commit()
        print("Successfully created admission!")

if __name__ == "__main__":
    asyncio.run(main())
