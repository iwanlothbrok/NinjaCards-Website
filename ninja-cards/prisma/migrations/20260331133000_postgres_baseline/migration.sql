-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('SHINOBI', 'SAMURAI', 'SHOGUN');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'trialing', 'past_due', 'unpaid', 'paused', 'cancelled');

-- CreateEnum
CREATE TYPE "WebhookEventStatus" AS ENUM ('processing', 'processed', 'failed');

-- CreateEnum
CREATE TYPE "CRMStage" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'WON', 'LOST');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "company" TEXT,
    "position" TEXT,
    "phone1" TEXT,
    "phone2" TEXT,
    "email2" TEXT,
    "street1" TEXT,
    "street2" TEXT,
    "zipCode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "bio" TEXT,
    "image" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "twitter" TEXT,
    "tiktok" TEXT,
    "googleReview" TEXT,
    "revolut" TEXT,
    "website" TEXT,
    "viber" TEXT,
    "whatsapp" TEXT,
    "github" TEXT,
    "behance" TEXT,
    "youtube" TEXT,
    "paypal" TEXT,
    "trustpilot" TEXT,
    "qrCode" TEXT,
    "selectedColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "calendly" TEXT,
    "discord" TEXT,
    "telegram" TEXT,
    "tripadvisor" TEXT,
    "pdf" TEXT,
    "coverImage" TEXT,
    "slug" TEXT,
    "isDirect" BOOLEAN NOT NULL DEFAULT false,
    "videoUrl" TEXT,
    "language" TEXT NOT NULL DEFAULT 'bg',
    "subscriptionId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileVisits" INTEGER NOT NULL DEFAULT 0,
    "vcfDownloads" INTEGER NOT NULL DEFAULT 0,
    "profileShares" INTEGER NOT NULL DEFAULT 0,
    "socialLinkClicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "oldPrice" DOUBLE PRECISION,
    "image" TEXT NOT NULL,
    "frontImage" TEXT,
    "backImage" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "qrColor" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardDesign" (
    "id" SERIAL NOT NULL,
    "cardName" TEXT NOT NULL,
    "cardTitle" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userPhone" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "frontDataUrl" TEXT NOT NULL,
    "backDataUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "courierAddress" TEXT,
    "courierIsSpeedy" INTEGER NOT NULL,
    "backLogoUrl" TEXT,

    CONSTRAINT "CardDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "googleReviewLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscribed" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAccepted" BOOLEAN NOT NULL DEFAULT true,
    "followUpStage" INTEGER NOT NULL DEFAULT 0,
    "lastFollowUpSentAt" TIMESTAMP(3),
    "nextFollowUpAt" TIMESTAMP(3),
    "followUpStopped" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT DEFAULT 'profile',
    "sourceDetail" TEXT,
    "tapsBeforeLead" INTEGER NOT NULL DEFAULT 1,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "Subscribed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CRMDeal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "leadId" TEXT,
    "title" TEXT NOT NULL,
    "stage" "CRMStage" NOT NULL DEFAULT 'NEW',
    "value" DOUBLE PRECISION,
    "source" TEXT,
    "sourceDetail" TEXT,
    "taps" INTEGER NOT NULL DEFAULT 0,
    "leadCapturedAt" TIMESTAMP(3),
    "contactedAt" TIMESTAMP(3),
    "meetingAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "nextReminderAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CRMDeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CRMNote" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CRMNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CRMTask" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "dueAt" TIMESTAMP(3),
    "reminderAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CRMTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "stripe_user_id" TEXT NOT NULL,
    "plan" "PlanType" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "cancel_date" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "stripeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "hostedInvoiceUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeSubscriptionId" TEXT,
    "subscriptionId" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT,
    "sendedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "WebhookEventStatus" NOT NULL DEFAULT 'processing',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_slug_key" ON "User"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_subscriptionId_key" ON "User"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Dashboard_userId_key" ON "Dashboard"("userId");

-- CreateIndex
CREATE INDEX "DashboardEvent_userId_timestamp_idx" ON "DashboardEvent"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "Subscribed_nextFollowUpAt_followUpStage_followUpStopped_idx" ON "Subscribed"("nextFollowUpAt", "followUpStage", "followUpStopped");

-- CreateIndex
CREATE UNIQUE INDEX "CRMDeal_leadId_key" ON "CRMDeal"("leadId");

-- CreateIndex
CREATE INDEX "CRMDeal_userId_stage_idx" ON "CRMDeal"("userId", "stage");

-- CreateIndex
CREATE INDEX "CRMDeal_nextReminderAt_idx" ON "CRMDeal"("nextReminderAt");

-- CreateIndex
CREATE INDEX "CRMNote_dealId_createdAt_idx" ON "CRMNote"("dealId", "createdAt");

-- CreateIndex
CREATE INDEX "CRMTask_dealId_completed_idx" ON "CRMTask"("dealId", "completed");

-- CreateIndex
CREATE INDEX "CRMTask_reminderAt_idx" ON "CRMTask"("reminderAt");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscription_id_key" ON "Subscription"("subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_stripeId_key" ON "Invoice"("stripeId");

-- CreateIndex
CREATE INDEX "Invoice_stripeSubscriptionId_idx" ON "Invoice"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Invoice_subscriptionId_idx" ON "Invoice"("subscriptionId");

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardEvent" ADD CONSTRAINT "DashboardEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Dashboard"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribed" ADD CONSTRAINT "Subscribed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CRMDeal" ADD CONSTRAINT "CRMDeal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CRMDeal" ADD CONSTRAINT "CRMDeal_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Subscribed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CRMNote" ADD CONSTRAINT "CRMNote_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "CRMDeal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CRMTask" ADD CONSTRAINT "CRMTask_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "CRMDeal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
