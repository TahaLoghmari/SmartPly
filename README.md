# SmartPly

A modern job application tracker that integrates **AI + Gmail** to help you stay on top of applications, recruiter replies, and interviews — all in one place.

[Frontend](https://smartply.me) | [Backend API](https://api.smartply.me)

---

## Key Features

### Job Application Management

- Add, edit, and track applications with detailed fields (status, type, level, salary, deadlines, resumes, cover letters, etc.).
- Store multiple versions of resumes & cover letters in Supabase.
- Update statuses, set favorites, and link recruiter emails directly to applications.

### Search & Filtering

- Filter by status, type, framework/language, contract type, and level.
- Search by company or position to find what you need instantly.

### Real-time Notifications

- Built with **SignalR** for instant updates:
  - Recruiter replies
  - Interview invites
  - Application status changes

### AI-Powered Inbox

- Gmail integration (with user consent).
- Automatically detects and categorizes recruiter emails (interviews, rejections, info requests).
- Matches emails to applications or creates new ones if unmatched.
- Keeps a dedicated **Job Inbox** for all job-related emails.

---

## Tech Stack & Practices

### Backend (ASP.NET Core)

- Authentication: ASP.NET Identity + JWT/Refresh Tokens (HTTP-Only cookies), Google OAuth
- Reliability: Caching, DTOs, validation, error handling (`ProblemDetails`), rate limiting
- Developer-friendly: Swagger docs, health checks, structured logging
- Extras: Hangfire (background jobs), Supabase (file storage)

### Frontend (React + TypeScript)

- Feature-based folder structure
- Zustand (state) + TanStack Query (server state)
- Protected routes, error boundaries, responsive UI

### DevOps & Deployment

- Dockerized (frontend + backend + docker-compose for local dev)
- CI/CD with GitHub Actions
- Hosting: Frontend on Vercel, Backend on Azure Container Apps (ACR)
- Secrets managed via `.env` + User Secrets

---

## Preview

> _(Add screenshots or GIFs here — e.g. dashboard view, AI-powered inbox, job application form, notifications in action)_

---

## ⚡ Live Demo

- **Frontend** → [smartply.me](https://smartply.me)
- **Backend API** → [api.smartply.me](https://api.smartply.me)

---
