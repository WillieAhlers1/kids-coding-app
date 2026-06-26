import type { FastifyReply } from "fastify";
import type { z } from "zod";

type ApiErrorPayload = {
  error: string;
  message: string;
  statusCode: number;
  fieldErrors: Record<string, string[]>;
};

const sendApiError = (
  reply: FastifyReply,
  statusCode: number,
  error: string,
  message: string,
  fieldErrors: Record<string, string[]> = {}
): FastifyReply => {
  const payload: ApiErrorPayload = {
    error,
    message,
    statusCode,
    fieldErrors
  };

  return reply.code(statusCode).send(payload);
};

const normalizeFieldErrors = (
  fieldErrors: Record<string, string[] | undefined>
): Record<string, string[]> =>
  Object.fromEntries(
    Object.entries(fieldErrors).filter((entry): entry is [string, string[]] => entry[1] !== undefined)
  );

export const validateInput = <TSchema extends z.ZodTypeAny>(
  reply: FastifyReply,
  schema: TSchema,
  payload: unknown
): z.infer<TSchema> | null => {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    void sendApiError(
      reply,
      400,
      "ValidationError",
      "Request validation failed.",
      normalizeFieldErrors(parsed.error.flatten().fieldErrors)
    );
    return null;
  }

  return parsed.data;
};

export const sendNotFound = (
  reply: FastifyReply,
  message: string,
  error = "NotFound"
): FastifyReply => sendApiError(reply, 404, error, message);
