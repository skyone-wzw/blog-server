-- CreateTable
CREATE TABLE "fediverse_guests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "summary" TEXT,
    "url" TEXT NOT NULL,
    "webUrl" TEXT,
    "avatar" TEXT,
    "banner" TEXT,
    "keyId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "isBanned" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "fediverse_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT,
    "parsed" TEXT NOT NULL,
    "replyTo" TEXT,
    "postId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "fediverse_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "fediverse_guests" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fediverse_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "fediverse_guests_uid_key" ON "fediverse_guests"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "fediverse_comments_uid_key" ON "fediverse_comments"("uid");
