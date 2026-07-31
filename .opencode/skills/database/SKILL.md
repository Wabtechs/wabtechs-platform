---
name: database
description: Use when working on database schema, SQLAlchemy models, Alembic migrations, seed data, database configuration, or SQLite/PostgreSQL compatibility. Trigger on files under backend/app/domain/, backend/alembic/, backend/app/database.py, or when adding/changing DB columns.
---

# Database Skill

## Stack
- SQLAlchemy 2 (async) with `Mapped[]` type annotations
- Alembic for migrations
- PostgreSQL Neon (prod) + SQLite aiosqlite (dev local)
- UUID primary keys everywhere

## Key Files
- `backend/app/database.py` — engine, session factory, `Base`, `init_db()`
- `backend/app/domain/models.py` — all ORM models
- `backend/app/domain/enums.py` — enum types
- `backend/alembic/env.py` — Alembic config
- `backend/app/main.py` — seed data in `seed_default_data()`
- `backend/.env` — Neon DB URL
- `backend/.env.local` — SQLite URL

## Model Pattern
```python
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class MyModel(Base):
    __tablename__ = "my_models"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    facility_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("facilities.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    facility: Mapped["Facility"] = relationship(back_populates="my_models", lazy="selectin")

    __table_args__ = (
        Index("ix_my_model_name", "name"),
    )
```

## SQLite vs PostgreSQL
`database.py` auto-detects from URL:
- SQLite: `check_same_thread=False`, no pool_size/overflow
- PostgreSQL: pool_size=5, max_overflow=10

## Enums
```python
# backend/app/domain/enums.py
class UserRole(str, Enum):
    ADMIN = "admin"
    DOCTOR = "doctor"
    RESEARCHER = "researcher"

class OutcomeStatus(str, Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"
```

## Seed Data
Auto-seeded in `main.py` lifespan if DB is empty:
- 5 facilities (hospitals, clinic, lab)
- 10 users (2 admin, 5 doctor, 3 researcher)
- 15 patients (Algerian names, blood groups, allergies)
- 20 clinical cases (diverse specialties, outcomes)

## Migration Commands
```bash
cd backend
alembic revision --autogenerate -m "description"  # generate
alembic upgrade head                                # apply
alembic downgrade -1                                # rollback one
```

## Rules
- Always use `uuid.UUID` for primary keys (never auto-increment integers)
- Always add `is_active` for soft-delete pattern
- Always add `created_at`/`updated_at` with timezone
- Always use `lazy="selectin"` on relationships
- Always add `Index` on foreign keys and frequently-queried columns
- JSON columns for flexible data: `symptoms_json`, `tags_json`, `medical_history_json`
