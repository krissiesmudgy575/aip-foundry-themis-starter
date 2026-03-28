import type { AgentCallInput, TriageQueue } from "../contracts/types";

export interface BuildAgentInputParams {
  userPrompt: string;
  conversationId: string;
  caseId: string;
  targetQueue?: TriageQueue;
  requestedAt?: string;
}

export function buildAgentInput(
  params: BuildAgentInputParams,
): AgentCallInput {
  return {
    prompt: params.userPrompt.trim(),
    conversationId: params.conversationId,
    caseId: params.caseId,
    targetQueue: params.targetQueue ?? "operations-triage",
    useCase: "intake-triage",
    requestedAt: params.requestedAt ?? new Date().toISOString(),
  };
}
