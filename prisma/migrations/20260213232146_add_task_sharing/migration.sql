-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('READ', 'WRITE');

-- CreateTable
CREATE TABLE "task_shares" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "sharedWith" TEXT NOT NULL,
    "permission" "Permission" NOT NULL DEFAULT 'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_shares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "task_shares_sharedWith_idx" ON "task_shares"("sharedWith");

-- CreateIndex
CREATE UNIQUE INDEX "task_shares_taskId_sharedWith_key" ON "task_shares"("taskId", "sharedWith");

-- AddForeignKey
ALTER TABLE "task_shares" ADD CONSTRAINT "task_shares_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_shares" ADD CONSTRAINT "task_shares_sharedWith_fkey" FOREIGN KEY ("sharedWith") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
