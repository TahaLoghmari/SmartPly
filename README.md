# SmartPly

A modern job application tracker that integrates **AI + Gmail** to help you stay on top of applications, recruiter replies, and interviews — all in one place.

[Live Demo](https://smartply.me)

<img width="1021" height="489" alt="Home_Page" src="https://github.com/user-attachments/assets/fdec33d8-1cfa-4ede-b96d-ae3acca5f258" />

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

- Authentication: 
  - Sign up / Log in with email verification and forgot password support.
  - ASP.NET Identity + JWT/Refresh Tokens (HTTP-Only cookies).
  - Google OAuth Login and SignUp ( With Gmail Scope )
  - Link an existing non-Google account to a Google account for unified login.
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
- Secrets managed via `.env` + User Secrets for Local Development And Github Secrets for Production

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

### Application Page 
<img width="1020" height="806" alt="AppPageOverview" src="https://github.com/user-attachments/assets/b5c95876-daff-4c1b-957d-8185ec3b8098" />
<img width="1020" height="806" alt="AppPageDocuments" src="https://github.com/user-attachments/assets/bd3c0538-b469-42ab-85f1-269e6b018183" />
<img width="1020" height="806" alt="AppPageEdit" src="https://github.com/user-attachments/assets/097c2d72-0c24-402b-bbfa-bf61bcb95f5d" />

---
## Run Locally

1. Clone the repository:
````markdown
   git clone git@github.com:TahaLoghmari/SmartPly.git
   cd SmartPly
````

2. Configure external services:

   * Set up **Google Cloud Console** for OAuth, Gmail API & Gemini API
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
