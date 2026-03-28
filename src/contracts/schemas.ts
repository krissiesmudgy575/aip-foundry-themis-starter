import { z } from "zod";

export const normalizedStatusSchema = z.enum([
  "success",
  "needs_review",
  "retryable_failure",
]);

export const triagePrioritySchema = z.enum([
  "low",
  "medium",
  "high",
  "critical",
]);

export const rawAgentPayloadSchema = z.object({
  status: normalizedStatusSchema,
  summary: z.string().trim().min(1),
  score: z.number().min(0).max(1),
  priority: triagePrioritySchema,
  customerMessage: z.string().trim().min(1),
  warnings: z.array(z.string()).optional().default([]),
});

export type RawAgentPayload = z.infer<typeof rawAgentPayloadSchema>;
