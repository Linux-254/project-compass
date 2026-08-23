import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  recordAdminAudit: vi.fn().mockResolvedValue(true),
  grantUserRole: vi.fn().mockResolvedValue(undefined),
  revokeUserRole: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return { ...actual, ...mocks };
});

import { appRouter } from "./routers";

function adminContext(): TrpcContext {
  return {
    user: {
      id: 7,
      openId: "audit-admin",
      name: "Audit Admin",
      email: "audit@example.com",
      loginMethod: "test",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    userRoles: ["admin"],
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("admin audit events", () => {
  it("records a successful role grant with metadata only", async () => {
    const caller = appRouter.createCaller(adminContext());
    await caller.admin.grantRole({ userId: 21, role: "mentor" });

    expect(mocks.recordAdminAudit).toHaveBeenCalledWith({
      actorUserId: 7,
      action: "user.role.grant",
      targetType: "user",
      targetId: 21,
      outcome: "success",
    });
  });

  it("records a rejected self-admin revoke without touching the role mutation", async () => {
    const caller = appRouter.createCaller(adminContext());
    await expect(caller.admin.revokeRole({ userId: 7, role: "admin" })).rejects.toMatchObject({ code: "FORBIDDEN" });

    expect(mocks.recordAdminAudit).toHaveBeenCalledWith({
      actorUserId: 7,
      action: "user.role.revoke",
      targetType: "user",
      targetId: 7,
      outcome: "rejected",
    });
    expect(mocks.revokeUserRole).not.toHaveBeenCalled();
  });
});
