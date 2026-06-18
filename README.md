# LifeOS

**LifeOS** is an all-in-one personal life management platform combining task management, habit tracking, goal planning, expense tracking, learning management, analytics, and AI-powered productivity insights.

![Tech Stack](https://img.shields.io/badge/React-19-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **Authentication** — Register, login, logout, forgot/reset password, Google OAuth, JWT + refresh tokens
- **Dashboard** — Productivity score, daily summary, goal progress, habit rate, expenses, learning, activity feed
- **Smart Planner** — Kanban board (drag & drop), calendar view, list view, priorities, categories
- **Habit Tracker** — Daily tracking, streaks, completion history, statistics
- **Goal Management** — Fitness, career, financial, learning goals with milestones
- **Expense Tracker** — Income/expense, budgets, alerts, charts and reports
- **Learning Hub** — Courses, YouTube, articles, notes with progress tracking
- **Analytics** — Weekly/monthly/yearly reports across all modules
- **AI Insights** — Gemini-powered suggestions, summaries, and recommendations

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS 4, React Query, Zustand, Recharts, Framer Motion |
| Backend | Node.js, Express, Mongoose, JWT, bcryptjs |
| Database | MongoDB Atlas |
| AI | Google Gemini API |
| Deploy | Vercel (frontend), Render (backend) |

## Project Structure

```
LifeOS/
├── client/          # React frontend (Vite + TypeScript)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── store/
│       └── routes/
└── server/          # Express backend
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    └── validators/
```

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone and install

```bash
cd LifeOS

# Backend
cd server
cp .env.example .env
npm install

# Frontend
cd ../client
cp .env.example .env
npm install --legacy-peer-deps
```

### 2. Configure environment

**server/.env:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lifeos
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your-gemini-key
```

**client/.env:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed sample data

```bash
cd server
npm run seed
```

Demo credentials: `demo@lifeos.app` / `demo123`

### 4. Run development servers

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- API Docs: http://localhost:5000/api/docs

### 5. Build for production

```bash
cd client && npm run build
cd ../server && npm start
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free cluster
2. Create a database user with read/write permissions
3. Add your IP to Network Access (or `0.0.0.0/0` for development)
4. Copy the connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/lifeos`
5. Set `MONGODB_URI` in your server `.env`

## Deploy Backend (Render)

1. Push code to GitHub
2. Go to [Render](https://render.com) → New → Web Service
3. Connect your repository, set root directory to `server`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables from `server/.env.example`
7. Set `CLIENT_URL` to your Vercel frontend URL
8. Deploy

## Deploy Frontend (Vercel)

1. Go to [Vercel](https://vercel.com) → New Project
2. Import your GitHub repository
3. Set root directory to `client`
4. Framework Preset: Vite
5. Add environment variable: `VITE_API_URL=https://your-render-app.onrender.com/api`
6. Deploy

## API Endpoints

| Module | Base Path |
|--------|-----------|
| Auth | `/api/auth` |
| Tasks | `/api/tasks` |
| Habits | `/api/habits` |
| Goals | `/api/goals` |
| Expenses | `/api/expenses` |
| Learning | `/api/learning` |
| Analytics | `/api/analytics` |
| AI | `/api/ai` |
| Notifications | `/api/notifications` |

Full documentation: `GET /api/docs`

## License

MIT
