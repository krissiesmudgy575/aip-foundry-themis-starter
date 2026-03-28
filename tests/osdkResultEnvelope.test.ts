import { buildOsdkResultEnvelope } from "../src/services/osdkResultEnvelope";

describe("buildOsdkResultEnvelope", () => {
  test("builds an OSDK-facing result envelope from the normalized app contract", () => {
    const envelope = buildOsdkResultEnvelope({
      result: {
        status: "success",
        summary: "The dispute should be escalated to incident response.",
        score: 0.95,
        priority: "high",
        recommendedAction: "escalate_on_call",
        queue: "incident-response",
        customerMessage:
          "Your request was received and escalated for rapid review.",
        caseId: "case-500",
        requestId: "req-500",
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
      viewModel: {
        caseId: "case-500",
        headline: "Case case-500 routed to incident-response",
        severityLabel: "High priority",
        destinationQueue: "incident-response",
        primaryActionLabel: "Escalate to incident response",
        operatorSummary: "The dispute should be escalated to incident response.",
        customerMessage:
          "Your request was received and escalated for rapid review.",
        operatorNotes: ["Status: success", "Score: 0.95"],
        observabilityContext: {
          requestId: "req-500",
          modelName: "gpt-4.1",
          latencyMs: 615,
          retryCount: 0,
          fallbackUsed: false,
        },
      },
      themisPassed: true,
      artifactPath: "artifacts/demo-export/themis-summary.json",
      generatedAt: "2026-03-28T20:00:00.000Z",
    });

    expect(envelope).toEqual({
      schemaVersion: "0.1",
      useCase: "intake-triage",
      caseId: "case-500",
      status: "success",
      queue: "incident-response",
      recommendedAction: "escalate_on_call",
      customerMessage:
        "Your request was received and escalated for rapid review.",
      operatorSummary: "The dispute should be escalated to incident response.",
      operatorNotes: ["Status: success", "Score: 0.95"],
      observability: {
        requestId: "req-500",
        modelName: "gpt-4.1",
        latencyMs: 615,
        retryCount: 0,
        fallbackUsed: false,
      },
      localValidation: {
        themisPassed: true,
        generatedAt: "2026-03-28T20:00:00.000Z",
        artifactPath: "artifacts/demo-export/themis-summary.json",
      },
    });
  });
});

