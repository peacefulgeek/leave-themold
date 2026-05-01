CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`title` varchar(280) NOT NULL,
	`body` text NOT NULL,
	`tldr` text,
	`category` varchar(80) NOT NULL,
	`tags` json NOT NULL DEFAULT ('[]'),
	`status` enum('queued','published') NOT NULL DEFAULT 'queued',
	`author` varchar(80) NOT NULL DEFAULT 'The Oracle Lover',
	`metaDescription` varchar(320),
	`heroUrl` varchar(500),
	`heroAlt` varchar(280),
	`asinsUsed` json NOT NULL DEFAULT ('[]'),
	`internalLinksUsed` json NOT NULL DEFAULT ('[]'),
	`externalLinksUsed` json NOT NULL DEFAULT ('[]'),
	`wordCount` int NOT NULL DEFAULT 0,
	`readingTime` int NOT NULL DEFAULT 0,
	`queuedAt` datetime,
	`publishedAt` datetime,
	`lastModifiedAt` datetime,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `asins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`asin` varchar(16) NOT NULL,
	`name` varchar(280) NOT NULL,
	`category` varchar(80) NOT NULL,
	`tags` json NOT NULL DEFAULT ('[]'),
	`verified` boolean NOT NULL DEFAULT true,
	`lastCheckedAt` timestamp,
	CONSTRAINT `asins_id` PRIMARY KEY(`id`),
	CONSTRAINT `asins_asin_unique` UNIQUE(`asin`)
);
--> statement-breakpoint
CREATE TABLE `cron_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`job` varchar(80) NOT NULL,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`finishedAt` timestamp,
	`ok` boolean NOT NULL DEFAULT false,
	`message` text,
	CONSTRAINT `cron_runs_id` PRIMARY KEY(`id`)
);
