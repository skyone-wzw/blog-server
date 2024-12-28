-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_fediverse_guests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "summary" TEXT,
    "url" TEXT NOT NULL,
    "webUrl" TEXT,
    "avatar" TEXT,
    "banner" TEXT,
    "follow" BOOLEAN NOT NULL DEFAULT false,
    "inbox" TEXT NOT NULL DEFAULT '',
    "outbox" TEXT NOT NULL DEFAULT '',
    "raw" TEXT NOT NULL DEFAULT '',
    "keyId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "isBanned" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_fediverse_guests" ("avatar", "banner", "id", "isBanned", "keyId", "name", "publicKey", "summary", "uid", "url", "webUrl") SELECT "avatar", "banner", "id", "isBanned", "keyId", "name", "publicKey", "summary", "uid", "url", "webUrl" FROM "fediverse_guests";
DROP TABLE "fediverse_guests";
ALTER TABLE "new_fediverse_guests" RENAME TO "fediverse_guests";
CREATE UNIQUE INDEX "fediverse_guests_uid_key" ON "fediverse_guests"("uid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
