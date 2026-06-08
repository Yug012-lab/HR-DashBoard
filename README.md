# HR Dashboard — Enterprise HR Management System

AI-powered HR Management Dashboard with selfie attendance, location verification, payroll, leave management, and workforce analytics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS |
| Backend | Java 17 + Spring Boot 3 |
| Database | PostgreSQL |
| Auth | JWT + Spring Security |
| AI/Face API | face-api.js (frontend) |
| Deployment | Render (backend) + Vercel (frontend) — both FREE |

---

## Project Structure

```
hr-dashboard/
├── frontend/          # React app
├── backend/           # Spring Boot Java app
├── docker-compose.yml # Local dev (optional)
└── README.md
```

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- Java 17+
- PostgreSQL 14+

### 1. Clone & Setup

```bash
git clone https://github.com/YOUR_USERNAME/hr-dashboard.git
cd hr-dashboard
```

### 2. Backend Setup

```bash
cd backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit application.properties with your DB credentials
./mvnw spring-boot:run
```

Backend runs at: `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:8080
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Free Deployment (Go Live)

### Step 1 — Database (Free on Neon.tech)
1. Go to https://neon.tech → Sign up free
2. Create a new project → copy the connection string

### Step 2 — Backend (Free on Render.com)
1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo → Select `/backend` folder
3. Build command: `./mvnw package -DskipTests`
4. Start command: `java -jar target/hr-dashboard-0.0.1-SNAPSHOT.jar`
5. Add environment variables:
   - `DATABASE_URL` = your Neon connection string
   - `JWT_SECRET` = any random 64-char string
   - `SPRING_PROFILES_ACTIVE` = prod

### Step 3 — Frontend (Free on Vercel)
1. Go to https://vercel.com → Import your GitHub repo
2. Set root directory to `frontend`
3. Add environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g. https://hr-dashboard-api.onrender.com)
4. Deploy!

---

## Default Login

After first run, the system seeds an admin account:

| Field | Value |
|---|---|
| Email | admin@hrdashboard.com |
| Password | Admin@123 |

**Change this immediately after first login.**

---

## Features

- ✅ AI Selfie Attendance (Check-In / Check-Out)
- ✅ Face Detection & Liveness Check (browser-based, no API cost)
- ✅ GPS + IP Location Verification
- ✅ HR Dashboard — Live attendance, analytics
- ✅ Employee Management — Add/Edit/Remove
- ✅ Leave Management — Apply, approve, track balances
- ✅ Payroll — Salary, tax, payslip generation
- ✅ Performance Tracking
- ✅ Recruitment Pipeline
- ✅ Role-Based Access (Admin / HR / Employee)
- ✅ JWT Authentication
- ✅ Mobile Responsive

---

## License

MIT
