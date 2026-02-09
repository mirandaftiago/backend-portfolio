# Task Management API

> A production-ready RESTful API built with TypeScript, Express, and PostgreSQL as part of a backend development learning journey.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
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
- [ ] Task CRUD operations
- [ ] Advanced filtering and pagination
- [ ] File attachments
- [ ] Rate limiting
- [ ] Redis caching
- [ ] Role-based access control
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

**Database:**
- PostgreSQL - Primary database
- Redis - Caching layer (coming soon)

**Testing:**
- Jest - Testing framework (coming soon)
- Supertest - API testing (coming soon)

**DevOps:**
- pnpm - Package manager
- ESLint & Prettier - Code quality
- ts-node-dev - Development server

## 📁 Project Structure

task-management-api/
├── src/
│   ├── config/           # Configuration (database, etc.)
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Data access layer
│   ├── dtos/             # Data Transfer Objects
│   ├── schemas/          # Zod validation schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
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

## 🏃 Getting Started

### Prerequisites

- Node.js v20 or higher
- pnpm v8 or higher
- PostgreSQL v14 or higher

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
```

## 📚 API Documentation

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
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
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

## 🚧 Project Status

This project is currently in **Phase 2** of development:

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

- [ ] Phase 3: Task Management & Authorization
- [ ] Phase 4: Advanced Features & Performance
- [ ] Phase 5: Testing & Quality Assurance
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
- ⏳ Testing strategies (TDD)
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