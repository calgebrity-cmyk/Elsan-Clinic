# DevOps Documentation

The Elsan Clinic platform is designed for scalable, containerized, cloud-native deployments.

## PostgreSQL Setup (Supabase / RDS)
- The application relies heavily on `UUID` extensions in PostgreSQL. 
- Ensure that the `uuid-ossp` extension is enabled in your database.
- Use `Asyncpg` driver for connections (`postgresql+asyncpg://`).

## Cloudinary Configuration
Cloudinary acts as our CDN and Asset Server.
1. Create a free/paid Cloudinary account.
2. Provide the `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` to the backend.
3. The backend automatically creates folders (`elsan-clinic/prescriptions`, etc.) as needed.

## Backend Deployment (Railway / Render / AWS)
FastAPI can be easily deployed using Docker or a standard Procfile.

**Procfile (Railway/Render):**
```bash
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Docker Setup:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Database Migrations in Production:**
Before starting the web server in a CI/CD pipeline, always execute:
```bash
alembic upgrade head
```

## Frontend Deployment (Vercel)
Next.js 15 is heavily optimized for Vercel.
1. Connect your GitHub repository to Vercel.
2. Set the Root Directory to `frontend`.
3. Set the Environment Variable `NEXT_PUBLIC_API_URL` to your production FastAPI URL (e.g., `https://api.elsanclinic.com/api/v1`).
4. Trigger a deployment.

## CI/CD Workflow (GitHub Actions)
A standard workflow for this stack involves:
1. Trigger on `push` to `main`.
2. Run `pytest` on the `backend` directory.
3. Run `npm run build` on the `frontend` directory to catch type errors.
4. On success, trigger webhook to Railway/Vercel for automatic deployment.
