export type NormalizationFailureCode =
  | "EMPTY_OUTPUT"
  | "INVALID_JSON"
  | "SCHEMA_VALIDATION_FAILED"
  | "UNSUPPORTED_STATUS";

export type TriagePriority = "low" | "medium" | "high" | "critical";
export type TriageQueue =
  | "operations-triage"
  | "manual-review"
  | "incident-response";
export type RecommendedAction =
  | "auto_close"
  | "queue_for_review"
  | "escalate_on_call"
  | "retry_with_fallback";

export interface AgentCallInput {
  prompt: string;
  conversationId: string;
  caseId: string;
  targetQueue: TriageQueue;
  useCase: "intake-triage";
  requestedAt: string;
}

export interface RawAgentResultEnvelope {
  outputText: string;
  caseId?: string;
  requestId?: string;
  source?: "agent" | "function";
  receivedAt?: string;
  modelName?: string;
  latencyMs?: number;
  retryCount?: number;
  fallbackUsed?: boolean;
}

export interface NormalizedTelemetry {
  receivedAt: string | null;
  modelName: string | null;
  latencyMs: number | null;
  retryCount: number;
  fallbackUsed: boolean;
}

export interface NormalizedAgentResult {
  status: "success" | "needs_review" | "retryable_failure";
  summary: string;
  score: number;
  priority: TriagePriority;
  recommendedAction: RecommendedAction;
  queue: TriageQueue;
  customerMessage: string;
  caseId: string | null;
  requestId: string | null;
  source: "agent" | "function" | "unknown";
  warnings: string[];
  telemetry: NormalizedTelemetry;
}

export interface NormalizationFailure {
  ok: false;
  code: NormalizationFailureCode;
  message: string;
  caseId: string | null;
  requestId: string | null;
  rawOutput: string;
}

export interface NormalizationSuccess {
  ok: true;
  value: NormalizedAgentResult;
}

export type NormalizationResult = NormalizationSuccess | NormalizationFailure;

export interface TriageAppViewModel {
  caseId: string;
  headline: string;
  severityLabel: string;
  destinationQueue: TriageQueue;
  primaryActionLabel: string;
  operatorSummary: string;
  customerMessage: string;
  operatorNotes: string[];
  observabilityContext: {
    requestId: string | null;
    modelName: string | null;
    latencyMs: number | null;
    retryCount: number;
    fallbackUsed: boolean;
  };
}

export interface EvalHandoffArtifact {
  schemaVersion: "0.1";
  useCase: "intake-triage";
  scenarioId: string;
  localContractOutcome: "pass" | "fail";
  request: AgentCallInput;
  responseContext: {
    caseId: string;
    requestId: string | null;
    source: "agent" | "function" | "unknown";
    modelName: string | null;
    latencyMs: number | null;
    retryCount: number;
    fallbackUsed: boolean;
  };
  expectedContract:
    | {
        type: "normalized-result";
        value: NormalizedAgentResult;
      }
    | {
        type: "normalization-failure";
        value: {
          code: NormalizationFailureCode;
          message: string;
          caseId: string | null;
          requestId: string | null;
          rawOutput: string;
        };
      };
  suggestedEvalDimensions: string[];
  suggestedAssertions: string[];
  localArtifacts: {
    testFiles: string[];
    docs: string[];
    examples: string[];
  };
}

export interface ThemisSummaryArtifact {
  schemaVersion: "0.1";
  useCase: "intake-triage";
  generatedAt: string;
  sourceArtifacts: {
    lastRunPath: string;
    failedTestsPath: string;
    generateLastPath: string;
  };
  totals: {
    passed: number;
    failed: number;
    skipped: number;
    total: number;
  };
  failedTests: string[];
  failureClusters: string[];
  generatedFiles: string[];
}

export interface OsdkResultEnvelope {
  schemaVersion: "0.1";
  useCase: "intake-triage";
  caseId: string;
  status: "success" | "needs_review" | "retryable_failure";
  queue: TriageQueue;
  recommendedAction: RecommendedAction;
  customerMessage: string;
  operatorSummary: string;
  operatorNotes: string[];
  observability: {
    requestId: string | null;
    modelName: string | null;
    latencyMs: number | null;
    retryCount: number;
    fallbackUsed: boolean;
  };
  localValidation: {
    themisPassed: boolean;
    generatedAt: string;
    artifactPath: string | null;
  };
}
