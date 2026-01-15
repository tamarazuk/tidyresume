CREATE TABLE `auth_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`resume_id` text NOT NULL,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_tokens_token_unique` ON `auth_tokens` (`token`);--> statement-breakpoint
CREATE TABLE `resumes` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`user_email` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `resumes_slug_unique` ON `resumes` (`slug`);