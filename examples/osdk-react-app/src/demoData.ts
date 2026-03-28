import { toFoundryRequest } from "../../../src/adapters/foundryRequest";
import { buildAgentInput } from "../../../src/services/agentInputBuilder";
import { buildEvalHandoffArtifact } from "../../../src/services/evalHandoffBuilder";
import { normalizeAgentResult } from "../../../src/services/resultNormalizer";
import { buildTriageAppViewModel } from "../../../src/services/triageAppViewModel";

const input = buildAgentInput({
  userPrompt: "Triage an inbound dispute for potential fraud escalation.",
  conversationId: "demo-react-conversation",
  caseId: "case-react-001",
  targetQueue: "operations-triage",
  requestedAt: "2026-03-28T20:00:00.000Z",
});

const envelope = {
  outputText: JSON.stringify({
    status: "success",
    summary: "The dispute should be escalated to incident response.",
    score: 0.97,
    priority: "high",
    customerMessage:
      "Your request was received and escalated for rapid review.",
    warnings: [
      "Chargeback pattern matched a prior fraud cluster.",
      "High-value transaction exceeded the escalation threshold."
    ],
  }),
  caseId: input.caseId,
  requestId: "req-react-001",
  source: "agent" as const,
  modelName: "gpt-4.1",
  latencyMs: 702,
  retryCount: 0,
  fallbackUsed: false,
};

const normalized = normalizeAgentResult(envelope);

if (!normalized.ok) {
  throw new Error(`Expected successful demo data, got ${normalized.code}`);
}

export const triageDemo = {
  input,
  foundryRequest: toFoundryRequest(input),
  normalizedResult: normalized.value,
  appViewModel: buildTriageAppViewModel(input, normalized.value),
  evalHandoff: buildEvalHandoffArtifact({
    scenarioId: "react-demo-escalation",
    input,
    envelope,
    result: normalized,
  }),
};

