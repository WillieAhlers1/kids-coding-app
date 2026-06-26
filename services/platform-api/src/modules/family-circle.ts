import type { DomainEvent, FamilyCircle } from "@kids-coding-app/shared-domain";
import type { FastifyPluginAsync } from "fastify";
import type { FamilyCircleRepository } from "../persistence/repositories.js";
import { sendNotFound } from "./validation.js";

export const registerFamilyCircleRoutes = (
  repository: FamilyCircleRepository
): FastifyPluginAsync => async (app) => {
  app.post<{
    Body: { members: string[]; visibilityRules?: string[] };
    Reply: { circle: FamilyCircle; emittedEvents: DomainEvent[] };
  }>("/family-circles", async (request) => {
    const circleId = `circle-${Date.now()}`;
    const circle: FamilyCircle = {
      circleId,
      members: request.body.members,
      visibilityRules: request.body.visibilityRules ?? ["family-only"],
      approvedShares: [],
      reactions: []
    };

    await repository.createCircle(circle);

    return {
      circle,
      emittedEvents: ["FamilyCircleCreated"]
    };
  });

  app.get<{ Params: { circleId: string }; Reply: { circle: FamilyCircle | null } }>(
    "/family-circles/:circleId",
    async (request) => {
      const circle = await repository.getCircle(request.params.circleId);
      return { circle };
    }
  );

  app.post<{
    Params: { circleId: string };
    Body: { projectId: string };
    Reply: { circle: FamilyCircle | null; emittedEvents: DomainEvent[] };
  }>("/family-circles/:circleId/approve-share", async (request, reply) => {
    const current = await repository.getCircle(request.params.circleId);
    if (!current) {
      return sendNotFound(reply, `Family circle ${request.params.circleId} was not found.`);
    }

    const approvedShares = Array.from(new Set([...current.approvedShares, request.body.projectId]));
    const updated: FamilyCircle = { ...current, approvedShares };

    await repository.saveCircle(updated);

    return { circle: updated, emittedEvents: ["ShareApproved"] };
  });

  app.post<{
    Params: { circleId: string };
    Body: { reaction: string };
    Reply: { circle: FamilyCircle | null; emittedEvents: DomainEvent[] };
  }>("/family-circles/:circleId/reactions", async (request, reply) => {
    const current = await repository.getCircle(request.params.circleId);
    if (!current) {
      return sendNotFound(reply, `Family circle ${request.params.circleId} was not found.`);
    }

    const updated: FamilyCircle = {
      ...current,
      reactions: [...current.reactions, request.body.reaction]
    };

    await repository.saveCircle(updated);

    return { circle: updated, emittedEvents: ["ReactionAdded"] };
  });
};
