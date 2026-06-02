# Developer Maintenance Guide

This document provides essential instructions for developers taking over the Elsan Clinic Management System.

## How To Add a New API Endpoint

1. **Define the Schema (`backend/schemas/`)**:
   Create a new Pydantic v2 model representing your expected Request and Response JSON.
2. **Update the Repository (`backend/repositories/`)**:
   Write the asynchronous SQLAlchemy query (e.g., `select(MyModel).where(...)`).
3. **Write the Service (`backend/services/`)**:
   Write business logic that calls the repository and handles external services (Cloudinary/Email).
4. **Create the Router (`backend/api/` or `backend/routers/`)**:
   Define the `@router.post()` decorator, inject `Depends(get_current_user)`, and apply `@require_roles([])`.
5. **Register in `main.py`**:
   Add `app.include_router(new_router)`.

## How To Add a New Database Table

1. **Create the SQLAlchemy Model (`backend/models/domain.py`)**:
   Define your class inheriting from `Base`. Use `UUID` for primary keys.
2. **Generate Alembic Migration**:
   ```bash
   alembic revision --autogenerate -m "Add new table X"
   ```
3. **Review the Migration**:
   Open the generated file in `backend/alembic/versions/` and ensure it didn't accidentally drop existing tables or columns.
4. **Apply the Migration**:
   ```bash
   alembic upgrade head
   ```

## How To Add a New Frontend Page

1. **Create the Route (`frontend/src/app/admin/`)**:
   Create a new folder matching your desired URL path, containing a `page.tsx`.
   Example: `app/admin/reports/page.tsx` becomes `http://localhost:3000/admin/reports`.
2. **Create the API Service (`frontend/src/services/`)**:
   Add an axios wrapper function (e.g., `ReportsService.getReports()`).
3. **Create the React Query Hook (`frontend/src/hooks/`)**:
   Create `useReports()` leveraging TanStack Query to manage the loading state and caching of `ReportsService.getReports()`.
4. **Build the UI**:
   Import ShadCN components (`Card`, `Button`, `Table`) and build your page.

## Deployment & Rollback Strategy

- **Updates**: Deployments are handled via Git push to the `main` branch. GitHub Actions or Vercel/Railway will automatically build and deploy.
- **Database Rollbacks**:
  If a bad database migration is deployed, run:
  ```bash
  alembic downgrade -1
  ```
- **Code Rollbacks**: Use the Vercel Dashboard to instantly "Revert" the frontend to the previous stable build. Use Railway/Render to roll back the backend image.

## Backup & Restore Strategy

Since the application uses a managed PostgreSQL service (Supabase/RDS):
- **Backups**: Ensure automated daily backups and Point-In-Time-Recovery (PITR) are enabled on the database provider dashboard.
- **Assets**: Cloudinary manages internal asset redundancy. However, configuring an AWS S3 bucket to regularly sync with Cloudinary via webhooks is recommended for disaster recovery.

---

# Phase 2 Roadmap (Future Enhancements)

The system is architected to scale. The following modules can be bolted onto the existing Clean Architecture with minimal refactoring:

1. **WhatsApp & SMS Integration**: Hooking up the Meta Business API and Twilio to trigger automated messages when `PrescriptionService.create_prescription` completes.
2. **Patient Mobile App**: Utilizing the identical FastAPI endpoints to build a React Native or Flutter patient portal for viewing their history.
3. **AI Assistant**: Implementing an LLM to auto-fill the `symptoms` and `diagnosis` fields based on a raw voice transcript.
4. **Online Payments & Stripe**: Adding a `payments` table linked to the `visits` table to handle online consultation fees.
5. **QR Code Check-in**: Allowing walk-in patients to scan a reception QR code that automatically drops them into the `appointments` queue.
