const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const testDbConfig = {
  host: process.env.TEST_DB_HOST || process.env.DB_HOST || "localhost",
  port: Number(process.env.TEST_DB_PORT || process.env.DB_PORT || 5432),
  user: process.env.TEST_DB_USER || process.env.DB_USER || "postgres",
  password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD || "root",
  database: process.env.TEST_DB_NAME || "cloudapp_test",
  ssl: process.env.TEST_DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 3000,
};

// Strict safety guard: never run integration tests against dev or prod databases
function validateTestDatabaseName(dbName) {
  if (!dbName || !dbName.toLowerCase().includes("test")) {
    throw new Error(
      `SAFETY VIOLATION: Refusing to run integration tests against database "${dbName}". ` +
      `The database name MUST contain "test" (e.g. "cloudapp_test") to protect live databases.`
    );
  }
}

validateTestDatabaseName(testDbConfig.database);

const testPool = new Pool(testDbConfig);

async function isDatabaseAvailable() {
  try {
    const client = await testPool.connect();
    await client.query("SELECT 1");
    client.release();
    return true;
  } catch (error) {
    return false;
  }
}

async function applySchema() {
  const schemaPath = path.resolve(__dirname, "../../src/db/schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf-8");
  await testPool.query(schemaSql);
}

async function clearItemsTable() {
  await testPool.query("TRUNCATE TABLE items RESTART IDENTITY CASCADE");
}

async function closePool() {
  await testPool.end();
}

module.exports = {
  testDbConfig,
  testPool,
  isDatabaseAvailable,
  applySchema,
  clearItemsTable,
  closePool,
  validateTestDatabaseName,
};
