import pytest
from httpx import AsyncClient
from main import app
from models.domain import User, RoleEnum
from core.security import get_password_hash

# Note: In a real test setup, you would have a pytest fixture that spins up a test DB
# and yields an AsyncSession, overriding the `get_db` dependency.
# Here we mock out the database to provide basic structural unit testing.

@pytest.mark.asyncio
async def test_read_root():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Elsan Clinic API is running"}

@pytest.mark.asyncio
async def test_login_missing_fields():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/login", json={})
    assert response.status_code == 422 # Unprocessable Entity validation error

@pytest.mark.asyncio
async def test_staff_creation_unauthorized():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Without auth token
        response = await ac.post("/api/v1/staff", json={
            "full_name": "Test Staff",
            "email": "test@elsan.com",
            "phone": "1234567890",
            "password": "password123",
            "role": "RECEPTIONIST"
        })
    assert response.status_code == 401
