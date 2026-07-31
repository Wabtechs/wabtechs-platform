---
name: deploy
description: Use when deploying to Vercel, fixing build errors, configuring vercel.json, handling serverless functions, managing environment variables, or debugging Vercel deployment failures. Trigger on build errors, vercel.json changes, or deployment questions.
---

# Deploy Skill

## Architecture
100% Vercel deployment:
- **Frontend:** Vite static build → `dist/`
- **Backend:** Python serverless function at `api/index.py`

## Key Files
- `vercel.json` — deployment config
- `api/index.py` — Python serverless entry point (imports FastAPI app)
- `package.json` — `build: "tsc -b && vite build"`
- `backend/requirements.txt` — Python dependencies for serverless

## vercel.json Structure
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "functions": {
    "api/index.py": {
      "runtime": "@vercel/python@6.49.0",
      "maxDuration": 30,
      "includeFiles": "backend/**"
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/health", "destination": "/api" }
  ]
}
```

## Common Build Errors

### `missing_export` / TypeScript errors
- Run `npx tsc --noEmit` locally to catch type errors before push
- Most common: missing imports, untyped API responses, unused imports

### Python function errors
- Check `requirements.txt` has all deps (fastapi, sqlalchemy, aiosqlite, etc.)
- Ensure `api/index.py` properly imports from `backend/`
- `includeFiles: "backend/**"` copies backend code to serverless

## Vercel API
- Check deployment status via `GET /v6/deployments`
- Project ID in `vercel.json` or Vercel dashboard

## Deploy Workflow
1. Fix code locally
2. Verify: `npx tsc --noEmit` (TypeScript) + `npx vite build` (Vite)
3. `git add -A && git commit -m "description"`
4. `git push origin main` (triggers auto-deploy)
5. Monitor: check Vercel API for `readyState`

## Environment Variables
- Frontend: `VITE_API_URL` (optional, auto-detected)
- Backend: `DATABASE_URL` (Neon in prod, SQLite in dev)
- Backend: `SECRET_KEY`, `ALGORITHM`, token expiry settings

## Rules
- Never push without verifying `tsc --noEmit` passes
- Always check Vercel deployment status after push
- Frontend uses relative API paths (`/api/v1`) — same domain
- Backend auto-detects SQLite vs PostgreSQL from DATABASE_URL
