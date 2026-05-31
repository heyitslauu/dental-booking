# Dental Booking

Lightweight pnpm monorepo for a branch-aware dental clinic booking and back-office foundation.

## Apps

- `apps/web`: React + Vite + TypeScript + Tailwind CSS placeholder frontend
- `apps/api`: NestJS + Prisma API
- `packages/shared`: shared types/constants for future cross-app usage

## Setup

```bash
corepack pnpm install
cp apps/api/.env.example apps/api/.env
```

Update `apps/api/.env` with your PostgreSQL connection string.

## Backend

```bash
corepack pnpm prisma:generate
corepack pnpm prisma:migrate
corepack pnpm prisma:seed
corepack pnpm dev:api
```

## Frontend

```bash
corepack pnpm dev:web
```

## Useful API Checks

```bash
curl http://localhost:3000/clinics
curl http://localhost:3000/clinics/CLINIC_ID/services
curl http://localhost:3000/appointments?clinicId=CLINIC_ID
```
