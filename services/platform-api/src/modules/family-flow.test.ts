import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildApp } from "../app.js";

const tempDirs: string[] = [];

afterEach(async () => {
  delete process.env.API_DATA_DIR;
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("family happy path", () => {
  it("persists parent setup, child profile lookup, and mission completion across surfaces", async () => {
    const dataDir = await mkdtemp(join(tmpdir(), "platform-api-family-flow-"));
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

    const childResponse = await app.inject({
      method: "GET",
      url: "/onboarding/child-ava"
    });

    expect(childResponse.statusCode).toBe(200);
    const childBody = childResponse.json() as {
      childProfile: {
        childId: string;
        displayName: string;
        guidanceSettings: string[];
      } | null;
    };
    expect(childBody.childProfile).toMatchObject({
      childId: "child-ava",
      displayName: "Ava",
      guidanceSettings: ["narration-on", "parent-hints-on"]
    });

    const missionResponse = await app.inject({
      method: "POST",
      url: "/progress/child-ava/world-pixel-park/mission-complete",
      payload: {
        missionId: "mission-3",
        unlockSandbox: true
      }
    });

    expect(missionResponse.statusCode).toBe(200);

    const progressResponse = await app.inject({
      method: "GET",
      url: "/progress/child-ava/world-pixel-park"
    });

    expect(progressResponse.statusCode).toBe(200);
    const progressBody = progressResponse.json() as {
      progress: {
        completedMissions: string[];
        unlockedFeatures: string[];
        lastSessionState: string;
      };
    };
    expect(progressBody.progress.completedMissions).toEqual(["mission-3"]);
    expect(progressBody.progress.unlockedFeatures).toEqual(["starter-sandbox"]);
    expect(progressBody.progress.lastSessionState).toBe("mission-complete");

    await app.close();
  });
});