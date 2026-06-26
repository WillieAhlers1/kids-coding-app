import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/health", async () => {
  return {
    ok: true,
    service: "platform-api",
    scope: "family-first-v1"
  };
});

const start = async () => {
  try {
    await app.listen({ host: "0.0.0.0", port: 4000 });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
