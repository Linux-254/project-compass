import { describe, expect, it } from "vitest";
import { supporterCanAccessJournal, supporterScopeAllowsJournal } from "./db";

describe("supporter consent scope", () => {
  it("allows journal visibility only for explicitly consented scopes", () => {
    expect(supporterScopeAllowsJournal("dashboard_and_journal")).toBe(true);
    expect(supporterScopeAllowsJournal("full_access")).toBe(true);
    expect(supporterScopeAllowsJournal("dashboard_only")).toBe(false);
    expect(supporterScopeAllowsJournal("revoked")).toBe(false);
    expect(supporterScopeAllowsJournal(undefined)).toBe(false);
  });

  it("requires an active link as well as journal consent", () => {
    expect(supporterCanAccessJournal({ status: "active", consentScope: "dashboard_and_journal" })).toBe(true);
    expect(supporterCanAccessJournal({ status: "active", consentScope: "full_access" })).toBe(true);
    expect(supporterCanAccessJournal({ status: "active", consentScope: "dashboard_only" })).toBe(false);
    expect(supporterCanAccessJournal({ status: "revoked", consentScope: "full_access" })).toBe(false);
    expect(supporterCanAccessJournal({ status: "pending", consentScope: "full_access" })).toBe(false);
    expect(supporterCanAccessJournal(null)).toBe(false);
  });
});
