import { buildAgentInput } from "../src/services/agentInputBuilder";
import { executeTriageWithOsdkClient } from "../src/adapters/osdkTriageClient";

describe("executeTriageWithOsdkClient", () => {
  test("runs the full request to normalization flow through an OSDK-like client", async () => {
    const input = buildAgentInput({
      userPrompt: "Triage dispute case 91.",
      conversationId: "conv-91",
      caseId: "case-91",
      targetQueue: "operations-triage",
      requestedAt: "2026-03-28T20:00:00.000Z",
    });

    const result = await executeTriageWithOsdkClient(
      {
        async invokeTriage(request) {
          expect(request.metadata.caseId).toBe("case-91");

          return {
            outputText: JSON.stringify({
              status: "success",
              summary: "The dispute should be escalated to incident response.",
              score: 0.95,
              priority: "high",
              customerMessage:
                "Your request was received and escalated for rapid review.",
              warnings: [],
            }),
            requestId: "req-91",
            source: "agent",
            telemetry: {
              modelName: "gpt-4.1",
              latencyMs: 615,
              retryCount: 0,
              fallbackUsed: false,
            },
          };
        },
      },
      input,
    );

    expect(result.request.metadata.caseId).toBe("case-91");
    expect(result.envelope.caseId).toBe("case-91");
    expect(result.normalized).toEqual({
      ok: true,
      value: {
        status: "success",
        summary: "The dispute should be escalated to incident response.",
        score: 0.95,
        priority: "high",
        recommendedAction: "escalate_on_call",
        queue: "incident-response",
        customerMessage:
          "Your request was received and escalated for rapid review.",
        caseId: "case-91",
        requestId: "req-91",
        source: "agent",
        warnings: [],
        telemetry: {
          receivedAt: null,
          modelName: "gpt-4.1",
          latencyMs: 615,
          retryCount: 0,
          fallbackUsed: false,
        },
      },
    });
  });
});

