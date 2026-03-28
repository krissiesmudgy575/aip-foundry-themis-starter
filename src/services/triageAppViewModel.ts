import type {
  AgentCallInput,
  NormalizedAgentResult,
  RecommendedAction,
  TriageAppViewModel,
  TriagePriority,
} from "../contracts/types";

function labelForPriority(priority: TriagePriority): string {
  switch (priority) {
    case "low":
      return "Low priority";
    case "medium":
      return "Medium priority";
    case "high":
      return "High priority";
    case "critical":
      return "Critical priority";
  }
}

function labelForAction(action: RecommendedAction): string {
  switch (action) {
    case "auto_close":
      return "Close case automatically";
    case "queue_for_review":
      return "Send to analyst review";
    case "escalate_on_call":
      return "Escalate to incident response";
    case "retry_with_fallback":
      return "Retry with fallback policy";
  }
}

export function buildTriageAppViewModel(
  input: AgentCallInput,
  result: NormalizedAgentResult,
): TriageAppViewModel {
  const caseId = result?.caseId ?? input.caseId;
  const safeScore =
    typeof result?.score === "number" ? result.score.toFixed(2) : "0.00";
  const operatorNotes = [
    `Status: ${result?.status ?? "needs_review"}`,
    `Score: ${safeScore}`,
    `Requested queue: ${input.targetQueue}`,
  ];

  if (Array.isArray(result?.warnings) && result.warnings.length > 0) {
    operatorNotes.push(`Warnings: ${result.warnings.join("; ")}`);
  }

  if (result?.telemetry?.fallbackUsed) {
    operatorNotes.push("Fallback path was used for this result.");
  }

  return {
    caseId,
    headline: `Case ${caseId} routed to ${result?.queue ?? input.targetQueue}`,
    severityLabel: labelForPriority(result?.priority ?? "medium"),
    destinationQueue: result?.queue ?? input.targetQueue,
    primaryActionLabel: labelForAction(
      result?.recommendedAction ?? "queue_for_review",
    ),
    operatorSummary: result?.summary ?? "No normalized summary was provided.",
    customerMessage:
      result?.customerMessage ??
      "Your request was received and queued for review.",
    operatorNotes,
    observabilityContext: {
      requestId: result?.requestId ?? null,
      modelName: result?.telemetry?.modelName ?? null,
      latencyMs: result?.telemetry?.latencyMs ?? null,
      retryCount: result?.telemetry?.retryCount ?? 0,
      fallbackUsed: result?.telemetry?.fallbackUsed ?? false,
    },
  };
}
