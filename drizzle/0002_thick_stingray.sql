ALTER TABLE "metrics" ADD COLUMN "memory_usage" numeric;--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "embedding" jsonb;--> statement-breakpoint
ALTER TABLE "metrics" DROP COLUMN "container_name";

