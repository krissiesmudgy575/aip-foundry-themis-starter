import { normalizeAgentResult } from "../src/services/resultNormalizer";

describe("failure modes", () => {
  test("reports empty output deterministically", () => {
    const result = normalizeAgentResult({
      outputText: "   ",
      caseId: "case-empty-output",
      requestId: "req-empty-output",
      source: "agent",
    });

    expect(result).toEqual({
      ok: false,
      code: "EMPTY_OUTPUT",
      message: "Agent returned an empty output string.",
      caseId: "case-empty-output",
      requestId: "req-empty-output",
      rawOutput: "",
    });
  });

  test("reports schema validation failures for missing required fields", () => {
    const result = normalizeAgentResult({
      outputText: JSON.stringify({
        status: "success",
        score: 0.7,
      }),
      requestId: "req-missing-summary",
      source: "agent",
    });

    expect(result).toEqual({
      ok: false,
      code: "SCHEMA_VALIDATION_FAILED",
      message: "Agent output did not match the expected response schema.",
      caseId: null,
      requestId: "req-missing-summary",
      rawOutput: "{\"status\":\"success\",\"score\":0.7}",
    });
  });

  test("reports unsupported status values deterministically", () => {
    const result = normalizeAgentResult({
      outputText: JSON.stringify({
        status: "partial_success",
        summary: "Needs manual review",
        score: 0.4,
        priority: "medium",
        customerMessage: "We are reviewing your request.",
      }),
      caseId: "case-unsupported-status",
      requestId: "req-unsupported-status",
      source: "agent",
    });

    expect(result).toEqual({
      ok: false,
      code: "UNSUPPORTED_STATUS",
      message: "Unsupported status value: partial_success.",
      caseId: "case-unsupported-status",
      requestId: "req-unsupported-status",
      rawOutput:
        "{\"status\":\"partial_success\",\"summary\":\"Needs manual review\",\"score\":0.4,\"priority\":\"medium\",\"customerMessage\":\"We are reviewing your request.\"}",
    });
  });
});
