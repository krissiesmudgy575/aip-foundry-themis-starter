import { buildAgentInput } from "../src/services/agentInputBuilder";
import { buildTriageAppViewModel } from "../src/services/triageAppViewModel";
import { executeTriageWithOsdkClient } from "../src/adapters/osdkTriageClient";

const input = buildAgentInput({
  userPrompt: "Triage an inbound dispute for potential fraud escalation.",
  conversationId: "demo-conversation",
  caseId: "case-demo-001",
  targetQueue: "operations-triage",
  requestedAt: "2026-03-28T20:00:00.000Z",
});

async function main() {
  const triageResult = await executeTriageWithOsdkClient(
    {
      async invokeTriage() {
        return {
          outputText: JSON.stringify({
            status: "success",
            summary: "The dispute should be escalated to incident response.",
            score: 0.96,
            priority: "high",
            customerMessage:
              "Your request was received and escalated for rapid review.",
            warnings: ["Chargeback pattern matched a prior fraud cluster."],
          }),
          requestId: "req-demo-001",
          source: "agent",
          modelName: "gpt-4.1",
          latencyMs: 720,
          retryCount: 0,
          fallbackUsed: false,
        };
      },
    },
    input,
  );

  if (!triageResult.normalized.ok) {
    throw new Error(
      `Expected a successful demo result, received ${triageResult.normalized.code}`,
    );
  }

  const viewModel = buildTriageAppViewModel(input, triageResult.normalized.value);

  console.log(
    JSON.stringify(
      {
        foundryRequest: triageResult.request,
        responseEnvelope: triageResult.envelope,
        normalizedContract: triageResult.normalized.value,
        appViewModel: viewModel,
      },
      null,
      2,
    ),
  );
}

void main();
