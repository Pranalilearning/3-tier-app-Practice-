const request = require("supertest");
const {
  testPool,
  isDatabaseAvailable,
  applySchema,
  clearItemsTable,
  closePool,
  validateTestDatabaseName,
  testDbConfig,
} = require("./dbTestHelper");

// Require app for real HTTP endpoint testing against PostgreSQL
const app = require("../../src/app");

describe("PostgreSQL Real Integration Tests", () => {
  let dbAvailable = false;

  beforeAll(async () => {
    // Validate target database is strictly a test database
    validateTestDatabaseName(testDbConfig.database);

    dbAvailable = await isDatabaseAvailable();
    if (dbAvailable) {
      await applySchema();
      await clearItemsTable();
    } else {
      console.warn(
        `[SKIPPED] PostgreSQL test database (${testDbConfig.host}:${testDbConfig.port}/${testDbConfig.database}) ` +
        `is not currently reachable. Real PostgreSQL integration tests will run in CI or when PostgreSQL is started.`
      );
    }
  });

  afterAll(async () => {
    if (dbAvailable) {
      await clearItemsTable();
    }
    await closePool();
  });

  beforeEach(async () => {
    if (dbAvailable) {
      await clearItemsTable();
    }
  });

  test("safety guard: refuses to run on non-test database", () => {
    expect(() => validateTestDatabaseName("production_db")).toThrow("SAFETY VIOLATION");
    expect(() => validateTestDatabaseName("cloudapp")).toThrow("SAFETY VIOLATION");
    expect(() => validateTestDatabaseName("cloudapp_test")).not.toThrow();
  });

  test("executes schema and verifies items table structure in PostgreSQL", async () => {
    if (!dbAvailable) return;

    const res = await testPool.query(
      `SELECT column_name, data_type, character_maximum_length, is_nullable
       FROM information_schema.columns
       WHERE table_name = 'items'
       ORDER BY ordinal_position`
    );

    expect(res.rows.length).toBe(2);
    expect(res.rows[0].column_name).toBe("id");
    expect(res.rows[0].data_type).toBe("bigint");

    expect(res.rows[1].column_name).toBe("name");
    expect(res.rows[1].data_type).toBe("character varying");
    expect(res.rows[1].character_maximum_length).toBe(100);
    expect(res.rows[1].is_nullable).toBe("NO");
  });

  test("persists item and generates incremental identity IDs in real PostgreSQL", async () => {
    if (!dbAvailable) return;

    const insertResult1 = await testPool.query(
      "INSERT INTO items (name) VALUES ($1) RETURNING *",
      ["Integration Item 1"]
    );
    const insertResult2 = await testPool.query(
      "INSERT INTO items (name) VALUES ($1) RETURNING *",
      ["Integration Item 2"]
    );

    const item1 = insertResult1.rows[0];
    const item2 = insertResult2.rows[0];

    expect(item1.name).toBe("Integration Item 1");
    expect(item2.name).toBe("Integration Item 2");
    expect(BigInt(item2.id)).toBeGreaterThan(BigInt(item1.id));

    // Confirm real persistence by querying back
    const selectResult = await testPool.query("SELECT * FROM items ORDER BY id ASC");
    expect(selectResult.rows.length).toBe(2);
    expect(selectResult.rows[0].name).toBe("Integration Item 1");
    expect(selectResult.rows[1].name).toBe("Integration Item 2");
  });

  test("enforces PostgreSQL NOT NULL constraint on name column", async () => {
    if (!dbAvailable) return;

    await expect(
      testPool.query("INSERT INTO items (name) VALUES ($1)", [null])
    ).rejects.toThrow(/null value in column "name"/);
  });

  test("enforces PostgreSQL VARCHAR(100) length constraint on name column", async () => {
    if (!dbAvailable) return;

    const tooLong = "A".repeat(101);
    await expect(
      testPool.query("INSERT INTO items (name) VALUES ($1)", [tooLong])
    ).rejects.toThrow(/value too long for type character varying\(100\)/);
  });

  test("protects against SQL injection and safely handles special characters via parameterized queries", async () => {
    if (!dbAvailable) return;

    const sqlInjectionPayload = "Robert'); DROP TABLE items;--";
    const specialChars = "Item with quotes: 'Single' and \"Double\" & <HTML> symbols!";

    const res1 = await testPool.query(
      "INSERT INTO items (name) VALUES ($1) RETURNING *",
      [sqlInjectionPayload]
    );
    const res2 = await testPool.query(
      "INSERT INTO items (name) VALUES ($1) RETURNING *",
      [specialChars]
    );

    expect(res1.rows[0].name).toBe(sqlInjectionPayload);
    expect(res2.rows[0].name).toBe(specialChars);

    // Verify items table was NOT dropped by injection attempt
    const verifyTable = await testPool.query("SELECT COUNT(*) FROM items");
    expect(Number(verifyTable.rows[0].count)).toBe(2);
  });

  test("retrieves empty items list from database via API endpoint", async () => {
    if (!dbAvailable) return;

    const response = await request(app).get("/api/items/getitems");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      count: 0,
      data: [],
    });
  });

  test("creates item and retrieves it via HTTP endpoints backed by real PostgreSQL", async () => {
    if (!dbAvailable) return;

    const createRes = await request(app)
      .post("/api/items/createitems")
      .send({ name: "End-to-End Real Item" });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.name).toBe("End-to-End Real Item");
    expect(createRes.body.data.id).toBeDefined();

    const getRes = await request(app).get("/api/items/getitems");
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.count).toBe(1);
    expect(getRes.body.data[0].name).toBe("End-to-End Real Item");
  });
});
