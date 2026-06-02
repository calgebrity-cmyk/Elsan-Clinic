# Backend Documentation

The Elsan Clinic backend is an asynchronous, high-performance API built with **FastAPI** and **Python 3.11**.

## Tech Stack Overview
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy 2.0 (Asyncpg)
- **Migrations**: Alembic
- **Validation**: Pydantic v2
- **PDF Generation**: ReportLab
- **Cloud Storage**: Cloudinary SDK
- **Security**: PyJWT, Passlib (BCrypt)

---

## Clean Architecture

The backend strictly adheres to a clean architecture pattern to ensure that the HTTP layer is entirely decoupled from the database layer.

1. **Routers (`api/`, `routers/`)**: 
   - Responsible strictly for HTTP. They receive requests, check roles using `@require_roles`, extract parameters, and pass them to the Service layer.
2. **Services (`services/`)**: 
   - The "brain" of the application. They enforce business logic.
   - Example: `PrescriptionService` handles saving the prescription, triggering `QRService` to generate a QR, triggering `PrescriptionPDFGenerator` to build the PDF, and finally pushing it via `cloudinary_service.upload_bytes()`.
3. **Repositories (`repositories/`)**: 
   - The Data Access Layer. Contains raw `SQLAlchemy` `select()`, `insert()`, and `update()` commands. They are ignorant of HTTP errors or Pydantic schemas.
4. **Schemas (`schemas/`)**: 
   - Pydantic models for Input/Output validation. E.g., `PrescriptionCreate` dictates what the frontend must send.
5. **Models (`models/domain.py`)**: 
   - SQLAlchemy Declarative Base. Maps Python classes directly to PostgreSQL tables.

---

## Request Lifecycle

Example: **Generate PDF Prescription (`POST /api/v1/prescriptions`)**

1. **HTTP Layer**: The request enters the FastAPI router in `api/prescriptions/router.py`.
2. **Middleware/Auth**: FastAPI executes `Depends(get_current_user)`. It parses the `access_token` cookie, validates the JWT signature, and checks if the role is allowed via `@require_roles(["SUPER_ADMIN", "DOCTOR"])`.
3. **Validation**: Pydantic checks the JSON payload against `PrescriptionCreate`. If invalid, an automatic `422 Unprocessable Entity` is returned.
4. **Service Dispatch**: Router calls `PrescriptionService.create_prescription()`.
5. **DB Insertion**: Service calls `PrescriptionRepository.create()`.
6. **Asset Generation**: Service builds the QR Code in memory, then passes it to `PrescriptionPDFGenerator` which builds a `io.BytesIO()` PDF stream.
7. **Cloud Upload**: Service passes the byte stream to `upload_bytes()`, receiving a secure Cloudinary URL.
8. **Final DB Update**: The Service updates the prescription row with the new Cloudinary URL.
9. **HTTP Response**: The router returns the final database object, serialized cleanly through the `PrescriptionResponse` Pydantic model.

---

## Security Modules

- **JWT Authentication**: Managed in `dependencies/auth.py`. Keys are generated, signed, and placed inside secure HTTPOnly cookies.
- **Role-Based Access Control**: `middleware/rbac.py` contains decorators that inspect the JWT role claim before permitting router execution.
- **Audit Logging**: `services/audit_service.py` intercepts high-risk activities (PDF Downloads, Signature Changes) and permanently records the `user_id` and timestamp in the `audit_logs` table.
