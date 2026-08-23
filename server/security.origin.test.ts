import { describe, expect, it } from "vitest";
import type { Request } from "express";
import { isSameOriginMetadata } from "./_core/index";

function requestWith(headers: Record<string, string>): Request {
  return {
    get(name: string) {
      return headers[name.toLowerCase()] ?? undefined;
    },
  } as Request;
}

describe("same-origin mutation metadata", () => {
  it("accepts an explicit same-origin Origin", () => {
    expect(isSameOriginMetadata(requestWith({
      host: "reforge.example",
      origin: "https://reforge.example",
    }))).toBe(true);
  });

  it("accepts a same-origin Referer when Origin is absent", () => {
    expect(isSameOriginMetadata(requestWith({
      host: "reforge.example",
      referer: "https://reforge.example/dashboard",
    }))).toBe(true);
  });

  it("rejects cross-origin metadata and missing metadata", () => {
    expect(isSameOriginMetadata(requestWith({
      host: "reforge.example",
      origin: "https://evil.example",
    }))).toBe(false);
    expect(isSameOriginMetadata(requestWith({ host: "reforge.example" }))).toBe(false);
  });
});
