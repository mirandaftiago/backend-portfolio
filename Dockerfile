# ─── Stage 1: Build ─────────────────────────────────────────
FROM node:20-slim AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

WORKDIR /app

# Copy dependency files first (better layer caching)
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev for building)
RUN pnpm install --frozen-lockfile

# Copy source code and Prisma schema
COPY src/ ./src/
COPY prisma/ ./prisma/
COPY tsconfig.json tsconfig.build.json ./

# Generate Prisma client and build TypeScript
RUN pnpm db:generate
RUN pnpm build

# ─── Stage 2: Production ────────────────────────────────────
FROM node:20-slim AS production

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

WORKDIR /app

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile

# Copy Prisma schema and generate client
COPY prisma/ ./prisma/
RUN pnpm db:generate

# Copy compiled JavaScript from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p uploads

# Don't run as root
USER node

EXPOSE 3000

CMD ["node", "dist/index.js"]
