import type { DomainEvent, ProjectDocument } from "@kids-coding-app/shared-domain";
import type { FastifyPluginAsync } from "fastify";
import type { ProjectRepository } from "../persistence/repositories.js";
import { sendNotFound } from "./validation.js";

export const registerProjectRoutes = (repository: ProjectRepository): FastifyPluginAsync => async (app) => {
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

    await repository.createProject(project);

    return {
      project,
      emittedEvents: ["ProjectCreated"]
    };
  });

  app.get<{ Params: { projectId: string }; Reply: { project: ProjectDocument | null } }>(
    "/projects/:projectId",
    async (request) => {
      const project = await repository.getProject(request.params.projectId);
      return { project };
    }
  );

  app.post<{
    Params: { projectId: string };
    Body: { sceneState: string; codeBlocks: string[]; assets: string[] };
    Reply: { project: ProjectDocument | null; emittedEvents: DomainEvent[] };
  }>("/projects/:projectId/save", async (request, reply) => {
    const current = await repository.getProject(request.params.projectId);
    if (!current) {
      return sendNotFound(reply, `Project ${request.params.projectId} was not found.`);
    }

    const updated: ProjectDocument = {
      ...current,
      sceneState: request.body.sceneState,
      codeBlocks: request.body.codeBlocks,
      assets: request.body.assets
    };

    await repository.saveProject(updated);

    return {
      project: updated,
      emittedEvents: ["ProjectSaved"]
    };
  });
};
