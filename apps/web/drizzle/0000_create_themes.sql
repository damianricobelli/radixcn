CREATE TABLE `themes` (
	`hash` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`selection` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
