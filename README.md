# SmartPly

A modern job application tracker that integrates **AI + Gmail** to help you stay on top of applications, recruiter replies, and interviews — all in one place.

[Live Demo](https://smartply.me)

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
### Applications
<img width="1020" height="727" alt="Applications" src="https://github.com/user-attachments/assets/e626d4f9-f699-4d10-b7ce-b403382c5356" />

### Notifications
<img width="1020" height="732" alt="Notifications" src="https://github.com/user-attachments/assets/18bb06fc-e609-4884-a5d7-8c31ef6db98f" />

### Documents
<img width="1020" height="732" alt="Documents" src="https://github.com/user-attachments/assets/c0af7b9f-a457-47e2-a0d5-a80b13d32cad" />

### Inbox
<img width="1020" height="732" alt="Inbox" src="https://github.com/user-attachments/assets/b2812dbc-c42f-4554-b805-da63b1cbd958" />

### Job Inbox
<img width="1020" height="732" alt="JobInbox" src="https://github.com/user-attachments/assets/a3f0bea0-eb6d-4dcb-8a6f-490593b2f84a" />

---

````markdown
## Run Locally

1. Clone the repository:
   ```bash
   git clone git@github.com:TahaLoghmari/SmartPly.git
   cd SmartPly
````

2. Configure external services:

   * Set up **Google Cloud Console** for OAuth & Gmail API
   * Set up a **Supabase** database for file storage

---

### Option 1: Run with Docker

1. Rename `.env.example` → `.env` and fill in required environment variables (Google, Supabase, etc.).
2. From the project root, run:

   ```bash
   docker compose up --build
   ```
3. Access the app:

   * Frontend → [http://localhost:5173/](http://localhost:5173/)
   * Backend → [http://localhost:5000/](http://localhost:5000/)

---

### Option 2: Run without Docker

1. Backend:

   ```bash
   cd backend
   ```

   * Use `.env.example` as reference to generate a `secrets.json` file for .NET User Secrets.
   * Run the backend with .NET.

2. Frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Access the app:

   * Frontend → [http://localhost:5173/](http://localhost:5173/)
   * Backend → [http://localhost:5000/](http://localhost:5000/)
