
--> statement-breakpoint
CREATE TABLE "metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"pod_name" text NOT NULL,
	"cpu_usage" text NOT NULL,
	"memory_usage" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"github_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_login" timestamp DEFAULT now(),
	CONSTRAINT "users_github_id_unique" UNIQUE("github_id")
);
