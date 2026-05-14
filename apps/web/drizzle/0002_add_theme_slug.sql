ALTER TABLE `themes` ADD `slug` text;
UPDATE `themes` SET `slug` = LOWER(`hash`) WHERE `slug` IS NULL OR `slug` = '';
CREATE UNIQUE INDEX `themes_slug_unique` ON `themes` (`slug`);
