import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import {
  createDefaultRepositories,
  type PlatformRepositories
} from "./persistence/repositories.js";
import { registerContentRoutes } from "./modules/content.js";
import { registerFamilyCircleRoutes } from "./modules/family-circle.js";
import { registerOnboardingRoutes } from "./modules/onboarding.js";
import { registerProgressRoutes } from "./modules/progress.js";
import { registerProjectRoutes } from "./modules/projects.js";

export const buildApp = async (
  repositories: PlatformRepositories = createDefaultRepositories()
): Promise<FastifyInstance> => {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: true
  });

  app.get("/health", async () => {
    return {
      ok: true,
      service: "platform-api",
      scope: "family-first-v1"
    };
  });

  await app.register(registerContentRoutes);
  await app.register(registerOnboardingRoutes(repositories.onboarding));
  await app.register(registerProgressRoutes(repositories.progress));
  await app.register(registerProjectRoutes(repositories.projects));
  await app.register(registerFamilyCircleRoutes(repositories.familyCircles));

  return app;
};
