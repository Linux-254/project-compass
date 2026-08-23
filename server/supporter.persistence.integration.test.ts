import { afterAll, describe, expect, it } from "vitest";
import { createSupporterLink, revokeSupporterLink } from "./db";

const enabled = process.env.REFORGE_DB_INTEGRATION === "1" && Boolean(process.env.DATABASE_URL);

describe.skipIf(!enabled)("supporter link persistence", () => {
  let createdId: number | undefined;

  afterAll(async () => {
    if (createdId) await revokeSupporterLink(createdId, 1);
  });

  it("persists and returns a pending link using the deployed driver", async () => {
    const supporterId = 1;
    const memberId = 2;
    const created = await createSupporterLink(supporterId, memberId, "dashboard_only");
    expect(created).toMatchObject({ supporterId, memberId, consentScope: "dashboard_only", status: "pending" });
    createdId = created?.id;
  });
});
