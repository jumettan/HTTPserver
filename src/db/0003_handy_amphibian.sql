ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "hashed_password" varchar NOT NULL DEFAULT 'unset';
