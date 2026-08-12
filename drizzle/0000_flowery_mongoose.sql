CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`guest_name` text NOT NULL,
	`trip_date` text NOT NULL,
	`booking_contact` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text NOT NULL,
	`language` text DEFAULT 'es' NOT NULL,
	`consent_to_publish` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
