import { buildTriageAppViewModel } from "../src/services/triageAppViewModel";

describe("buildTriageAppViewModel", () => {
  test("builds a stable app-facing contract for an OSDK consumer", () => {
    const viewModel = buildTriageAppViewModel(
      {
        prompt: "Triage case 42 for operational risk.",
        conversationId: "conv-42",
        caseId: "case-42",
        targetQueue: "operations-triage",
        useCase: "intake-triage",
        requestedAt: "2026-03-28T20:00:00.000Z",
      },
      {
        status: "needs_review",
        summary: "The case contains missing merchant metadata.",
        score: 0.63,
        priority: "medium",
        recommendedAction: "queue_for_review",
        queue: "manual-review",
        customerMessage:
          "We received your request and routed it for analyst review.",
        caseId: "case-42",
        requestId: "req-42",
        source: "agent",
        warnings: ["Merchant category code was missing."],
        telemetry: {
          receivedAt: "2026-03-28T20:00:02.000Z",
          modelName: "gpt-4.1",
          latencyMs: 812,
          retryCount: 0,
          fallbackUsed: false,
        },
      },
    );

    expect(viewModel).toEqual({
      caseId: "case-42",
      headline: "Case case-42 routed to manual-review",
      severityLabel: "Medium priority",
      destinationQueue: "manual-review",
      primaryActionLabel: "Send to analyst review",
      operatorSummary: "The case contains missing merchant metadata.",
      customerMessage:
        "We received your request and routed it for analyst review.",
      operatorNotes: [
        "Status: needs_review",
        "Score: 0.63",
        "Requested queue: operations-triage",
        "Warnings: Merchant category code was missing.",
      ],
      observabilityContext: {
        requestId: "req-42",
        modelName: "gpt-4.1",
        latencyMs: 812,
        retryCount: 0,
        fallbackUsed: false,
      },
    });
  });
});

