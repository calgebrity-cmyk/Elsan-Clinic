import asyncio
import pprint
from database.database import async_session_maker
from sqlalchemy import select
from models.domain import Patient

async def main():
    async with async_session_maker() as s:
        res = await s.execute(select(Patient.id, Patient.full_name, Patient.registered_by_name))
        pprint.pprint(res.all())

if __name__ == "__main__":
    asyncio.run(main())
