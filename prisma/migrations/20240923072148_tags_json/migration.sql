-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_posts" ("content", "createdAt", "description", "id", "published", "series", "slug", "tags", "title", "updatedAt") SELECT "content", "createdAt", "description", "id", "published", "series", "slug", "tags", "title", "updatedAt" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");

UPDATE "posts"
    SET `tags` = '["' || replace(`tags`, ', ', '","') || '"]'
WHERE length(trim(`tags`, ' ')) > 0;
UPDATE "posts"
    SET `tags` = '[]'
WHERE length(trim(`tags`, ' ')) = 0;

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
