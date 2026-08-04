-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "xMin" REAL NOT NULL,
    "xMax" REAL NOT NULL,
    "yMin" REAL NOT NULL,
    "yMax" REAL NOT NULL,
    "imageName" TEXT NOT NULL DEFAULT 'waldo-beach-level1'
);
INSERT INTO "new_Character" ("id", "imageName", "name", "xMax", "xMin", "yMax", "yMin") SELECT "id", "imageName", "name", "xMax", "xMin", "yMax", "yMin" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
