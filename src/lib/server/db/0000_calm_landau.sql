-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `oauth_accounts` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`user_id` uuid NOT NULL,
	`provider` enum('Google','GitHub','Microsoft','Apple ID') NOT NULL,
	`provider_user_id` varchar(256) NOT NULL,
	`access_token` varchar(256) DEFAULT 'NULL',
	`refresh_token` varchar(256) DEFAULT 'NULL',
	`token_expires_at` datetime DEFAULT 'NULL',
	CONSTRAINT `provider` UNIQUE(`provider`,`provider_user_id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` bigint(20) AUTO_INCREMENT NOT NULL,
	`session_token` varchar(256) NOT NULL,
	`user_id` uuid NOT NULL,
	`expires_at` datetime DEFAULT '(current_timestamp() + interval 30 minute)',
	CONSTRAINT `session_token` UNIQUE(`session_token`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` uuid NOT NULL DEFAULT 'uuid()',
	`email` varchar(256) NOT NULL,
	`hashed_password` varchar(256) DEFAULT 'NULL',
	CONSTRAINT `email` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `oauth_accounts` ADD CONSTRAINT `oauth_accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
CREATE INDEX `user_id` ON `oauth_accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_id` ON `sessions` (`user_id`);
*/