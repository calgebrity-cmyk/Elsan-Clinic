from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings

from routers.auth import router as auth_router
from routers.staff import router as staff_router
from routers.doctors import router as doctors_router
from routers.dashboard import router as dashboard_router
from api.medicines.router import router as medicines_router
from api.prescriptions.router import router as prescriptions_router

app = FastAPI(title="Elsan Clinic Backend API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(staff_router)
app.include_router(doctors_router)
app.include_router(dashboard_router)
app.include_router(medicines_router)
app.include_router(prescriptions_router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Elsan Clinic API is running"}
