require("dotenv").config();

const db = require("../config/db");

async function migrate() {
  const [columns] = await db.promise().execute(
    `SELECT COUNT(*) AS columnCount
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'CompanyProfile'
       AND COLUMN_NAME = 'LogoURL'`
  );

  if (columns[0].columnCount === 0) {
    await db.promise().execute(
      "ALTER TABLE CompanyProfile ADD COLUMN LogoURL VARCHAR(500) NULL"
    );
    console.log("CompanyProfile.LogoURL added.");
  } else {
    console.log("CompanyProfile.LogoURL already exists.");
  }
}

migrate()
  .catch((error) => {
    console.error(`Company logo migration failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await db.promise().end();
    } catch {
      // The connection may already be closed if database initialization failed.
    }
  });