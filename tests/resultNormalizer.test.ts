import { normalizeAgentResult } from "../src/services/resultNormalizer";

describe("normalizeAgentResult", () => {
  test("returns a stable typed contract on the happy path", () => {
    const result = normalizeAgentResult({
      outputText: JSON.stringify({
        status: "success",
        summary: "Potential fraud case needs immediate incident handling.",
        score: 0.98,
        priority: "critical",
        customerMessage:
          "Your request was received and routed for immediate review.",
        warnings: ["Detected transaction pattern associated with chargebacks."],
      }),
      caseId: "case-123",
      requestId: "req-123",
      source: "agent",
      receivedAt: "2026-03-28T20:00:02.000Z",
      modelName: "gpt-4.1",
      latencyMs: 734,
      retryCount: 1,
      fallbackUsed: true,
    });

    expect(result).toEqual({
      ok: true,
      value: {
        status: "success",
        summary: "Potential fraud case needs immediate incident handling.",
        score: 0.98,
        priority: "critical",
        recommendedAction: "escalate_on_call",
        queue: "incident-response",
        customerMessage:
          "Your request was received and routed for immediate review.",
        caseId: "case-123",
        requestId: "req-123",
        source: "agent",
        warnings: [
          "Detected transaction pattern associated with chargebacks.",
        ],
        telemetry: {
          receivedAt: "2026-03-28T20:00:02.000Z",
          modelName: "gpt-4.1",
          latencyMs: 734,
          retryCount: 1,
          fallbackUsed: true,
        },
      },
    });
  });

  test("fails deterministically when the output is malformed JSON", () => {
    const result = normalizeAgentResult({
      outputText: "{not-json",
      requestId: "req-456",
      source: "function",
    });

    expect(result).toEqual({
      ok: false,
      code: "INVALID_JSON",
      message: "Agent output was not valid JSON.",
      caseId: null,
      requestId: "req-456",
      rawOutput: "{not-json",
    });
  });

  test("maps retryable failures into a deterministic fallback action", () => {
    const result = normalizeAgentResult({
      outputText: JSON.stringify({
        status: "retryable_failure",
        summary: "Primary extraction timed out before returning a result.",
        score: 0.12,
        priority: "medium",
        customerMessage:
          "We received your request and are retrying the analysis path.",
        warnings: ["Timed out on the primary extraction path."],
      }),
      caseId: "case-retry",
      requestId: "req-retry",
      source: "function",
      modelName: "gpt-4.1-mini",
      latencyMs: 1400,
      retryCount: 2,
      fallbackUsed: true,
    });

    expect(result).toEqual({
      ok: true,
      value: {
        status: "retryable_failure",
        summary: "Primary extraction timed out before returning a result.",
        score: 0.12,
        priority: "medium",
        recommendedAction: "retry_with_fallback",
        queue: "operations-triage",
        customerMessage:
          "We received your request and are retrying the analysis path.",
        caseId: "case-retry",
        requestId: "req-retry",
        source: "function",
        warnings: ["Timed out on the primary extraction path."],
        telemetry: {
          receivedAt: null,
          modelName: "gpt-4.1-mini",
          latencyMs: 1400,
          retryCount: 2,
          fallbackUsed: true,
        },
      },
    });
  });
});
