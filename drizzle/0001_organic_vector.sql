
-- Apply the changes to metrics and users tables.

-- Update the metrics table schema to match the new structure.
ALTER TABLE "metrics" ALTER COLUMN "id" SET DATA TYPE text;
ALTER TABLE "metrics" ALTER COLUMN "id" SET DEFAULT 'gen_random_uuid()';
ALTER TABLE "metrics" ALTER COLUMN "cpu_usage" SET DATA TYPE numeric;
ALTER TABLE "metrics" ADD COLUMN "container_name" text NOT NULL;
ALTER TABLE "metrics" ADD COLUMN "namespace" text NOT NULL;
ALTER TABLE "metrics" ADD COLUMN "timestamp" timestamp NOT NULL;
ALTER TABLE "metrics" DROP COLUMN "memory_usage";
ALTER TABLE "metrics" DROP COLUMN "created_at";
