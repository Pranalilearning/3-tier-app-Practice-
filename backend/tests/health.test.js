const request = require("supertest");
jest.mock("../src/db", () => ({ query: jest.fn() }));

const pool = require("../src/db");
const app = require("../src/app");

describe("Health and Operational Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /health", () => {
    test("returns 200 and healthy status when PostgreSQL is available", async () => {
      pool.query.mockResolvedValue({ rows: [{ "1": 1 }] });
      const response = await request(app).get("/health");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        status: "OK",
        uptime: expect.any(Number),
        timestamp: expect.any(String),
      });
      expect(pool.query).toHaveBeenCalledWith("SELECT 1");
    });

    test("returns 503 and UNAVAILABLE status when PostgreSQL cannot be reached", async () => {
      pool.query.mockRejectedValue(new Error("Connection refused"));

      const response = await request(app).get("/health");

      expect(response.statusCode).toBe(503);
      expect(response.body).toEqual({
        status: "UNAVAILABLE",
        message: "Database is unavailable",
      });
    });
  });

  describe("GET / (Root endpoint)", () => {
    test("returns 200 and service running confirmation message", async () => {
      const response = await request(app).get("/");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        message: "Backend API running successfully",
      });
    });
  });

  describe("GET /api/metrics", () => {
    test("returns 200 and valid process telemetry and memory metrics", async () => {
      const response = await request(app).get("/api/metrics");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        uptime: expect.any(Number),
        memoryUsage: expect.objectContaining({
          rss: expect.any(Number),
          heapTotal: expect.any(Number),
          heapUsed: expect.any(Number),
          external: expect.any(Number),
        }),
        timestamp: expect.any(String),
      });
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
      expect(new Date(response.body.timestamp).getTime()).not.toBeNaN();
    });
  });

  describe("Operational error handling", () => {
    test("returns 404 for unknown route", async () => {
      const response = await request(app).get("/api/non-existent-route");

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: "Route not found",
      });
    });

    test("handles malformed JSON body with a 400 Bad Request error", async () => {
      const response = await request(app)
        .post("/api/items/createitems")
        .set("Content-Type", "application/json")
        .send('{"name": "broken,');

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });
});

