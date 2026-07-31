---
name: backend-api
description: Use when working on the FastAPI backend: adding/modifying API routes, endpoints, Pydantic schemas, request/response models, authentication, authorization, seed data, or any backend business logic. Trigger on files under backend/app/.
---

# Backend API Skill

## Architecture (Clean Architecture)

```
backend/app/
  domain/
    models.py      → SQLAlchemy 2 ORM models (Mapped[], mapped_column)
    enums.py       → UserRole, OutcomeStatus, FacilityType
  application/
    schemas.py     → Pydantic v2 request/response schemas
    exceptions.py  → AppException (custom HTTP exceptions)
  infrastructure/
    security.py    → JWT tokens, password hashing (bcrypt via passlib)
    repositories.py → Database access layer
  presentation/
    router_auth.py         → POST /login, /register, /refresh
    router_users.py        → CRUD users
    router_facilities.py   → CRUD facilities
    router_patients.py     → CRUD patients
    router_clinical_cases.py → CRUD clinical cases
    router_audit.py        → Audit log listing
    router_sync.py         → Offline sync push/pull
  deps.py          → get_db, get_current_user dependencies
  database.py      → async engine, session factory, Base
  config.py        → pydantic-settings Settings
  main.py          → FastAPI app, lifespan, seed data
```

## Conventions

### Adding a new route
1. Define Pydantic schema in `application/schemas.py`
2. Create router in `presentation/router_<name>.py`
3. Register in `main.py`: `app.include_router(..., prefix="/api/v1")`
4. Use `Depends(get_db)` and `Depends(get_current_user)` for protected endpoints

### Model pattern
```python
class MyModel(Base):
    __tablename__ = "my_models"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    facility_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("facilities.id"), index=True)
    # ... fields ...
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
```

### Router pattern
```python
from fastapi import APIRouter, Depends
from app.deps import get_db, get_current_user

router = APIRouter(prefix="/my-resource", tags=["MyResource"])

@router.get("/")
async def list_items(db=Depends(get_db), user=Depends(get_current_user)):
    ...
```

### Schema pattern (Pydantic v2)
```python
from pydantic import BaseModel, ConfigDict

class MySchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    name: str
    created_at: datetime
```

### Key files to check before changes
- `backend/app/domain/models.py` — all ORM models
- `backend/app/application/schemas.py` — all Pydantic schemas
- `backend/app/deps.py` — dependency injection
- `backend/app/main.py` — route registration + seed data

### Environment
- `backend/.env` — Neon PostgreSQL (prod)
- `backend/.env.local` — SQLite local dev
- `backend/run-local.bat` — local server launcher
- `backend/requirements.txt` — Python deps (aiosqlite for SQLite, asyncpg for Postgres)
