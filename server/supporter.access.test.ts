import { describe, expect, it, vi, beforeEach } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  getActiveSupporterLink: vi.fn(),
  listSupporterLinks: vi.fn().mockResolvedValue([{ id: 31, status: "active", consentScope: "dashboard_only" }]),
  revokeSupporterLink: vi.fn(),
  getJournalEntries: vi.fn().mockResolvedValue([{ id: 1, body: "encrypted-safe-test" }]),
  recordAdminAudit: vi.fn().mockResolvedValue(true),
}));

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return { ...actual, ...mocks };
});

import { appRouter } from "./routers";

function supporterContext(): TrpcContext {
  return {
    user: {
      id: 12,
      openId: "supporter-test",
      name: "Supporter Test",
      email: "supporter@example.com",
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    userRoles: ["supporter"],
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("supporter scoped procedures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects link listing for a non-supporter and logs rejection", async () => {
    const context = supporterContext();
    context.userRoles = ["user"];
    const caller = appRouter.createCaller(context);

    await expect(caller.supporter.links()).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(mocks.recordAdminAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "supporter.links.list",
      targetType: "supporter_link",
      outcome: "rejected",
    }));
    expect(mocks.listSupporterLinks).not.toHaveBeenCalled();
  });

  it("allows supporter link listing and logs success", async () => {
    const caller = appRouter.createCaller(supporterContext());

    await expect(caller.supporter.links()).resolves.toHaveLength(1);
    expect(mocks.recordAdminAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "supporter.links.list",
      targetType: "supporter_link",
      outcome: "success",
    }));
  });

  it("allows journal access for an active explicitly consented link and logs success", async () => {
    mocks.getActiveSupporterLink.mockResolvedValue({
      id: 31,
      supporterId: 12,
      memberId: 21,
      status: "active",
      consentScope: "dashboard_and_journal",
    });
    const caller = appRouter.createCaller(supporterContext());

    await expect(caller.supporter.journal({ memberId: 21 })).resolves.toHaveLength(1);
    expect(mocks.recordAdminAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "supporter.access.journal",
      targetId: 21,
      outcome: "success",
    }));
  });

  it.each([
    ["dashboard_only", "active"],
    ["full_access", "revoked"],
    ["full_access", "pending"],
  ])("rejects journal access for %s/%s and logs rejection", async (consentScope, status) => {
    mocks.getActiveSupporterLink.mockResolvedValue({ consentScope, status, memberId: 21 });
    const caller = appRouter.createCaller(supporterContext());

    await expect(caller.supporter.journal({ memberId: 21 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(mocks.getJournalEntries).not.toHaveBeenCalled();
    expect(mocks.recordAdminAudit).toHaveBeenCalledWith(expect.objectContaining({ outcome: "rejected", targetId: 21 }));
  });

  it("allows supporter link revocation and logs success", async () => {
    mocks.revokeSupporterLink.mockResolvedValue(true);
    const caller = appRouter.createCaller(supporterContext());

    await expect(caller.supporter.revokeLink({ linkId: 31 })).resolves.toEqual({ success: true });
    expect(mocks.recordAdminAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "supporter.link.revoke",
      targetId: 31,
      outcome: "success",
    }));
  });

  it("rejects an unsuccessful link revocation and logs rejection", async () => {
    mocks.revokeSupporterLink.mockResolvedValue(false);
    const caller = appRouter.createCaller(supporterContext());

    await expect(caller.supporter.revokeLink({ linkId: 31 })).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(mocks.recordAdminAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "supporter.link.revoke",
      targetId: 31,
      outcome: "rejected",
    }));
  });

  it("allows access-summary reads for an active link and logs success", async () => {
    mocks.getActiveSupporterLink.mockResolvedValue({
      id: 31,
      supporterId: 12,
      memberId: 21,
      status: "active",
      consentScope: "dashboard_only",
    });
    const caller = appRouter.createCaller(supporterContext());

    await expect(caller.supporter.accessSummary({ memberId: 21 })).resolves.toMatchObject({
      memberId: 21,
      consentScope: "dashboard_only",
      canViewJournal: false,
      canViewFullAccess: false,
    });
    expect(mocks.recordAdminAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "supporter.access.summary",
      targetId: 21,
      outcome: "success",
    }));
  });

  it("rejects missing links before reading member data", async () => {
    mocks.getActiveSupporterLink.mockResolvedValue(null);
    const caller = appRouter.createCaller(supporterContext());

    await expect(caller.supporter.accessSummary({ memberId: 21 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(mocks.recordAdminAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "supporter.access.summary",
      outcome: "rejected",
    }));
  });
});
