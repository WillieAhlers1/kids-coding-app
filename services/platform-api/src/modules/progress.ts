import type { DomainEvent, WorldProgress } from "@kids-coding-app/shared-domain";
import type { FastifyPluginAsync } from "fastify";
import { progressMissionBodySchema, progressParamsSchema } from "./contracts.js";
import type { ProgressRepository } from "../persistence/repositories.js";
import { validateInput } from "./validation.js";

const defaultProgress = (childId: string, worldId: string): WorldProgress => ({
  childId,
  worldId,
  completedMissions: [],
  unlockedFeatures: [],
  masterySignals: [],
  lastSessionState: "not-started"
});

export const registerProgressRoutes = (repository: ProgressRepository): FastifyPluginAsync => async (app) => {
  app.get<{ Params: { childId: string; worldId: string }; Reply: { progress: WorldProgress } }>(
    "/progress/:childId/:worldId",
    async (request, reply) => {
      const params = validateInput(reply, progressParamsSchema, request.params);
      if (!params) {
        return reply;
      }

      const progress =
        (await repository.getProgress(params.childId, params.worldId)) ??
        defaultProgress(params.childId, params.worldId);

      return { progress };
    }
  );

  app.post<{
    Params: { childId: string; worldId: string };
    Body: { missionId: string; unlockSandbox?: boolean };
    Reply: { progress: WorldProgress; emittedEvents: DomainEvent[] };
  }>("/progress/:childId/:worldId/mission-complete", async (request, reply) => {
    const params = validateInput(reply, progressParamsSchema, request.params);
    const body = validateInput(reply, progressMissionBodySchema, request.body);
    if (!params || !body) {
      return reply;
    }

    const current =
      (await repository.getProgress(params.childId, params.worldId)) ??
      defaultProgress(params.childId, params.worldId);

    const alreadyCompleted = current.completedMissions.includes(body.missionId);
    const completedMissions = alreadyCompleted
      ? current.completedMissions
      : [...current.completedMissions, body.missionId];
    const unlockedFeatures = body.unlockSandbox
      ? Array.from(new Set([...current.unlockedFeatures, "starter-sandbox"]))
      : current.unlockedFeatures;

    const updatedProgress: WorldProgress = {
      ...current,
      completedMissions,
      unlockedFeatures,
      lastSessionState: "mission-complete"
    };

    await repository.saveProgress(updatedProgress);

    const emittedEvents: DomainEvent[] = ["MissionCompleted"];
    if (body.unlockSandbox) {
      emittedEvents.push("SandboxUnlocked");
    }

    return { progress: updatedProgress, emittedEvents };
  });
};
