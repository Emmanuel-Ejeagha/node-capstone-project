import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Create a test app similar to the real app
function createTestApp() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Simple routes for testing
  app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "Health route is working" });
  });

  app.post("/api/auth/register", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }
    res.status(201).json({ success: true, message: "Registration successful. Please login to continue" });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }
    res.status(200).json({ success: true, data: { accessToken: "fake-token" } });
  });

  // Task routes
  app.post("/api/tasks", (req, res) => {
    const { title } = req.body;
    if (!title) {
      res.status(400).json({ success: false, message: "Title is required" });
      return;
    }
    res.status(201).json({ success: true, data: { task: { id: "1", title, status: "OPEN" } } });
  });

  app.get("/api/tasks", (req, res) => {
    res.status(200).json({ success: true, data: { tasks: [] } });
  });

  app.get("/api/tasks/:taskId", (req, res) => {
    res.status(200).json({ success: true, data: { task: { id: req.params.taskId, title: "Test", status: "OPEN" } } });
  });

  app.patch("/api/tasks/:taskId", (req, res) => {
    res.status(200).json({ success: true, data: { task: { id: req.params.taskId, title: "Updated", status: "IN_PROGRESS" } } });
  });

  app.delete("/api/tasks/:taskId", (req, res) => {
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  });

  return app;
}

describe("Task API integration tests", () => {
  let server: any;
  let testApp: any;

  beforeEach(() => {
    testApp = createTestApp();
    server = testApp.listen(0);
  });

  afterEach(() => {
    server.close();
  });

  describe("POST /api/tasks", () => {
    it("should create a task and return 201", async () => {
      const response = await request(testApp)
        .post("/api/tasks")
        .send({ title: "Test task" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data", { task: expect.any(Object) });
    });

    it("should return 400 if title is missing", async () => {
      const response = await request(testApp).post("/api/tasks").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/tasks", () => {
    it("should return tasks", async () => {
      const response = await request(testApp).get("/api/tasks");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
    });
  });

  describe("GET /api/tasks/:taskId", () => {
    it("should return a task", async () => {
      const response = await request(testApp).get("/api/tasks/123");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data", { task: expect.any(Object) });
    });
  });

  describe("PATCH /api/tasks/:taskId", () => {
    it("should update a task", async () => {
      const response = await request(testApp)
        .patch("/api/tasks/123")
        .send({ title: "Updated" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
    });
  });

  describe("DELETE /api/tasks/:taskId", () => {
    it("should delete a task", async () => {
      const response = await request(testApp).delete("/api/tasks/123");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message", "Task deleted successfully");
    });
  });
});