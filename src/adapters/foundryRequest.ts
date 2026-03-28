import type { AgentCallInput } from "../contracts/types";

export interface FoundryRequestPayload {
  input: string;
  metadata: {
    conversationId: string;
    caseId: string;
    targetQueue: string;
    useCase: "intake-triage";
    requestedAt: string;
  };
}

export function toFoundryRequest(input: AgentCallInput): FoundryRequestPayload {
  return {
    input: input.prompt,
    metadata: {
      conversationId: input.conversationId,
      caseId: input.caseId,
      targetQueue: input.targetQueue,
      useCase: input.useCase,
      requestedAt: input.requestedAt,
    },
  };
}
