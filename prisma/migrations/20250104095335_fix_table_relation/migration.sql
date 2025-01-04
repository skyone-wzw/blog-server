-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_fediverse_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT,
    "parsed" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "replyTo" TEXT,
    "postId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "fediverse_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "fediverse_guests" ("uid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fediverse_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_fediverse_comments" ("content", "createdAt", "id", "images", "isHidden", "parsed", "postId", "replyTo", "source", "uid", "updatedAt", "userId") SELECT "content", "createdAt", "id", "images", "isHidden", "parsed", "postId", "replyTo", "source", "uid", "updatedAt", "userId" FROM "fediverse_comments";
DROP TABLE "fediverse_comments";
ALTER TABLE "new_fediverse_comments" RENAME TO "fediverse_comments";
CREATE UNIQUE INDEX "fediverse_comments_uid_key" ON "fediverse_comments"("uid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
