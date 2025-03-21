-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "organization_code" VARCHAR(16) NOT NULL,
    "user_id" TEXT,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LoginAttempt_email_organization_code_created_at_idx" ON "LoginAttempt"("email", "organization_code", "created_at");

-- CreateIndex
CREATE INDEX "LoginAttempt_user_id_created_at_idx" ON "LoginAttempt"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "LoginAttempt" ADD CONSTRAINT "LoginAttempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
