---
name: testing
description: Use when writing or running tests, fixing test failures, or setting up test infrastructure. Covers both frontend (Vitest/React) and backend (pytest/asyncio) testing.
---

# Testing Skill

## Backend Tests
- Framework: pytest + pytest-asyncio
- Location: `backend/tests/`
- Config: `backend/tests/conftest.py` (fixtures, test DB)
- Run: `cd backend && pytest -v`

### Adding a backend test
1. Create `backend/tests/test_<feature>.py`
2. Use fixtures from `conftest.py` (async client, test DB session)
3. Test CRUD operations, auth, permissions

### Example pattern
```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_list_facilities(client: AsyncClient, auth_headers: dict):
    response = await client.get("/api/v1/facilities", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
```

## Frontend Tests
- Framework: Vitest + React Testing Library (if configured)
- Location: `src/**/*.test.tsx` or `src/**/*.spec.tsx`
- Run: `npm test` or `npx vitest`

## Verification Commands
After making changes, always verify:
```bash
# TypeScript check (frontend)
npx tsc --noEmit

# Build check (frontend)
npx vite build

# Backend tests
cd backend && pytest -v

# Lint check
npm run lint
```

## Rules
- Never assume a test framework is installed — check `package.json` or `requirements.txt`
- Always run the existing test suite before adding new tests
- Tests should be independent and not depend on seed data order
- Use `pytest.mark.asyncio` for async backend tests
