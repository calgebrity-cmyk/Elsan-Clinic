from pydantic import BaseModel
from typing import List

class DashboardOverview(BaseModel):
    total_patients: int
    total_doctors: int
    total_staff: int
    total_visits: int
    total_prescriptions: int
    todays_appointments: int
    whatsapp_deliveries: int

class TrendPoint(BaseModel):
    date: str
    count: int

class PatientGrowthResponse(BaseModel):
    trends: List[TrendPoint]

class VisitStatsResponse(BaseModel):
    daily: List[TrendPoint]
    monthly: List[TrendPoint]

class DoctorPerformancePoint(BaseModel):
    doctor_name: str
    total_visits: int
    total_prescriptions: int

class DoctorPerformanceResponse(BaseModel):
    performance: List[DoctorPerformancePoint]

class AppointmentTrendPoint(BaseModel):
    date: str
    scheduled: int
    completed: int
    cancelled: int

class AppointmentTrendResponse(BaseModel):
    trends: List[AppointmentTrendPoint]
