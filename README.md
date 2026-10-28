# Quiz Builder

Full-stack quiz creation app built with **NestJS + Sequelize + PostgreSQL** and **React + TypeScript + Vite**.

## Requirements

- Node.js **20.19+ or 22.12+** (recommended Node 22 LTS)
- npm
- Docker Desktop with Docker Compose (or a locally installed PostgreSQL 16 server)

## 1. Start the database

From the project root:

```bash
docker compose up -d
```

This creates PostgreSQL database `quiz_builder`, user `quiz_user`, password `quiz_password` on port `5432`.

If port 5432 is already in use, change the published port in `docker-compose.yml` and `DB_PORT` in backend `.env`.

## 2. Start backend

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

On Windows PowerShell use `Copy-Item .env.example .env` instead of `cp` if needed.

API runs at http://localhost:3000. `DB_SYNC=true` creates tables automatically for **local development only**. For production use migrations and set `DB_SYNC=false`.

## 3. Start frontend

In a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173.

## Create a sample quiz

Use the **Create quiz** page, or send this request:

```bash
curl -X POST http://localhost:3000/quizzes -H "Content-Type: application/json" -d '{"title":"JavaScript Basics","questions":[{"type":"boolean","text":"Is JavaScript a programming language?","correctAnswer":"true"},{"type":"input","text":"What does DOM stand for?","correctAnswer":"Document Object Model"},{"type":"checkbox","text":"Select JavaScript libraries/frameworks","options":[{"text":"React","isCorrect":true},{"text":"Angular","isCorrect":true},{"text":"PostgreSQL","isCorrect":false}]}]}'
```

On Windows PowerShell, the simplest option is to create the quiz in the UI, or use `Invoke-RestMethod` with a PowerShell object converted via `ConvertTo-Json -Depth 10`.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/quizzes` | Create quiz and questions |
| GET | `/quizzes` | List titles and question counts |
| GET | `/quizzes/:id` | Get quiz with questions/options |
| DELETE | `/quizzes/:id` | Delete quiz (204 No Content) |

Question types: `boolean` (`correctAnswer`: `"true"` or `"false"`), `input` (`correctAnswer`: non-empty string), `checkbox` (two or more `options`, at least one with `isCorrect: true`).

## Code quality

Run in each of `backend` and `frontend`:

```bash
npm run lint
npm run format
npm run build
```

## Notes

- Do **not** commit `.env` files; only `.env.example` is tracked.
- Frontend uses `VITE_API_URL`; backend CORS uses `FRONTEND_URL`.
- Quiz creation is transactional: a failed question insert rolls back the entire quiz.
- Delete cascades to questions and options via database foreign keys.
- This is a quiz *builder*, not a quiz-solving application.
- For production, add database migrations, automated tests, authentication, and deployment configuration.
