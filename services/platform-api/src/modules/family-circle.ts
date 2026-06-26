import type { DomainEvent, FamilyCircle } from "@kids-coding-app/shared-domain";
import type { FastifyPluginAsync } from "fastify";
import { JsonFileStore } from "../persistence/json-file-store.js";

const circleStore = new JsonFileStore<FamilyCircle>("family-circles.json");

export const registerFamilyCircleRoutes: FastifyPluginAsync = async (app) => {
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

    await circleStore.updateAll((circles) => [...circles, circle]);

    return {
      circle,
      emittedEvents: ["FamilyCircleCreated"]
    };
  });

  app.get<{ Params: { circleId: string }; Reply: { circle: FamilyCircle | null } }>(
    "/family-circles/:circleId",
    async (request) => {
      const circles = await circleStore.readAll();
      const circle = circles.find((item) => item.circleId === request.params.circleId) ?? null;
      return { circle };
    }
  );

  app.post<{
    Params: { circleId: string };
    Body: { projectId: string };
    Reply: { circle: FamilyCircle | null; emittedEvents: DomainEvent[] };
  }>("/family-circles/:circleId/approve-share", async (request, reply) => {
    const circles = await circleStore.readAll();
    const current = circles.find((item) => item.circleId === request.params.circleId);
    if (!current) {
      return reply.code(404).send({ circle: null, emittedEvents: [] });
    }

    const approvedShares = Array.from(new Set([...current.approvedShares, request.body.projectId]));
    const updated: FamilyCircle = { ...current, approvedShares };

    await circleStore.updateAll((existing) => {
      const nextCircles = existing.filter((item) => item.circleId !== request.params.circleId);
      nextCircles.push(updated);
      return nextCircles;
    });

    return { circle: updated, emittedEvents: ["ShareApproved"] };
  });

  app.post<{
    Params: { circleId: string };
    Body: { reaction: string };
    Reply: { circle: FamilyCircle | null; emittedEvents: DomainEvent[] };
  }>("/family-circles/:circleId/reactions", async (request, reply) => {
    const circles = await circleStore.readAll();
    const current = circles.find((item) => item.circleId === request.params.circleId);
    if (!current) {
      return reply.code(404).send({ circle: null, emittedEvents: [] });
    }

    const updated: FamilyCircle = {
      ...current,
      reactions: [...current.reactions, request.body.reaction]
    };

    await circleStore.updateAll((existing) => {
      const nextCircles = existing.filter((item) => item.circleId !== request.params.circleId);
      nextCircles.push(updated);
      return nextCircles;
    });

    return { circle: updated, emittedEvents: ["ReactionAdded"] };
  });
};
