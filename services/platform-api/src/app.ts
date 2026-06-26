import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { registerContentRoutes } from "./modules/content.js";
import { registerFamilyCircleRoutes } from "./modules/family-circle.js";
import { registerOnboardingRoutes } from "./modules/onboarding.js";
import { registerProgressRoutes } from "./modules/progress.js";
import { registerProjectRoutes } from "./modules/projects.js";

export const buildApp = async (): Promise<FastifyInstance> => {
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
  await app.register(registerOnboardingRoutes);
  await app.register(registerProgressRoutes);
  await app.register(registerProjectRoutes);
  await app.register(registerFamilyCircleRoutes);

  return app;
};
