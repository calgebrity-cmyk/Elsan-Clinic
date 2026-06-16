from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings

from routers.auth import router as auth_router
from routers.staff import router as staff_router
from routers.doctors import router as doctors_router
from routers.dashboard import router as dashboard_router
from routers.patients import router as patients_router
from routers.appointments import router as appointments_router
from api.medicines.router import router as medicines_router
from api.prescriptions.router import router as prescriptions_router
from api.whatsapp.router import router as whatsapp_router
import asyncio
from contextlib import asynccontextmanager

from routers.visits import router as visits_router
from routers.admissions import router as admissions_router
from routers.settings import router as settings_router
from routers.audit_logs import router as audit_router
from routers.rosters import router as rosters_router
from routers.leaves import router as leaves_router
from routers.notifications import router as notifications_router
from services.cron_scheduler import run_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start the background scheduler
    task = asyncio.create_task(run_scheduler())
    yield
    # Shutdown: Cancel the task
    task.cancel()

app = FastAPI(title="Elsan Clinic Backend API", version="1.0.0", lifespan=lifespan)

# Enable CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://elsanpublichealth.com",
    "https://www.elsanpublichealth.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:[0-9]+)?|https?://(.*\.)?elsanpublichealth\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(staff_router)
app.include_router(doctors_router)
app.include_router(dashboard_router)
app.include_router(patients_router)
app.include_router(appointments_router)
app.include_router(medicines_router)
app.include_router(prescriptions_router)
app.include_router(whatsapp_router)
app.include_router(visits_router)
app.include_router(admissions_router)
app.include_router(settings_router)
app.include_router(audit_router)
app.include_router(rosters_router)
app.include_router(leaves_router)
app.include_router(notifications_router)
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Elsan Clinic API is running"}
