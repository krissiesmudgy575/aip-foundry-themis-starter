import { buildAgentInput } from "../src/services/agentInputBuilder";

describe("buildAgentInput", () => {
  test("trims prompt text and preserves caller metadata", () => {
    const built = buildAgentInput({
      userPrompt: "  summarize this workflow  ",
      conversationId: "conv-123",
      caseId: "case-123",
      targetQueue: "manual-review",
      requestedAt: "2026-03-28T20:00:00.000Z",
    });

    expect(built).toEqual({
      prompt: "summarize this workflow",
      conversationId: "conv-123",
      caseId: "case-123",
      targetQueue: "manual-review",
      useCase: "intake-triage",
      requestedAt: "2026-03-28T20:00:00.000Z",
    });
  });

  test("fills requestedAt when the caller does not provide one", () => {
    const built = buildAgentInput({
      userPrompt: "do the thing",
      conversationId: "conv-456",
      caseId: "case-456",
    });

    expect(built.prompt).toBe("do the thing");
    expect(built.conversationId).toBe("conv-456");
    expect(built.caseId).toBe("case-456");
    expect(built.targetQueue).toBe("operations-triage");
    expect(built.useCase).toBe("intake-triage");
    expect(Number.isNaN(Date.parse(built.requestedAt))).toBe(false);
  });
});
