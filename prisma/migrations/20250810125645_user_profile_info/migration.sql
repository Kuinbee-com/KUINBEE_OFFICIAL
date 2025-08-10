-- CreateTable
CREATE TABLE "UserProfileInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "gender" "Gender",
    "occupation" TEXT,
    "institution" TEXT,

    CONSTRAINT "UserProfileInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfileInfo_userId_key" ON "UserProfileInfo"("userId");

-- AddForeignKey
ALTER TABLE "UserProfileInfo" ADD CONSTRAINT "UserProfileInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
