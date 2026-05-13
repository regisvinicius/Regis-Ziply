CREATE TABLE "links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"short_path" varchar(255) NOT NULL,
	"original_url" text NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "links_short_path_unique" UNIQUE("short_path")
);
--> statement-breakpoint
CREATE INDEX "links_created_at_id_idx" ON "links" USING btree ("created_at","id");