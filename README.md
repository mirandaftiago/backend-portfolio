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

- [ ] User authentication (JWT with refresh tokens)
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
- Prisma - ORM for PostgreSQL
- Zod - Schema validation
- JWT - Authentication
- Bcrypt - Password hashing

**Database:**
- PostgreSQL - Primary database
- Redis - Caching layer

**Testing:**
- Jest - Testing framework
- Supertest - API testing

**DevOps:**
- pnpm - Package manager
- ESLint & Prettier - Code quality
- ts-node-dev - Development server

## 📁 Project Structure

task-management-api/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Data access layer
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions
├── tests/
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
├── docs/                 # API documentation
└── prisma/               # Database schema & migrations

📝 Excelente ideia! Vamos criar um README profissional!
Um bom README é essencial para qualquer projeto, especialmente para o teu portfólio!

🎯 Criar README.md
Cria o ficheiro README.md na raiz do projeto:
bashtouch README.md

📄 Conteúdo do README (copia e adapta)
markdown# Task Management API

> A production-ready RESTful API built with TypeScript, Express, and PostgreSQL as part of a backend development learning journey.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

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

- [ ] User authentication (JWT with refresh tokens)
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
- Prisma - ORM for PostgreSQL
- Zod - Schema validation
- JWT - Authentication
- Bcrypt - Password hashing

**Database:**
- PostgreSQL - Primary database
- Redis - Caching layer

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
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Data access layer
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions
├── tests/
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
├── docs/                 # API documentation
└── prisma/               # Database schema & migrations
```

## 🏃 Getting Started

### Prerequisites

- Node.js v20 or higher
- pnpm v8 or higher
- PostgreSQL v14 or higher
- Redis v7 or higher (optional for caching)

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/mirandaftiago/task-management-api.git
   cd task-management-api
```

2. **Install dependencies**
```bash
   pnpm install
```

3. **Set up environment variables**
```bash
   cp .env.example .env
   # Edit .env with your configuration
```

4. **Run database migrations** (coming soon)
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
# Run all tests
pnpm test

# Run unit tests
pnpm test:unit

# Run integration tests
pnpm test:integration

# Test coverage
pnpm test:coverage
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
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/taskdb

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

## 📚 API Documentation

API documentation will be available at `/api-docs` when running the server (coming soon with Swagger).

### Example Endpoints
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
POST   /api/auth/refresh       # Refresh access token

GET    /api/tasks              # Get all tasks (paginated)
POST   /api/tasks              # Create new task
GET    /api/tasks/:id          # Get task by ID
PATCH  /api/tasks/:id          # Update task
DELETE /api/tasks/:id          # Delete task
```

## 🚧 Project Status

This project is currently in **Phase 1** of development:

- [x] Phase 1: Foundation & TypeScript Setup
- [ ] Phase 2: Database & User Management
- [ ] Phase 3: Task Management & Authorization
- [ ] Phase 4: Advanced Features & Performance
- [ ] Phase 5: Testing & Quality Assurance
- [ ] Phase 6: Production Ready & Deployment

## 🎯 Learning Goals

This project demonstrates understanding of:

- ✅ TypeScript configuration and type safety
- ✅ RESTful API architecture
- ⏳ Database design and relationships
- ⏳ Authentication & Authorization patterns
- ⏳ Error handling and validation
- ⏳ Testing strategies (TDD)
- ⏳ Production deployment

## 🤝 Contributing

This is a learning project, but feedback and suggestions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Tiago Miranda**

- GitHub: [@mirandaftiago](https://github.com/mirandaftiago)
- Project: [Task Management API](https://github.com/mirandaftiago/task-management-api)
- Email: miranda.f.tiago@gmail.com
- Linkedin: https://www.linkedin.com/in/tiagofilipemiranda/

## 🙏 Acknowledgments

- Built as part of a structured backend development learning program
- Inspired by production-grade API architectures
- Thanks to the TypeScript and Node.js communities

---

**Note:** This is a learning project developed to demonstrate backend development skills. It follows industry best practices and is designed to be portfolio-worthy.