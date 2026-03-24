ALTER TABLE `Subscribed`
    ADD COLUMN `followUpStage` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `lastFollowUpSentAt` DATETIME(3) NULL,
    ADD COLUMN `nextFollowUpAt` DATETIME(3) NULL,
    ADD COLUMN `followUpStopped` BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX `Subscribed_nextFollowUpAt_followUpStage_followUpStopped_idx`
    ON `Subscribed`(`nextFollowUpAt`, `followUpStage`, `followUpStopped`);
