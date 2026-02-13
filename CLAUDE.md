# Task Management API — Claude Context (Node + TS + Express + Prisma + Postgres)

You are helping develop this repo as a backend dev assistant + teacher.
Priorities: correctness + security + clarity > cleverness. Keep diffs small and focused.
For multi-file changes: Explore → Plan → Implement → Run checks → Summarize.

## Stack
- Runtime: Node.js
- Language: TypeScript
- Framework: Express
- Validation: Zod
- Auth: JWT (`jsonwebtoken`)
- Password hashing: bcrypt
- ORM: Prisma 5.22.0
- Database: PostgreSQL
- Env: dotenv

## Package manager
Use pnpm (packageManager: pnpm@10.28.2). Prefer `pnpm <script>` over `npx` or raw commands.

## Entry/build outputs
- Dev entry: `src/index.ts` (see `pnpm dev`)
- Build output: `dist/` (do NOT manually edit files in `dist/`)
- Prod entry: `dist/index.js` (see `pnpm start`)

## Commands (use these; do not guess)
### Dev / Build
- Install deps: `pnpm install`
- Run dev server: `pnpm dev`
- Build TS → dist: `pnpm build`
- Start compiled build: `pnpm start`

### Code quality
- Lint: `pnpm lint`
- Lint + fix: `pnpm lint:fix`
- Format: `pnpm format`
- Type check (IMPORTANT: dev uses transpile-only): `pnpm type-check`

### Database / Prisma
- Run dev migrations: `pnpm db:migrate`
  - If a migration name is needed, pass args like:
    - `pnpm db:migrate -- --name <migration_name>`
- Generate Prisma client: `pnpm db:generate`
- Prisma Studio: `pnpm db:studio`
- Prisma db push: `pnpm db:push`
  - ⚠️ Use `db:push` only for local/prototyping. Prefer migrations for real schema changes.

## Environment variables
- `.env` is loaded via `dotenv`. Never print, paste, or commit secrets.
- Before assuming env var names, search the repo for `process.env`.
  Common in this stack (CONFIRM IN CODE): `DATABASE_URL`, `PORT`, `JWT_SECRET`.

## Prisma rules (high signal)
- Prisma schema lives in `prisma/schema.prisma`.
- Use a single PrismaClient instance (singleton) exported from one module.
- After changing `schema.prisma`, always run:
  - `pnpm db:generate`
- Prefer migrations (`pnpm db:migrate`) over `pnpm db:push`.
- Use `$transaction` for multi-step DB writes that must be atomic.
- Avoid leaking sensitive fields (password hashes, tokens). Use `select` to return only needed fields.

## API conventions (follow existing patterns)
- Validate at the edge (routes/controllers) with Zod (`safeParse`/`parse`).
- Keep services/business logic independent from Express req/res objects.
- Use the repo’s existing error-handling middleware/pattern.
- Keep responses consistent; don’t invent new error shapes if one already exists.

## Auth & security
- JWT: follow existing middleware; typical pattern is `Authorization: Bearer <token>` (confirm).
- Hash passwords with bcrypt; never store/return plaintext.
- Never log secrets/PII (tokens, passwords, emails, etc.).
- Any auth/security changes: make a plan first and keep diffs minimal.

## Working style
- Prefer adding/adjusting tests if the repo has them (if not, suggest where they should go).
- Run: `pnpm type-check` + `pnpm lint` (+ `pnpm db:generate`/`pnpm db:migrate` when relevant).
- When responding, include:
  - files changed + why
  - any commands that should be run
  - any migration steps