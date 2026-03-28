import type {
  OsdkResultEnvelope,
  TriageAppViewModel,
  NormalizedAgentResult,
} from "../contracts/types";

export interface BuildOsdkResultEnvelopeParams {
  result: NormalizedAgentResult;
  viewModel: TriageAppViewModel;
  themisPassed: boolean;
  artifactPath?: string | null;
  generatedAt?: string;
}

export function buildOsdkResultEnvelope(
  params: BuildOsdkResultEnvelopeParams,
): OsdkResultEnvelope {
  const requestId = params.viewModel?.observabilityContext?.requestId ?? null;
  const modelName = params.viewModel?.observabilityContext?.modelName ?? null;
  const latencyMs = params.viewModel?.observabilityContext?.latencyMs ?? null;
  const retryCount = params.viewModel?.observabilityContext?.retryCount ?? 0;
  const fallbackUsed =
    params.viewModel?.observabilityContext?.fallbackUsed ?? false;

  return {
    schemaVersion: "0.1",
    useCase: "intake-triage",
    caseId: params.viewModel?.caseId ?? params.result?.caseId ?? "unknown-case",
    status: params.result?.status ?? "needs_review",
    queue: params.result?.queue ?? "manual-review",
    recommendedAction: params.result?.recommendedAction ?? "queue_for_review",
    customerMessage:
      params.viewModel?.customerMessage ??
      params.result?.customerMessage ??
      "Your request was received and queued for review.",
    operatorSummary:
      params.viewModel?.operatorSummary ??
      params.result?.summary ??
      "No operator summary was provided.",
    operatorNotes: params.viewModel?.operatorNotes ?? [],
    observability: {
      requestId,
      modelName,
      latencyMs,
      retryCount,
      fallbackUsed,
    },
    localValidation: {
      themisPassed: params.themisPassed,
      generatedAt: params.generatedAt ?? new Date().toISOString(),
      artifactPath: params.artifactPath ?? null,
    },
  };
}
