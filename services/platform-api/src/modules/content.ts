import type { Mission, World } from "@kids-coding-app/content-schema";
import type { FastifyPluginAsync } from "fastify";
import { sendNotFound } from "./validation.js";

const WORLDS: World[] = [
  {
    id: "world-pixel-park",
    slug: "pixel-park-adventure",
    title: "Pixel Park Adventure",
    theme: "story-animation",
    targetAgeBand: "5-7",
    unlockRules: ["default-world"],
    narrationProfile: "guided-default",
    missionOrder: ["mission-1", "mission-2", "mission-3"],
    parentGuideSummary: "Parent-guided first world focused on confidence and quick wins."
  }
];

const MISSIONS: Mission[] = [
  {
    id: "mission-1",
    worldId: "world-pixel-park",
    order: 1,
    title: "Wake Up The Park",
    learningGoals: ["sequence", "event-trigger"],
    starterScene: "scene-park-morning",
    allowedBlocks: ["move", "start", "repeat"],
    narrationSteps: ["tap-start", "drag-move", "press-play"],
    successConditions: ["character-reaches-gate"],
    rewardEvents: ["RewardEarned"],
    estimatedDurationMinutes: 8,
    parentPrompt: "Celebrate each retry and ask the child to explain their block order."
  },
  {
    id: "mission-2",
    worldId: "world-pixel-park",
    order: 2,
    title: "Bridge Builder",
    learningGoals: ["sequence", "loop"],
    starterScene: "scene-bridge",
    allowedBlocks: ["move", "repeat", "turn"],
    narrationSteps: ["drag-repeat", "set-count", "test-bridge"],
    successConditions: ["crosses-bridge"],
    rewardEvents: ["RewardEarned"],
    estimatedDurationMinutes: 9
  },
  {
    id: "mission-3",
    worldId: "world-pixel-park",
    order: 3,
    title: "Lantern Parade",
    learningGoals: ["sequence", "event-trigger", "loop"],
    starterScene: "scene-lantern-night",
    allowedBlocks: ["start", "move", "repeat", "sound"],
    narrationSteps: ["place-lantern", "repeat-pattern", "play-show"],
    successConditions: ["parade-complete"],
    rewardEvents: ["RewardEarned", "SandboxUnlocked"],
    estimatedDurationMinutes: 10,
    sandboxUnlocks: ["starter-sandbox-1"]
  }
];

export const registerContentRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Reply: { worlds: World[] } }>("/content/worlds", async () => {
    return { worlds: WORLDS };
  });

  app.get<{ Params: { worldId: string }; Reply: { missions: Mission[] } }>(
    "/content/worlds/:worldId/missions",
    async (request, reply) => {
      const missions = MISSIONS.filter((mission) => mission.worldId === request.params.worldId);
      if (missions.length === 0) {
        return sendNotFound(reply, `No missions were found for world ${request.params.worldId}.`);
      }

      return { missions };
    }
  );
};
