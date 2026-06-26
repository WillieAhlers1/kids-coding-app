import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildApp } from "../app.js";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("onboarding routes", () => {
  it("creates and reads child onboarding profile", async () => {
    const dataDir = await mkdtemp(join(tmpdir(), "platform-api-onboarding-"));
    tempDirs.push(dataDir);
    process.env.API_DATA_DIR = dataDir;

    const app = await buildApp();

    const setupResponse = await app.inject({
      method: "POST",
      url: "/onboarding/setup",
      payload: {
        adultId: "mom-olivia",
        childId: "child-ava",
        displayName: "Ava",
        ageBand: "5-7",
        guidanceSettings: ["narration-on", "parent-hints-on"]
      }
    });

    expect(setupResponse.statusCode).toBe(200);
    const setupBody = setupResponse.json() as { emittedEvents: string[] };
    expect(setupBody.emittedEvents).toContain("ChildProfileCreated");

    const childResponse = await app.inject({
      method: "GET",
      url: "/onboarding/child-ava"
    });

    expect(childResponse.statusCode).toBe(200);
    const childBody = childResponse.json() as { childProfile: { displayName: string } | null };
    expect(childBody.childProfile?.displayName).toBe("Ava");

    await app.close();
  });
});
