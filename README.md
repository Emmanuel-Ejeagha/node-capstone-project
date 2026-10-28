# node-capstone-project

A comprehensive Node.js capstone project demonstrating modern backend development practices with TypeScript.

## Project Overview

This project is a complete Node.js application featuring:

- **TypeScript** for type-safe development
- **Express.js** web framework for API routes
- **PostgreSQL** database with pgcrypto extension
- **Migration-based** schema management
- **JWT authentication** and authorization
- **Cloudinary** integration for image management
- **Redis** for caching and session storage
- **Bull queues** for background job processing
- **Role-based access control** (admin, user roles)
- **Responsive** route structure and services

## Architecture

```
src/
├── config/           # Environment configuration
├── constants/       # Application constants
├── errors/          # Custom error handling
├── lib/             # Utility modules (db, logger, cloudinary, redis)
├── middleware/      # Express middleware (auth, error handling, not found)
├── routes/          # API routes (health, auth, tasks, admin, banners)
├── repositories/    # Data access layer
├── services/        # Business logic encapsulation
├── types/           # TypeScript type definitions
├── workers/         # Background job workers
└── scripts/         # Migration and utility scripts
```

## Key Features

### Authentication & Authorization

- JWT-based authentication with refresh tokens
- Role-based access control (admin/User)
- Password hashing and verification
- Protected routes and middleware

### Database & Migrations

- PostgreSQL with pgcrypto for cryptographic functions
- Knex.js migration system for schema versioning
- Seed data for development and testing

### Media & Cloud Storage

- Cloudinary integration for image upload and management
- Background job processing for image optimization
- Secure image deletion with job queue

### Caching & Performance

- Redis caching for frequently accessed data
- Queue-based image processing with Bull
- Response compression and optimization

### API Endpoints

| Category | Endpoints |
|----------|-----------|
| Health | `GET /api/health` |
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Tasks | `GET/POST/PUT/DELETE /api/tasks` |
| Admin | `GET/POST/PUT/DELETE /api/admin/banners` |
| Banners | `GET /api/banners` |

## Getting Started

### Prerequisites

- Node.js (>=18.x)
- PostgreSQL database
- Redis server
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/node-capstone-project.git
   cd node-capstone-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run migrations**
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
| `npm run dev` | Start development server with hot reload |
| `npm start` | Start production server |
| `npm run migrate` | Run database migrations |
| `npm run migrate:make` | Create a new migration file |
| `npm test` | Run test suite |

## Learn More

- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Express.js Guide](https://expressjs.com/)
- [Knex.js Migration Docs](https://knexjs.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Redis Docs](https://redis.io/documentation)

## Project Structure

```
├── migrations/           # Database migration SQL files
├── src/
│   ├── config/           # Environment configuration (env.ts)
│   ├── errors/           # Custom error classes (AppError.ts)
│   ├── lib/              # Utility modules (db.ts, logger.ts, cloudinary.ts, redis.ts)
│   ├── middleware/       # Express middleware (errorHandler.ts, notFound.ts, auth.middleware.ts, admin.middleware.ts, banner.middleware.ts)
│   ├── routes/           # API routes (health.routes.ts, index.ts, auth.routes.ts, user.tasks.routes.ts, admin.tasks.routes.ts, admin.banner.route.ts)
│   ├── repositories/     # Data access layer (user.repositories.ts, admin.task.repositories.ts, user.task.repositories.ts, admin.banner.repositories.ts)
│   ├── services/         # Business logic (auth.service.ts, user.task.service.ts, admin.task.service.ts, admin.banner.service.ts)
│   ├── types/            # TypeScript definitions (task.ts, user.ts, admin.ts, express.d.ts, deleteCloudinaryImgJobData.ts)
│   ├── constants/        # Application constants (taskStatus.ts, consts.ts)
│   ├── scripts/          # Utility scripts (migrate.ts)
│   ├── app.ts            # Main application setup
│   └── server.ts         # Server entry point
├── .gitignore            # Git ignore rules
├── docker-compose.yaml   # Docker service orchestration
├── package.json          # Project dependencies and scripts
├── package-lock.json     # Exact dependency versions
└── README.md             # Project documentation
```

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

For questions and support, please open an issue in the GitHub repository or contact the maintainers.