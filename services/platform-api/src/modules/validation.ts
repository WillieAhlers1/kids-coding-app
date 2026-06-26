import type { FastifyReply } from "fastify";
import type { z } from "zod";

export const validateInput = <TSchema extends z.ZodTypeAny>(
  reply: FastifyReply,
  schema: TSchema,
  payload: unknown
): z.infer<TSchema> | null => {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    void reply.code(400).send({
      error: "ValidationError",
      details: parsed.error.flatten()
    });
    return null;
  }

  return parsed.data;
};
