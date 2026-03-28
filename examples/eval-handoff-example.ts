import { buildAgentInput } from "../src/services/agentInputBuilder";
import { buildEvalHandoffArtifact } from "../src/services/evalHandoffBuilder";
import { normalizeAgentResult } from "../src/services/resultNormalizer";

const input = buildAgentInput({
  userPrompt: "Triage an inbound dispute and decide whether to escalate it.",
  conversationId: "demo-conversation",
  caseId: "case-demo-002",
  targetQueue: "operations-triage",
  requestedAt: "2026-03-28T20:00:00.000Z",
});

const envelope = {
  outputText: JSON.stringify({
    status: "needs_review",
    summary: "The transaction metadata is incomplete and needs analyst review.",
    score: 0.66,
    priority: "medium",
    customerMessage:
      "We received your request and routed it for analyst review.",
    warnings: ["Merchant category code was missing from the payload."],
  }),
  caseId: input.caseId,
  requestId: "req-demo-002",
  source: "function" as const,
  modelName: "gpt-4.1-mini",
  latencyMs: 1042,
  retryCount: 1,
  fallbackUsed: true,
};

const normalized = normalizeAgentResult(envelope);
const handoff = buildEvalHandoffArtifact({
  scenarioId: "demo-triage-needs-review",
  input,
  envelope,
  result: normalized,
});

console.log(JSON.stringify(handoff, null, 2));
