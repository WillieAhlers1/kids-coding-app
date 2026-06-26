import type { DomainEvent, ProjectDocument } from "@kids-coding-app/shared-domain";
import type { FastifyPluginAsync } from "fastify";
import { JsonFileStore } from "../persistence/json-file-store.js";

const projectStore = new JsonFileStore<ProjectDocument>("projects.json");

export const registerProjectRoutes: FastifyPluginAsync = async (app) => {
  app.post<{
    Body: { ownerChildId: string; originMissionId?: string; sceneState?: string };
    Reply: { project: ProjectDocument; emittedEvents: DomainEvent[] };
  }>("/projects", async (request) => {
    const projectId = `project-${Date.now()}`;
    const project: ProjectDocument = {
      projectId,
      ownerChildId: request.body.ownerChildId,
      originMissionId: request.body.originMissionId,
      sceneState: request.body.sceneState ?? "{}",
      codeBlocks: [],
      assets: [],
      remixLineage: []
    };

      await projectStore.updateAll((records) => [...records, project]);

    return {
      project,
      emittedEvents: ["ProjectCreated"]
    };
  });

  app.get<{ Params: { projectId: string }; Reply: { project: ProjectDocument | null } }>(
    "/projects/:projectId",
    async (request) => {
      const records = await projectStore.readAll();
      const project = records.find((item) => item.projectId === request.params.projectId) ?? null;
      return { project };
    }
  );

  app.post<{
    Params: { projectId: string };
    Body: { sceneState: string; codeBlocks: string[]; assets: string[] };
    Reply: { project: ProjectDocument | null; emittedEvents: DomainEvent[] };
  }>("/projects/:projectId/save", async (request, reply) => {
    const records = await projectStore.readAll();
    const current = records.find((item) => item.projectId === request.params.projectId);
    if (!current) {
      return reply.code(404).send({ project: null, emittedEvents: [] });
    }

    const updated: ProjectDocument = {
      ...current,
      sceneState: request.body.sceneState,
      codeBlocks: request.body.codeBlocks,
      assets: request.body.assets
    };

    const nextRecords = records.filter((item) => item.projectId !== request.params.projectId);
    nextRecords.push(updated);
      await projectStore.updateAll((existing) => {
        const nextRecords = existing.filter((item) => item.projectId !== request.params.projectId);
        nextRecords.push(updated);
        return nextRecords;
      });

    return {
      project: updated,
      emittedEvents: ["ProjectSaved"]
    };
  });
};
