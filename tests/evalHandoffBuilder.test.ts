import { buildEvalHandoffArtifact } from "../src/services/evalHandoffBuilder";
import { normalizeAgentResult } from "../src/services/resultNormalizer";

describe("buildEvalHandoffArtifact", () => {
  test("creates a platform-facing handoff artifact for successful local contracts", () => {
    const input = {
      prompt: "Triage incoming dispute case 7.",
      conversationId: "conv-7",
      caseId: "case-7",
      targetQueue: "operations-triage" as const,
      useCase: "intake-triage" as const,
      requestedAt: "2026-03-28T20:00:00.000Z",
    };
    const envelope = {
      outputText: JSON.stringify({
        status: "success",
        summary: "The case should be escalated to incident response.",
        score: 0.94,
        priority: "high",
        customerMessage:
          "Your request was received and escalated for rapid review.",
        warnings: [],
      }),
      caseId: "case-7",
      requestId: "req-7",
      source: "agent" as const,
      modelName: "gpt-4.1",
      latencyMs: 680,
      retryCount: 0,
      fallbackUsed: false,
    };

    const result = normalizeAgentResult(envelope);
    const artifact = buildEvalHandoffArtifact({
      scenarioId: "triage-escalation-happy-path",
      input,
      envelope,
      result,
    });

    expect(artifact).toEqual({
      schemaVersion: "0.1",
      useCase: "intake-triage",
      scenarioId: "triage-escalation-happy-path",
      localContractOutcome: "pass",
      request: input,
      responseContext: {
        caseId: "case-7",
        requestId: "req-7",
        source: "agent",
        modelName: "gpt-4.1",
        latencyMs: 680,
        retryCount: 0,
        fallbackUsed: false,
      },
      expectedContract: {
        type: "normalized-result",
        value: {
          status: "success",
          summary: "The case should be escalated to incident response.",
          score: 0.94,
          priority: "high",
          recommendedAction: "escalate_on_call",
          queue: "incident-response",
          customerMessage:
            "Your request was received and escalated for rapid review.",
          caseId: "case-7",
          requestId: "req-7",
          source: "agent",
          warnings: [],
          telemetry: {
            receivedAt: null,
            modelName: "gpt-4.1",
            latencyMs: 680,
            retryCount: 0,
            fallbackUsed: false,
          },
        },
      },
      suggestedEvalDimensions: [
        "triage_accuracy",
        "priority_assignment",
        "customer_message_quality",
      ],
      suggestedAssertions: [
        "The model assigns the correct triage priority for the case.",
        "The recommended action is consistent with the normalized queue.",
        "The customer-facing message is safe, concise, and aligned with the case outcome.",
      ],
      localArtifacts: {
        testFiles: [
          "tests/resultNormalizer.test.ts",
          "tests/failure-modes.test.ts",
          "tests/evalHandoffBuilder.test.ts",
        ],
        docs: [
          "docs/how-it-fits-with-aip-evals.md",
          "docs/integration-guide.md",
        ],
        examples: [
          "examples/osdk-client-example.ts",
          "examples/eval-handoff-example.ts",
          "examples/eval-handoff-example.json",
        ],
      },
    });
  });

  test("captures deterministic failure cases for later eval design", () => {
    const input = {
      prompt: "Triage incoming dispute case 8.",
      conversationId: "conv-8",
      caseId: "case-8",
      targetQueue: "operations-triage" as const,
      useCase: "intake-triage" as const,
      requestedAt: "2026-03-28T20:00:00.000Z",
    };
    const envelope = {
      outputText: "{bad-json",
      caseId: "case-8",
      requestId: "req-8",
      source: "function" as const,
      modelName: "gpt-4.1-mini",
      latencyMs: 1250,
      retryCount: 2,
      fallbackUsed: true,
    };

    const result = normalizeAgentResult(envelope);
    const artifact = buildEvalHandoffArtifact({
      scenarioId: "triage-invalid-json",
      input,
      envelope,
      result,
    });

    expect(artifact.localContractOutcome).toBe("fail");
    expect(artifact.expectedContract).toEqual({
      type: "normalization-failure",
      value: {
        code: "INVALID_JSON",
        message: "Agent output was not valid JSON.",
        caseId: "case-8",
        requestId: "req-8",
        rawOutput: "{bad-json",
      },
    });
    expect(artifact.suggestedEvalDimensions).toEqual([
      "triage_accuracy",
      "priority_assignment",
      "customer_message_quality",
      "fallback_recovery",
      "malformed_output_recovery",
    ]);
  });
});
