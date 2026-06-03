import logging
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from models.domain import WhatsAppLog, WhatsAppStatus, Prescription

logger = logging.getLogger(__name__)

class WhatsAppService:
    def __init__(self):
        # In a real app, you would initialize your Meta/WhatsApp API client here using settings
        self.api_url = "https://graph.facebook.com/v17.0"

    async def send_prescription_pdf(
        self, 
        db: AsyncSession, 
        prescription_id: str, 
        patient_phone: str, 
        pdf_url: str,
        patient_id: str
    ) -> Optional[WhatsAppLog]:
        """
        Simulates sending a WhatsApp message with the prescription PDF.
        """
        logger.info(f"Sending WhatsApp Prescription to {patient_phone}. PDF: {pdf_url}")
        
        # Simulated success response from WhatsApp API
        message_id = "wa_msg_" + str(prescription_id)[:8]
        
        # Log the attempt in our database
        log_entry = WhatsAppLog(
            patient_id=patient_id,
            prescription_id=prescription_id,
            whatsapp_message_id=message_id,
            status=WhatsAppStatus.SENT,
            phone_number=patient_phone
        )
        
        db.add(log_entry)
        
        # Update the prescription record to mark as sent
        prescription = await db.get(Prescription, prescription_id)
        if prescription:
            prescription.sent_whatsapp = True
            
        await db.commit()
        await db.refresh(log_entry)
        
        return log_entry

    async def send_appointment_reminder(self, patient_phone: str, date: str, time: str, doctor_name: str) -> bool:
        """
        Simulates sending a WhatsApp reminder for an upcoming appointment.
        """
        message = f"Reminder: You have an appointment with {doctor_name} on {date} at {time}."
        logger.info(f"Sending WhatsApp Reminder to {patient_phone}: {message}")
        
        # Simulated success
        return True

whatsapp_service = WhatsAppService()
