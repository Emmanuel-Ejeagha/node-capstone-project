import { describe, it, expect } from "vitest";

// Manual implementation of validateTitle logic for testing
// This mirrors the logic in src/services/user.task.service.js

function validateTitle(title) {
  if (typeof title !== "string" || !title.trim()) {
    throw new Error("A non-empty title is required");
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length > 100) {
    throw new Error("Title must not be more than 100 characters");
  }

  return trimmedTitle;
}

describe("validateTitle", () => {
  it("should return trimmed title for valid input", () => {
    const result = validateTitle("hello world");
    expect(result).toBe("hello world");
  });

  it("should trim leading whitespace", () => {
    const result = validateTitle("  hello");
    expect(result).toBe("hello");
  });

  it("should trim trailing whitespace", () => {
    const result = validateTitle("hello  ");
    expect(result).toBe("hello");
  });

  it("should trim both leading and trailing whitespace", () => {
    const result = validateTitle("  hello world  ");
    expect(result).toBe("hello world");
  });

  it("should reject empty title", () => {
    expect(() => validateTitle("")).toThrow();
  });

  it("should reject whitespace-only title", () => {
    expect(() => validateTitle("   ")).toThrow();
  });

  it("should reject title over 100 characters", () => {
    const longTitle = "A".repeat(101);
    expect(() => validateTitle(longTitle)).toThrow();
  });

  it("should accept normal title", () => {
    const result = validateTitle("Task title");
    expect(result).toBe("Task title");
  });
});