import asyncio
import logging
from datetime import datetime, timedelta, timezone
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from database.database import AsyncSessionLocal
from models.domain import Visit
from services.whatsapp_service import whatsapp_service

logger = logging.getLogger(__name__)

async def check_reminders():
    """
    Checks for visits where next_visit_date is exactly tomorrow.
    Sends a WhatsApp follow-up reminder.
    """
    try:
        tomorrow = (datetime.now(timezone.utc) + timedelta(days=1)).date()
        logger.info(f"CronScheduler: Checking for follow-up reminders for {tomorrow}")

        async with AsyncSessionLocal() as db:
            query = select(Visit).options(selectinload(Visit.patient), selectinload(Visit.doctor)).where(Visit.next_visit_date == tomorrow)
            result = await db.execute(query)
            visits = result.scalars().all()

            count = 0
            for visit in visits:
                if visit.patient and visit.patient.phone:
                    doctor_name = visit.doctor.user.full_name if visit.doctor and visit.doctor.user else "your doctor"
                    # Simulated send - in real app, we would log this in a separate table like ReminderLogs to prevent duplicates
                    await whatsapp_service.send_appointment_reminder(
                        patient_phone=visit.patient.phone,
                        date=str(tomorrow),
                        time="10:00 AM", # Assuming 10 AM if no specific time given
                        doctor_name=f"Dr. {doctor_name}"
                    )
                    count += 1
            
            if count > 0:
                logger.info(f"CronScheduler: Successfully sent {count} WhatsApp reminders.")
    except Exception as e:
        logger.error(f"CronScheduler Error: {e}")

async def run_scheduler():
    """
    Background loop that runs continuously while the FastAPI app is alive.
    """
    logger.info("CronScheduler started.")
    # Wait a few seconds to let app boot
    await asyncio.sleep(5)
    
    while True:
        await check_reminders()
        # Wait for 24 hours before checking again. 
        # For demonstration purposes, we wait 1 minute.
        await asyncio.sleep(86400) # 86400 seconds = 24 hours
