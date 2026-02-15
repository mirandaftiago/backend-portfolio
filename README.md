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
- [ ] Comprehensive API documentation (Swagger)

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

> All protected endpoints require the `Authorization: Bearer <token>` header.

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2026-02-09T00:00:00.000Z",
    "updatedAt": "2026-02-09T00:00:00.000Z"
  }
}
```

**Validation Rules:**
- Username: 3-20 characters, alphanumeric + underscore only
- Email: Valid email format
- Password: Min 8 characters, must contain uppercase, lowercase, and number

---

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2026-02-09T00:00:00.000Z",
      "updatedAt": "2026-02-09T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### Logout
```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

---

#### Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Profile retrieved successfully",
  "data": {
    "userId": "uuid",
    "email": "john@example.com",
    "iat": 1234567890,
    "exp": 1234568790
  }
}
```

---

### Task Endpoints (Protected)

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My new task",
  "description": "Optional description",
  "priority": "HIGH",
  "status": "TODO",
  "dueDate": "2026-03-01T00:00:00.000Z"
}
```

**Response (201 Created):**
```json
{
  "message": "Task created successfully",
  "data": {
    "id": "uuid",
    "title": "My new task",
    "description": "Optional description",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2026-03-01T00:00:00.000Z",
    "userId": "uuid",
    "createdAt": "2026-02-14T00:00:00.000Z",
    "updatedAt": "2026-02-14T00:00:00.000Z",
    "completedAt": null
  }
}
```

**Fields:**
- `title` (required): Task title
- `description` (optional): Task description
- `priority` (optional): `LOW`, `MEDIUM`, `HIGH`, `URGENT` (default: `MEDIUM`)
- `status` (optional): `TODO`, `IN_PROGRESS`, `COMPLETED` (default: `TODO`)
- `dueDate` (optional): ISO 8601 date string

---

#### List Tasks
```http
GET /api/tasks?status=TODO&priority=HIGH&search=meeting&page=1&pageSize=10&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `TODO`, `IN_PROGRESS`, `COMPLETED` |
| `priority` | string | Filter by priority: `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `search` | string | Search in title and description |
| `dueDateFrom` | ISO date | Tasks due after this date |
| `dueDateTo` | ISO date | Tasks due before this date |
| `overdue` | boolean | Only overdue tasks |
| `page` | number | Page number (default: 1) |
| `pageSize` | number | Items per page (default: 10) |
| `sortBy` | string | Sort field: `createdAt`, `dueDate`, `priority`, `title` |
| `sortOrder` | string | `asc` or `desc` (default: `desc`) |

**Response (200 OK):**
```json
{
  "message": "Tasks retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

> ADMIN users can see all tasks. Regular users only see their own.

---

#### Get Task by ID
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Task retrieved successfully",
  "data": {
    "id": "uuid",
    "title": "My task",
    "description": null,
    "status": "TODO",
    "priority": "MEDIUM",
    "dueDate": null,
    "userId": "uuid",
    "createdAt": "2026-02-14T00:00:00.000Z",
    "updatedAt": "2026-02-14T00:00:00.000Z",
    "completedAt": null
  }
}
```

---

#### Update Task
```http
PATCH /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "IN_PROGRESS",
  "priority": "URGENT"
}
```

**Response (200 OK):**
```json
{
  "message": "Task updated successfully",
  "data": { ... }
}
```

---

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Task deleted successfully"
}
```

---

#### Get Task Statistics
```http
GET /api/tasks/stats
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Task statistics retrieved successfully",
  "data": {
    "total": 15,
    "todo": 5,
    "inProgress": 3,
    "completed": 6,
    "overdue": 1
  }
}
```

---

### Task Sharing Endpoints (Protected)

#### Share Task
```http
POST /api/tasks/:id/shares
Authorization: Bearer <token>
Content-Type: application/json

{
  "sharedWith": "recipient-user-uuid",
  "permission": "READ"
}
```

**Response (201 Created):**
```json
{
  "message": "Task shared successfully",
  "data": {
    "id": "uuid",
    "taskId": "task-uuid",
    "sharedWith": "recipient-user-uuid",
    "permission": "READ",
    "createdAt": "2026-02-14T00:00:00.000Z"
  }
}
```

**Fields:**
- `sharedWith` (required): UUID of the user to share with
- `permission` (required): `READ` or `WRITE`

---

#### Get Shared Users
```http
GET /api/tasks/:id/shares
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Shared users retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "taskId": "task-uuid",
      "sharedWith": "user-uuid",
      "permission": "READ",
      "createdAt": "2026-02-14T00:00:00.000Z"
    }
  ]
}
```

---

#### Get Tasks Shared With Me
```http
GET /api/shared-tasks
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Shared tasks retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "taskId": "task-uuid",
      "sharedWith": "my-user-uuid",
      "permission": "READ",
      "createdAt": "2026-02-14T00:00:00.000Z"
    }
  ]
}
```

---

#### Update Share Permission
```http
PATCH /api/tasks/:id/shares/:sharedWith
Authorization: Bearer <token>
Content-Type: application/json

{
  "permission": "WRITE"
}
```

**Response (200 OK):**
```json
{
  "message": "Permission updated successfully",
  "data": {
    "id": "uuid",
    "taskId": "task-uuid",
    "sharedWith": "user-uuid",
    "permission": "WRITE",
    "createdAt": "2026-02-14T00:00:00.000Z"
  }
}
```

---

#### Revoke Share
```http
DELETE /api/tasks/:id/shares/:sharedWith
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Share revoked successfully"
}
```

### File Attachment Endpoints (Protected)

#### Upload Attachment
```http
POST /api/tasks/:id/attachments
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary>
```

**Response (201 Created):**
```json
{
  "message": "File uploaded successfully",
  "data": {
    "id": "uuid",
    "taskId": "task-uuid",
    "filename": "1707900000000-abc123.png",
    "originalName": "screenshot.png",
    "mimeType": "image/png",
    "size": 204800,
    "uploadedBy": "user-uuid",
    "createdAt": "2026-02-14T00:00:00.000Z"
  }
}
```

**Constraints:**
- Max file size: 5MB
- Allowed types: Images (JPEG, PNG, GIF, WebP), PDF, plain text, Word documents (.doc, .docx)

---

#### List Attachments
```http
GET /api/tasks/:id/attachments
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Attachments retrieved successfully",
  "data": [ ... ]
}
```

---

#### Download Attachment
```http
GET /api/attachments/:attachmentId/download
Authorization: Bearer <token>
```

Returns the file as a binary download with the original filename.

---

#### Delete Attachment
```http
DELETE /api/attachments/:attachmentId
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Attachment deleted successfully"
}
```

---

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

## 🚧 Project Status

This project is currently in **Phase 5** of development:

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

- [ ] Phase 5: Testing & Quality Assurance
  - [x] Expanded test coverage (auth, task sharing, unit + integration)
  - [ ] Structured logging (Winston/Pino)
  - [ ] Security hardening (Helmet, CORS, input sanitization)
  - [ ] CI pipeline (GitHub Actions)

- [ ] Phase 6: Production Ready & Deployment

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
- ⏳ Production deployment

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