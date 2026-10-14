const pool = require("../src/db");

jest.mock("../src/db", () => ({
  query: jest.fn(),
}));

const request = require("supertest");
const app = require("../src/app");

describe("Items API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/items/getitems", () => {
    test("returns empty list when no items exist in database", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get("/api/items/getitems");

      expect(response.statusCode).toBe(200);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM items");
      expect(response.body).toEqual({
        success: true,
        count: 0,
        data: [],
      });
    });

    test("returns multiple items with correct structure and count", async () => {
      const rows = [
        { id: 1, name: "Production Gateway" },
        { id: 2, name: "Redis Cache Cluster" },
        { id: 3, name: "PostgreSQL Replica" },
      ];

      pool.query.mockResolvedValue({ rows });

      const response = await request(app).get("/api/items/getitems");

      expect(response.statusCode).toBe(200);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM items");
      expect(response.body).toEqual({
        success: true,
        count: 3,
        data: rows,
      });
    });

    test("returns 500 without leaking database details when query fails", async () => {
      pool.query.mockRejectedValue(new Error("FATAL: relation \"items\" does not exist at postgres_db:5432"));

      const response = await request(app).get("/api/items/getitems");

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "Internal Server Error",
      });
      // Verify no sensitive internal database information or credentials leaked to client
      expect(JSON.stringify(response.body)).not.toContain("relation");
      expect(JSON.stringify(response.body)).not.toContain("postgres_db");
    });
  });

  describe("POST /api/items/createitems", () => {
    test("creates valid item and returns 201 with created record", async () => {
      const createdItem = { id: 1, name: "Cloud Watcher" };
      pool.query.mockResolvedValue({ rows: [createdItem] });

      const response = await request(app)
        .post("/api/items/createitems")
        .send({ name: "Cloud Watcher" });

      expect(response.statusCode).toBe(201);
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO items (name) VALUES ($1) RETURNING *",
        ["Cloud Watcher"]
      );
      expect(response.body).toEqual({
        success: true,
        data: createdItem,
      });
    });

    test("trims leading and trailing whitespace before inserting into database", async () => {
      const createdItem = { id: 2, name: "Trimmable Item" };
      pool.query.mockResolvedValue({ rows: [createdItem] });

      const response = await request(app)
        .post("/api/items/createitems")
        .send({ name: "   Trimmable Item   " });

      expect(response.statusCode).toBe(201);
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO items (name) VALUES ($1) RETURNING *",
        ["Trimmable Item"]
      );
      expect(response.body.data.name).toBe("Trimmable Item");
    });

    test("accepts boundary case of minimum allowed 2 characters", async () => {
      const createdItem = { id: 3, name: "AB" };
      pool.query.mockResolvedValue({ rows: [createdItem] });

      const response = await request(app)
        .post("/api/items/createitems")
        .send({ name: "AB" });

      expect(response.statusCode).toBe(201);
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO items (name) VALUES ($1) RETURNING *",
        ["AB"]
      );
    });

    test("accepts boundary case of maximum allowed 100 characters", async () => {
      const maxName = "A".repeat(100);
      const createdItem = { id: 4, name: maxName };
      pool.query.mockResolvedValue({ rows: [createdItem] });

      const response = await request(app)
        .post("/api/items/createitems")
        .send({ name: maxName });

      expect(response.statusCode).toBe(201);
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO items (name) VALUES ($1) RETURNING *",
        [maxName]
      );
    });

    test("rejects missing name field", async () => {
      const response = await request(app)
        .post("/api/items/createitems")
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(pool.query).not.toHaveBeenCalled();
    });

    test("rejects null name", async () => {
      const response = await request(app)
        .post("/api/items/createitems")
        .send({ name: null });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(pool.query).not.toHaveBeenCalled();
    });

    test("rejects empty string name", async () => {
      const response = await request(app)
        .post("/api/items/createitems")
        .send({ name: "" });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(pool.query).not.toHaveBeenCalled();
    });

    test("rejects whitespace-only name", async () => {
      const response = await request(app)
        .post("/api/items/createitems")
        .send({ name: "     " });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(pool.query).not.toHaveBeenCalled();
    });

    test("rejects numeric name", async () => {
      const response = await request(app)
        .post("/api/items/createitems")
        .send({ name: 12345 });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(pool.query).not.toHaveBeenCalled();
    });

    test("rejects non-string names (boolean, array, object)", async () => {
      for (const nonString of [true, false, ["invalid"], { nested: "object" }]) {
        const response = await request(app)
          .post("/api/items/createitems")
          .send({ name: nonString });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
      }
      expect(pool.query).not.toHaveBeenCalled();
    });

    test("rejects name shorter than 2 characters", async () => {
      const response = await request(app)
        .post("/api/items/createitems")
        .send({ name: "A" });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(pool.query).not.toHaveBeenCalled();
    });

    test("rejects name longer than 100 characters", async () => {
      const response = await request(app)
        .post("/api/items/createitems")
        .send({ name: "A".repeat(101) });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(pool.query).not.toHaveBeenCalled();
    });

    test("handles unsupported request content-type gracefully", async () => {
      const response = await request(app)
        .post("/api/items/createitems")
        .set("Content-Type", "text/plain")
        .send("plain text payload");

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(pool.query).not.toHaveBeenCalled();
    });

    test("returns 500 and hides internal database errors on insertion failure", async () => {
      pool.query.mockRejectedValue(
        new Error("error: insert into items (name) values ('x') failed password=secret")
      );

      const response = await request(app)
        .post("/api/items/createitems")
        .send({ name: "Test Item" });

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "Internal Server Error",
      });
      // Verify no sensitive connection details or credentials leaked
      expect(JSON.stringify(response.body)).not.toContain("secret");
      expect(JSON.stringify(response.body)).not.toContain("insert into items");
    });
  });
});

