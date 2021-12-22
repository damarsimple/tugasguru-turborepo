-- CreateTable
CREATE TABLE "Metric" (
    "id" SERIAL NOT NULL,
    "operationName" TEXT NOT NULL,
    "query" JSONB NOT NULL,
    "variables" JSONB NOT NULL,
    "elapsed" BIGINT NOT NULL,
    "http" JSONB NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Metric" ADD CONSTRAINT "Metric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
