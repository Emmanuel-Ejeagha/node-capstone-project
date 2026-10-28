# TaskForge API

## Overview

**TaskForge API** is a production-ready, backend-focused RESTful API and modular monolith for task management, built with Node.js and TypeScript. It demonstrates modern backend development practices and is designed as a portfolio project for Node.js/TypeScript backend engineer roles.

The project implements a complete task management system with authentication, authorization, Cloudinary image handling, Redis caching, BullMQ background jobs, and role-based access control.

## Architecture

TaskForge API is a **modular monolith** with clean separation of concerns:

```
src/
├── config/           # Environment configuration (env.ts)
├── constants/        # Application constants (task status, file limits)
├── errors/           # Custom error handling (AppError.ts)
├── lib/              # Utility modules (db.ts, logger.ts, cloudinary.ts, redis.ts, jwt.ts)
├── middleware/       # Express middleware (auth, errorHandler, notFound, banner, validation)
├── routes/           # API routes (health, auth, tasks, admin, banners)
├── repositories/     # Data access layer (user/task/banner repositories)
├── services/         # Business logic encapsulation (auth, task, banner services)
├── types/            # TypeScript type definitions (user, task, admin, banners)
├── workers/          # Background job workers (Cloudinary deletion)
└── scripts/          # Migration and utility scripts
```

## Implemented Features

### Authentication & Authorization
- ✅ JWT-based access token authentication (15-minute expiry)
- ✅ Registration with email normalization and password hashing (bcrypt, 10 rounds)
- ✅ Login with credential validation
- ✅ Role-based access control (`USER`/`ADMIN` roles)
- ✅ Admin-only middleware (`requireAdmin`)
- ✅ Authentication middleware (`authenticate`)
- ✅ Generic error messages preventing account enumeration

### Database & Migrations
- ✅ PostgreSQL with pgcrypto extension
- ✅ 4 migration SQL files (pgcrypto, users, support_tasks, banners)
- ✅ UUID primary keys with `gen_random_uuid()`
- ✅ Foreign key constraints with `ON DELETE CASCADE`
- ✅ Check constraints on `role` and `status` enums
- ✅ `IF NOT EXISTS` on all tables for safe re-running
- ✅ Unique constraints on `email` and `google_id`

### Media & Cloud Storage
- ✅ Cloudinary integration for image upload and management
- ✅ Background job processing for Cloudinary deletion (BullMQ)
- ✅ Multer memory storage with file type validation
- ✅ 10MB file size limit
- ✅ File extension validation (jpeg, png, webp, gif)
- ✅ Cloudinary cache invalidation after mutations

### Caching & Performance
- ✅ Redis caching for admin banners (60-second TTL)
- ✅ Cache-aside pattern (check cache → DB → populate cache)
- ✅ Cache invalidation after create/delete mutations
- ✅ Pino logging with `pino-pretty` in development

### API Endpoints

| Category | Endpoint | Method | Auth | Description |
|----------|----------|--------|------|-------------|
| **Health** | `/api/health` | GET | None | Health check |
| **Auth** | `/api/auth/register` | POST | None | User registration |
| | `/api/auth/login` | POST | None | User login |
| | `/api/auth/me` | GET | Required | Get current user |
| **Tasks** | `/api/tasks` | GET | Required | List user's tasks |
| | `/api/tasks` | POST | Required | Create task |
| | `/api/tasks/:taskId` | GET | Required | Get task by ID |
| | `/api/tasks/:taskId` | PATCH | Required | Update task title |
| | `/api/tasks/:taskId` | DELETE | Required | Delete task |
| **Admin** | `/api/admin/tasks` | GET | Admin | List all tasks |
| | `/api/admin/tasks/:taskId/status` | PATCH | Admin | Update task status |
| **Banners** | `/api/admin/banners` | POST | Admin | Create banner |
| | `/api/admin/banners` | GET | Admin | List banners |
| | `/api/admin/banners/:bannerId` | DELETE | Admin | Delete banner |

### Requirements

- Node.js (>=18.x)
- PostgreSQL database
- Redis server
- Cloudinary account
- npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/taskforge-api.git
   cd taskforge-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (see .env.example for defaults)
   ```

4. **Run database migrations**
   ```bash
   npm run migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   npm start
   ```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload (`tsx watch src/server.ts`) |
| `npm start` | Start production server (`node dist/server.js`) |
| `npm run build` | Compile TypeScript (`tsc`) |
| `npm run migrate` | Run database migrations (`tsx src/scripts/migrate.ts`) |
| `npm run migrate:make` | Create a new migration file (manual setup required) |
| `npm test` | Run test suite (`jest`) |
| `npm test:watch` | Watch mode for tests (`jest --watch`) |
| `npm test:coverage` | Run tests with coverage report (`jest --coverage`) |
| `npm docker:up` | Start Docker infrastructure (`docker compose up -d`) |
| `npm docker:down` | Stop Docker infrastructure (`docker compose down -v`) |

### Environment Variables

Create a `.env` file based on `.env.example`:

```
# Server
PORT=4000
NODE_ENV=development
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskforge_db

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_ACCESS_EXPIRES_IN=15m

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Redis
REDIS_URL=redis://localhost:6379
```

**The actual `.env` file is excluded from version control (`/gitignore`). The `.env.example` provides placeholder values.**

### Docker Compose

Development infrastructure is defined in `docker-compose.yaml`:

```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: taskforge_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  app:
    build: .
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/taskforge_db
      - - REDIS_URL=redis://redis:6379
    ports:
      - "4000:4000"
    depends_on:
      - postgres
      - redis
```

### Database Migrations

Migrations are stored in `migrations/` and run via `npm run migrate`. Current migrations:

1. `001_enable_pgcrypto.sql` — Enable pgcrypto extension
2. `002_create_users_table.sql` — Users table with UUID primary key, email uniqueness, role enum
3. `003_create_support_tasks_table.sql` — Tasks table with foreign key to users, status enum
4. `004_create_banners_table.sql` — Banners table for Cloudinary images

To run migrations: `npm run migrate`

### API Response Shapes

**Success responses:**
```json
{ "success": true, "data": { ... }, "message": "..." }
```

**Error responses:**
```json
{ "success": false, "message": "Error message" }
```

**Status codes:**
- `200` — OK (GET, successful PATCH/DELETE)
- `201` — Created (POST resource creation)
- `400` — Bad request (validation errors)
- `401` — Unauthorized (missing/invalid token)
- `403` — Forbidden (insufficient permissions)
- `404` — Not found
- `409` — Conflict (duplicate account)

### Project Structure

```
├── migrations/                   # Database migration SQL files
├── src/
│   ├── config/                   # Environment configuration (env.ts)
│   ├── errors/                   # Custom error classes (AppError.ts)
│   ├── lib/                      # Utility modules (db.ts, logger.ts, cloudinary.ts, redis.ts, jwt.ts)
│   ├── middleware/               # Express middleware (errorHandler.ts, notFound.ts, auth.middleware.ts, admin.middleware.ts, banner.middleware.ts, validation.middleware.ts)
│   ├── routes/                   # API routes (health.routes.ts, index.ts, auth.routes.ts, user.tasks.routes.ts, admin.tasks.routes.ts, admin.banner.route.ts)
│   ├── repositories/             # Data access layer (user.repositories.ts, admin.task.repositories.ts, user.task.repositories.ts, admin.banner.repositories.ts)
│   ├── services/                 # Business logic (auth.service.ts, user.task.service.ts, admin.task.service.ts, admin.banner.service.ts)
│   ├── types/                    # TypeScript definitions (task.ts, user.ts, admin.ts, banner.ts, express.d.ts, deleteCloudinaryImgJobData.ts)
│   ├── constants/                # Application constants (consts.ts)
│   ├── workers/                  # Background job workers (deleteCloudinaryImage.worker.ts)
│   ├── scripts/                  # Utility scripts (migrate.ts)
│   ├── app.ts                    # Main application setup
│   └── server.ts                 # Server entry point
├── .gitignore                    # Git ignore rules
├── docker-compose.yaml           # Docker service orchestration
├── package.json                  # Project dependencies and scripts
├── package-lock.json             # Exact dependency versions
└── README.md                     # Project documentation
```

### License

This project is licensed under the **MIT License**.

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

For questions and support, please open an issue in the GitHub repository or contact the maintainers.

### Contact

For questions, feedback, or support, please open an issue in the GitHub repository or reach out maintainers.

---

*TaskForge API — A comprehensive Node.js/TypeScript backend project demonstrating modern backend development practices.*