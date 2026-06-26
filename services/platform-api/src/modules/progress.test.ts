import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildApp } from "../app.js";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("progress routes", () => {
  it("stores mission completion and sandbox unlock event", async () => {
    const dataDir = await mkdtemp(join(tmpdir(), "platform-api-progress-"));
    tempDirs.push(dataDir);
    process.env.API_DATA_DIR = dataDir;

    const app = await buildApp();

    const missionResponse = await app.inject({
      method: "POST",
      url: "/progress/child-ava/world-pixel-park/mission-complete",
      payload: {
        missionId: "mission-3",
        unlockSandbox: true
      }
    });

    expect(missionResponse.statusCode).toBe(200);
    const missionBody = missionResponse.json() as {
      progress: { completedMissions: string[]; unlockedFeatures: string[] };
      emittedEvents: string[];
    };

    expect(missionBody.progress.completedMissions).toContain("mission-3");
    expect(missionBody.progress.unlockedFeatures).toContain("starter-sandbox");
    expect(missionBody.emittedEvents).toContain("SandboxUnlocked");

    const readResponse = await app.inject({
      method: "GET",
      url: "/progress/child-ava/world-pixel-park"
    });

    expect(readResponse.statusCode).toBe(200);
    const readBody = readResponse.json() as { progress: { completedMissions: string[] } };
    expect(readBody.progress.completedMissions).toContain("mission-3");

    await app.close();
  });
});
