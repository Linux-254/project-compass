import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const oauthSource = readFileSync(new URL("./_core/oauth.ts", import.meta.url), "utf8");
const storageSource = readFileSync(new URL("./_core/storageProxy.ts", import.meta.url), "utf8");

describe("non-tRPC route safety", () => {
  it("keeps OAuth callback and storage proxy read-only", () => {
    expect(oauthSource).toMatch(/app\.get\("\/api\/oauth\/callback"/);
    expect(storageSource).toMatch(/app\.get\("\/manus-storage\/\*"/);
    expect(oauthSource).not.toMatch(/app\.(post|put|patch|delete)\(/);
    expect(storageSource).not.toMatch(/app\.(post|put|patch|delete)\(/);
  });
});
