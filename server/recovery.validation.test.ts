import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { decryptSensitive, encryptSensitive } from "./db";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: {
      id: 42,
      openId: "validation-user",
      email: "validation@example.com",
      name: "Validation User",
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
    userRoles: [],
  };
}

describe("sensitive recovery content", () => {
  it("round-trips journal text without storing plaintext", () => {
    const original = "A private reflection that must not appear in database logs.";
    const encrypted = encryptSensitive(original);
    expect(encrypted).not.toContain(original);
    expect(encrypted.startsWith("enc:v1:")).toBe(true);
    expect(decryptSensitive(encrypted)).toBe(original);
  });
});

describe("admin authorization safeguards", () => {
  it("prevents an administrator from revoking their own administrator access", async () => {
    const context = createContext();
    context.user = { ...context.user!, role: "admin" };
    context.userRoles = ["admin"];
    const caller = appRouter.createCaller(context);
    await expect(caller.admin.revokeRole({ userId: 42, role: "admin" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("check-in validation", () => {
  it("rejects ratings outside the 1-10 range", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.checkIn.create({ part: "morning", mood: 11 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects empty journal entries", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.journal.create({ body: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("requires at least one newsletter send type", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.newsletter.subscribe({ email: "reader@example.com", sendTypes: [] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
