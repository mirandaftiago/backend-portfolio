# Task Management API

> A production-ready RESTful API built with TypeScript, Express, and PostgreSQL as part of a backend development learning journey.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7+-red.svg)](https://redis.io/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![pnpm](https://img.shields.io/badge/pnpm-8+-orange.svg)](https://pnpm.io/)

## 📋 About

This project is a comprehensive **Task Management API** developed as part of a 12-week backend development learning program. It demonstrates professional-grade backend development practices including:

- RESTful API design
- TypeScript for type safety
- Authentication & Authorization (JWT)
- Database design with PostgreSQL & Prisma ORM
- Redis caching
- Comprehensive testing (Unit & Integration)
- Production deployment strategies

## 🚀 Features

- [x] User registration with validation
- [x] Password hashing (bcrypt)
- [x] Email and username uniqueness checks
- [x] User authentication (JWT with refresh tokens)
- [x] JWT access tokens (15min expiry)
- [x] JWT refresh tokens (7 days expiry)
- [x] Token refresh endpoint
- [x] Logout endpoint
- [x] Protected routes with authentication middleware
- [X] Task CRUD operations
- [X] Advanced filtering and pagination
- [X] Role-based access control
- [x] Task sharing & collaboration
- [x] File attachments
- [X] Rate limiting
- [x] Unit & integration testing (Jest + Supertest)
- [x] Redis caching
- [x] Comprehensive API documentation (Swagger)

## 🛠️ Tech Stack

**Runtime & Language:**
- Node.js v20+
- TypeScript 5.9

**Framework & Libraries:**
- Express.js - Web framework
- Prisma 5.22 - ORM for PostgreSQL
- Zod - Schema validation
- Bcrypt - Password hashing
- jsonwebtoken - JWT Authentication
- express-rate-limit - API rate limiting
- Multer - File upload handling
- Pino - Structured logging
- Helmet - HTTP security headers
- CORS - Cross-origin resource sharing
- express-xss-sanitizer - XSS input sanitization
- swagger-jsdoc - OpenAPI spec generation
- swagger-ui-express - Interactive API documentation

**Database:**
- PostgreSQL - Primary database
- Redis - Caching layer (ioredis)

**Testing:**
- Jest - Testing framework
- Supertest - API testing

**DevOps:**
- pnpm - Package manager
- ESLint & Prettier - Code quality
- ts-node-dev - Development server
- pino-pretty - Dev log formatting
- GitHub Actions - CI pipeline
- Docker - Containerization
- Docker Compose - Multi-container orchestration

## 📁 Project Structure

```
task-management-api/
├── src/
│   ├── config/           # Configuration (database, etc.)
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Data access layer
│   ├── dtos/             # Data Transfer Objects
│   ├── schemas/          # Zod validation schemas
│   ├── routes/           # API routes
│   ├── middleware/        # Custom middleware
│   ├── errors/           # Custom error classes
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions
├── prisma/
│   ├── migrations/       # Database migrations
│   └── schema.prisma     # Database schema
├── tests/
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
└── docs/                 # API documentation
```

## 🏃 Getting Started

### Prerequisites

- Node.js v20 or higher
- pnpm v8 or higher
- PostgreSQL v14 or higher
- Redis v7 or higher

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/mirandaftiago/backend-portfolio.git
   cd backend-portfolio
```

2. **Install dependencies**
```bash
   pnpm install
```

3. **Set up environment variables**
```bash
   cp .env.example .env
   # Edit .env with your database credentials
```

4. **Run database migrations**
```bash
   pnpm prisma migrate dev
```

5. **Start development server**
```bash
   pnpm run dev
```

The API will be available at `http://localhost:3000`

## 🧪 Testing

The project uses **Jest** and **Supertest** for unit and integration testing. Rate limiters are automatically disabled in the test environment.

```bash
pnpm test             # Run all tests (62 tests across 5 suites)
pnpm test:watch       # Run in watch mode
pnpm test:coverage    # Run with coverage report
```

**Test suites:**
- Unit: AuthService (12 tests) — register, login, refresh, logout
- Unit: TaskService (13 tests) — CRUD, stats, pagination
- Integration: Auth endpoints (17 tests) — register, login, refresh, logout, profile
- Integration: Task endpoints (8 tests) — CRUD with validation
- Integration: Task Share endpoints (12 tests) — share, permissions, revoke

### Quick Start (curl)
```bash
# Health check
curl http://localhost:3000/health

# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

## 📝 Available Scripts
```bash
pnpm run dev          # Start development server with hot reload
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Lint code
pnpm run lint:fix     # Fix linting issues
pnpm run format       # Format code with Prettier
pnpm run type-check   # Type check without emitting files
pnpm db:migrate       # Run database migrations
pnpm db:studio        # Open Prisma Studio (database GUI)
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage report
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/taskdb?schema=public

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379
```
## 📚 API Documentation

Interactive API documentation is available via Swagger UI:

http://localhost:3000/api-docs


All protected endpoints require the `Authorization: Bearer <token>` header. Use the "Authorize" button in Swagger UI to set your JWT token.

## 🛡️ Rate Limiting

The API uses tiered rate limiting to prevent abuse:

| Tier | Scope | Limit | Description |
|------|-------|-------|-------------|
| Global | All routes | 100 requests / 15 min | Applies to every request |
| Auth | `/api/auth/*` | 10 requests / 15 min | Protects login/register from brute force |
| API | `/api/*` | 50 requests / 15 min | Protects authenticated endpoints |

Exceeding any limit returns `429 Too Many Requests`.

## ⚡ Redis Caching

The API uses Redis as a caching layer for task-related endpoints using a **cache-aside** pattern:

- **Single task** (`GET /api/tasks/:id`) — cached for 10 minutes
- **Task list** (`GET /api/tasks`) — cached for 5 minutes (cache key includes query parameters)
- **Task stats** (`GET /api/tasks/stats`) — cached for 5 minutes

**Cache invalidation** happens automatically on write operations:
- `POST /api/tasks` — clears task list and stats caches for the user
- `PATCH /api/tasks/:id` — clears the specific task cache + list/stats caches
- `DELETE /api/tasks/:id` — clears the specific task cache + list/stats caches

**Graceful degradation:** If Redis is unavailable, the API continues to work normally by querying the database directly. Cache errors are silently caught and never break the application.

## 🔒 Security

The API includes multiple layers of security:

| Layer | Tool | Purpose |
|-------|------|---------|
| HTTP Headers | Helmet | Sets security headers (X-Content-Type-Options, X-Frame-Options, HSTS, etc.) |
| CORS | cors | Restricts cross-origin requests to allowed domains |
| XSS Protection | express-xss-sanitizer | Strips malicious HTML/script tags from request input |
| Rate Limiting | express-rate-limit | Prevents brute force and API abuse |
| Authentication | JWT | Bearer token authentication with refresh rotation |
| Password Security | bcrypt | Salted password hashing |
| Input Validation | Zod | Schema-based request validation |

CORS origins are configurable via the `CORS_ORIGIN` environment variable (comma-separated).

## 🐳 Docker

Run the full stack (API + PostgreSQL + Redis) with Docker Compose:

```bash
# Start all services
docker compose up --build

# Run database migrations (in a new terminal)
docker compose exec api npx prisma migrate deploy

# Test the API
curl http://localhost:3000/health

# Stop all services
docker compose down
```

The Dockerfile uses a multi-stage build:

Builder stage — installs all deps, generates Prisma client, compiles TypeScript
Production stage — installs only production deps, copies compiled JS, runs as non-root node user


## 🚧 Project Status

This project is currently in **Phase 6** of development:

- [x] Phase 1: Foundation & TypeScript Setup
  - [x] TypeScript configuration
  - [x] Express.js setup
  - [x] ESLint & Prettier
  - [x] Project structure
  - [x] Health check endpoint

- [x] Phase 2.1: Prisma Setup & Database Schema
  - [x] Prisma ORM integration
  - [x] PostgreSQL connection
  - [x] User model with migrations
  - [x] Database configuration

- [x] Phase 2.2: User Registration
  - [x] Zod validation schemas
  - [x] Bcrypt password hashing
  - [x] Layered architecture (Controller/Service/Repository)
  - [x] Custom error handling
  - [x] DTOs for safe responses

- [x] Phase 2.3: User Login & JWT Authentication
  - [x] JWT access and refresh tokens
  - [x] Login endpoint
  - [x] Token refresh with rotation
  - [x] Logout endpoint with token invalidation
  - [x] Authentication middleware
  - [x] Protected routes
  - [x] Refresh token storage in database

- [x] Phase 3: Task Management & Authorization
  - [x] Task CRUD (create, read, update, delete)
  - [x] Advanced querying, filtering & pagination
  - [x] Authorization middleware & RBAC (USER/ADMIN roles)
  - [x] Task sharing & collaboration (READ/WRITE permissions)

- [x] Phase 4: Advanced Features & Performance
  - [x] Rate limiting (global, auth, API tiers)
  - [x] Testing (Jest + Supertest)
  - [x] File attachments (Multer + local storage)
  - [x] Redis caching (cache-aside pattern with invalidation)

- [x] Phase 5: Testing & Quality Assurance
  - [x] Expanded test coverage (auth, task sharing, unit + integration)
  - [x] Structured logging (Winston/Pino)
  - [x] Security hardening (Helmet, CORS, input sanitization)
  - [x] CI pipeline (GitHub Actions)

- [x] Phase 6: Production Ready & Deployment
    - [x] Docker containerization
    - [x] Environment validation & graceful shutdown
    - [x] API documentation (Swagger/OpenAPI)

- [ ] Phase 7: Cloud Deployment
    - [ ] Deploy to cloud platform (Railway / Fly.io)
    - [ ] Production database setup
    - [ ] CI/CD pipeline for deployment

- [ ] Phase 8: Real-Time Features
    - [ ] WebSockets for real-time task updates

- [ ] Phase 9: Notifications
    - [ ] Email notifications (task due date reminders)

- [ ] Phase 10: Admin Dashboard
    - [ ] Admin dashboard endpoints

## 🎯 Learning Goals

This project demonstrates understanding of:

- ✅ TypeScript configuration and type safety
- ✅ RESTful API architecture
- ✅ Prisma ORM and database migrations
- ✅ PostgreSQL setup and configuration
- ✅ Input validation with Zod
- ✅ Password security (bcrypt hashing)
- ✅ Layered architecture patterns
- ✅ Repository pattern for data access
- ✅ Service layer for business logic
- ✅ DTOs for safe data transfer
- ✅ Custom error handling
- ✅ JWT authentication and authorization
- ✅ Access and refresh token patterns
- ✅ Token rotation for security
- ✅ Protected route middleware
- ✅ Role-based access control (RBAC)
- ✅ Task sharing with permission levels
- ✅ Advanced querying and filtering
- ✅ Rate limiting and API abuse protection
- ✅ Testing strategies (unit & integration)
- ✅ File upload handling and storage
- ✅ Redis caching (cache-aside pattern, invalidation strategies)
- ✅ Structured logging with Pino (JSON in production, pretty in dev)
- ✅ Security hardening (Helmet, CORS, XSS sanitization)
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Docker containerization with multi-stage builds
- ✅ Environment validation with Zod and graceful shutdown
- ✅ API documentation with Swagger/OpenAPI

## 🤝 Contributing

This is a learning project, but feedback and suggestions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Tiago Miranda**

- GitHub: [@mirandaftiago](https://github.com/mirandaftiago)
- Project: [Backend Portfolio](https://github.com/mirandaftiago/backend-portfolio)
- Email: miranda.f.tiago@gmail.com
- LinkedIn: [tiagofilipemiranda](https://www.linkedin.com/in/tiagofilipemiranda/)

## 🙏 Acknowledgments

- Built as part of a structured backend development learning program
- Inspired by production-grade API architectures
- Thanks to the TypeScript, Node.js, and Prisma communities

---

**Note:** This is a learning project developed to demonstrate backend development skills. It follows industry best practices and is designed to be portfolio-worthy.