---
name: code-quality
description: Use when running linting, type checking, formatting, or fixing code quality issues. Trigger before commits, after code changes, or when build errors occur. Covers TypeScript (tsc), ESLint, and Python syntax checks.
---

# Code Quality Skill

## Verification Pipeline
Always run in this order before committing:

### 1. TypeScript (frontend)
```bash
npx tsc --noEmit
```
Fix all type errors before proceeding. Common issues:
- Missing imports
- Untyped API responses (use `unknown` or proper interface)
- Unused imports/variables
- Wrong generic types on React Query

### 2. Build (frontend)
```bash
npx vite build
```
Catches bundling errors that tsc might miss.

### 3. Lint (frontend)
```bash
npm run lint
```
ESLint with React Hooks and React Refresh plugins.

### 4. Python syntax (backend)
```bash
cd backend && python -m py_compile app/main.py
```
Basic syntax check. For full checks use mypy/ruff if configured.

## Common Fixes

### `TS2305: Module has no exported member`
→ Add the missing export to the source file, or fix the import path.

### `TS18046: 'x' is of type 'unknown'`
→ Add proper type annotation. For API responses, define the response interface.

### `TS2339: Property 'x' does not exist on type`
→ Check the type definition. May need to add the property to the interface.

### Build timeout
→ Large projects may need more time. Use `--timeout 300000` if available.

## Rules
- Never commit code that fails `tsc --noEmit`
- Never commit code that fails `vite build`
- Always check both frontend AND backend after changes
- If a type error is in mock data, fix the mock data type — not the code using it
- Import `ClinicalCase`, `Patient`, etc. from `@/types` — never use inline types for API data
