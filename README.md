# Elsan Clinic Management System

## Project Overview

**Business Purpose:**  
Elsan Clinic Management System is a modern, enterprise-grade digital platform designed to completely eliminate handwritten prescriptions, centralize patient records, reduce waiting times, and build a professional digital presence for the clinic. It enables doctors and receptionists to seamlessly schedule appointments, record clinical visits, generate PDF prescriptions, and distribute those prescriptions to patients securely.

**Key Features:**
- 🏥 **Staff & Doctor Management**: Role-Based Access Control (RBAC) for Super Admins, Doctors, and Receptionists.
- 👨‍⚕️ **Patient Records**: Secure, centralized repository of patient medical history.
- 📅 **Appointments & Visits**: Schedule appointments and convert them into comprehensive visit logs.
- 📝 **Digital Prescriptions**: Dynamically generated, professional A4 PDF prescriptions using ReportLab.
- ☁️ **Cloudinary Integration**: Secure cloud storage for clinic logos, doctor signatures, and PDF prescriptions.
- 🔐 **Cryptographic Verification**: Auto-generated QR codes on every prescription for instant authenticity verification.

**Tech Stack:**
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, ShadCN UI, React Query (TanStack), React Hook Form, Zod, Axios.
- **Backend**: FastAPI, Python 3.11, PostgreSQL, SQLAlchemy 2.0 (Async), Alembic, Pydantic v2, PyJWT.
- **Asset Generation**: ReportLab (PDFs), qrcode (Validation).
- **Storage**: Cloudinary (Assets/PDFs).

**Architecture Overview:**  
The system employs a Clean Architecture paradigm. The Frontend leverages Server-Side Rendering capabilities of Next.js mixed with robust Client-Side data fetching via React Query. The Backend is an asynchronous Python API utilizing the Repository-Service pattern, ensuring a strict separation of concerns between HTTP routing, business logic, and database operations.

---

## Installation Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.11+)
- PostgreSQL Server (or Supabase URL)
- Cloudinary Account

### 1. Database Setup
1. Create a PostgreSQL database (e.g., `elsan_clinic`).
2. Run migrations (from the `backend` directory):
   ```bash
   alembic upgrade head
   ```

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file (see Environment Variables below).
5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file.
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## Environment Variables

### Backend (`backend/.env`)

```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## Folder Structure

```
elsan-clinic/
├── backend/
│   ├── api/            # HTTP Routers (Medicines, Prescriptions)
│   ├── routers/        # HTTP Routers (Auth, Staff, Doctors)
│   ├── core/           # Security, Hashing, Settings
│   ├── database/       # SQLAlchemy Async Engine
│   ├── dependencies/   # FastAPI Dependency Injections (Auth)
│   ├── middleware/     # RBAC Middlewares
│   ├── models/         # SQLAlchemy Domain Models
│   ├── pdf/            # ReportLab Prescription Generator
│   ├── repositories/   # Database Data Access Layer
│   ├── schemas/        # Pydantic DTOs
│   └── services/       # Business Logic & External APIs (Cloudinary, QR)
├── frontend/
│   ├── src/
│   │   ├── app/        # Next.js App Router Pages
│   │   ├── components/ # ShadCN & Custom UI Components
│   │   ├── hooks/      # React Query Custom Hooks
│   │   ├── lib/        # Axios & React Query Configs
│   │   ├── schemas/    # Zod Validation Schemas
│   │   └── services/   # Axios API Wrappers
```

---

## API Documentation Link

Once the backend is running, the interactive Swagger UI API documentation is available at:  
👉 **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## Deployment Guide

- **Database**: Deploy PostgreSQL on Railway, Render, or use Supabase.
- **Backend**: Deploy the FastAPI app via Docker or directly on Railway/Render using a `Procfile` or `uvicorn main:app --host 0.0.0.0 --port $PORT`.
- **Frontend**: Deploy the Next.js app to Vercel. Ensure `NEXT_PUBLIC_API_URL` points to your production backend URL.

---

## License
Proprietary - Elsan Clinic Management System. All rights reserved.
