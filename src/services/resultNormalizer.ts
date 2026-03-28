import { rawAgentPayloadSchema } from "../contracts/schemas";
import type {
  RecommendedAction,
  TriageQueue,
  NormalizationResult,
  RawAgentResultEnvelope,
} from "../contracts/types";

function resolveQueue(
  status: "success" | "needs_review" | "retryable_failure",
  priority: "low" | "medium" | "high" | "critical",
): TriageQueue {
  if (status === "needs_review") {
    return "manual-review";
  }

  if (status === "retryable_failure") {
    return "operations-triage";
  }

  return priority === "high" || priority === "critical"
    ? "incident-response"
    : "operations-triage";
}

function resolveRecommendedAction(
  status: "success" | "needs_review" | "retryable_failure",
  priority: "low" | "medium" | "high" | "critical",
): RecommendedAction {
  if (status === "retryable_failure") {
    return "retry_with_fallback";
  }

  if (status === "needs_review") {
    return "queue_for_review";
  }

  if (priority === "high" || priority === "critical") {
    return "escalate_on_call";
  }

  return priority === "medium" ? "queue_for_review" : "auto_close";
}

export function normalizeAgentResult(
  envelope: RawAgentResultEnvelope,
): NormalizationResult {
  const rawOutput =
    typeof envelope?.outputText === "string" ? envelope.outputText.trim() : "";
  const caseId = typeof envelope?.caseId === "string" ? envelope.caseId : null;
  const requestId =
    typeof envelope?.requestId === "string" ? envelope.requestId : null;
  const receivedAt =
    typeof envelope?.receivedAt === "string" ? envelope.receivedAt : null;
  const modelName =
    typeof envelope?.modelName === "string" ? envelope.modelName : null;
  const latencyMs =
    typeof envelope?.latencyMs === "number" && Number.isFinite(envelope.latencyMs)
      ? envelope.latencyMs
      : null;
  const retryCount =
    typeof envelope?.retryCount === "number" &&
    Number.isFinite(envelope.retryCount) &&
    envelope.retryCount >= 0
      ? Math.floor(envelope.retryCount)
      : 0;
  const fallbackUsed = envelope?.fallbackUsed === true;
  const source =
    envelope?.source === "agent" || envelope?.source === "function"
      ? envelope.source
      : "unknown";

  if (rawOutput.length === 0) {
    return {
      ok: false,
      code: "EMPTY_OUTPUT",
      message: "Agent returned an empty output string.",
      caseId,
      requestId,
      rawOutput,
    };
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawOutput);
  } catch {
    return {
      ok: false,
      code: "INVALID_JSON",
      message: "Agent output was not valid JSON.",
      caseId,
      requestId,
      rawOutput,
    };
  }

  const validation = rawAgentPayloadSchema.safeParse(parsed);

  if (!validation.success) {
    const parsedStatus =
      typeof parsed === "object" &&
      parsed !== null &&
      "status" in parsed &&
      typeof parsed.status === "string"
        ? parsed.status
        : null;

    const unsupportedStatus =
      parsedStatus !== null &&
      !["success", "needs_review", "retryable_failure"].includes(parsedStatus);

    if (unsupportedStatus) {
      return {
        ok: false,
        code: "UNSUPPORTED_STATUS",
        message: `Unsupported status value: ${parsedStatus}.`,
        caseId,
        requestId,
        rawOutput,
      };
    }

    return {
      ok: false,
      code: "SCHEMA_VALIDATION_FAILED",
      message: "Agent output did not match the expected response schema.",
      caseId,
      requestId,
      rawOutput,
    };
  }

  const queue = resolveQueue(validation.data.status, validation.data.priority);
  const recommendedAction = resolveRecommendedAction(
    validation.data.status,
    validation.data.priority,
  );

  return {
    ok: true,
    value: {
      status: validation.data.status,
      summary: validation.data.summary,
      score: validation.data.score,
      priority: validation.data.priority,
      recommendedAction,
      queue,
      customerMessage: validation.data.customerMessage,
      caseId,
      requestId,
      source,
      warnings: validation.data.warnings,
      telemetry: {
        receivedAt,
        modelName,
        latencyMs,
        retryCount,
        fallbackUsed,
      },
    },
  };
}
