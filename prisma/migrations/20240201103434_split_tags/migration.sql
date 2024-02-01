/*
  Warnings:

  - You are about to drop the column `tags` on the `posts` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tag" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PostToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_posts" ("content", "createdAt", "description", "id", "published", "series", "slug", "title", "updatedAt") SELECT "content", "createdAt", "description", "id", "published", "series", "slug", "title", "updatedAt" FROM "posts";

-- Migrate tags to new table
INSERT OR IGNORE INTO tags (id, tag)
SELECT DISTINCT lower(hex( randomblob(4)) || '-' || hex( randomblob(2))
    || '-' || '4' || substr( hex( randomblob(2)), 2) || '-'
    || substr('AB89', 1 + (abs(random()) % 4) , 1)  ||
    substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))) as id, trim(value) AS tag FROM (
                                            SELECT DISTINCT trim(value) AS value FROM posts, json_each('["' || replace(NULLIF(tags, ''), ',', '","') || '"]'))
WHERE COALESCE(trim(value), '') != '';

-- Migrate `post.tags` relation to new table
INSERT INTO "_PostToTag" (A, B)
SELECT op.id AS A, tt.id AS B
FROM posts op
         JOIN (
    SELECT DISTINCT trim(value) AS tag FROM posts, json_each('["' || replace(NULLIF(tags, ''), ',', '","') || '"]')
) t
         JOIN tags tt
              ON t.tag = tt.tag;

DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "tags_tag_key" ON "tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "_PostToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");
