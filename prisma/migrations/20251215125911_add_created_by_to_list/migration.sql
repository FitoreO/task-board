/*
  Warnings:

  - You are about to drop the column `userId` on the `List` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_List" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdBy" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "List_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_List" ("id", "name") SELECT "id", "name" FROM "List";
DROP TABLE "List";
ALTER TABLE "new_List" RENAME TO "List";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
