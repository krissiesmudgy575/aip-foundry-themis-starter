import { toFoundryRequest } from "../src/adapters/foundryRequest";
import { fromFoundryResponse } from "../src/adapters/foundryResponse";

describe("foundry contract adapters", () => {
  test("builds the request payload expected by the local adapter contract", () => {
    expect(
      toFoundryRequest({
        prompt: "Classify this record",
        conversationId: "conv-999",
        caseId: "case-999",
        targetQueue: "operations-triage",
        useCase: "intake-triage",
        requestedAt: "2026-03-28T20:00:00.000Z",
      }),
    ).toEqual({
      input: "Classify this record",
      metadata: {
        conversationId: "conv-999",
        caseId: "case-999",
        targetQueue: "operations-triage",
        useCase: "intake-triage",
        requestedAt: "2026-03-28T20:00:00.000Z",
      },
    });
  });

  test("extracts a response envelope from a Foundry-like response", () => {
    expect(
      fromFoundryResponse({
        outputText:
          "{\"status\":\"success\",\"summary\":\"ok\",\"score\":1,\"priority\":\"medium\",\"customerMessage\":\"We received your request.\"}",
        caseId: "case-999",
        requestId: "req-999",
        source: "function",
        telemetry: {
          receivedAt: "2026-03-28T20:00:05.000Z",
          modelName: "gpt-4.1",
          latencyMs: 812,
          retryCount: 1,
          fallbackUsed: true,
        },
      }),
    ).toEqual({
      outputText:
        "{\"status\":\"success\",\"summary\":\"ok\",\"score\":1,\"priority\":\"medium\",\"customerMessage\":\"We received your request.\"}",
      caseId: "case-999",
      requestId: "req-999",
      source: "function",
      receivedAt: "2026-03-28T20:00:05.000Z",
      modelName: "gpt-4.1",
      latencyMs: 812,
      retryCount: 1,
      fallbackUsed: true,
    });
  });
});
