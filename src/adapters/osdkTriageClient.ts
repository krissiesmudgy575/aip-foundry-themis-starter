import { fromFoundryResponse } from "./foundryResponse";
import { toFoundryRequest } from "./foundryRequest";
import type {
  AgentCallInput,
  NormalizationResult,
  RawAgentResultEnvelope,
} from "../contracts/types";
import { normalizeAgentResult } from "../services/resultNormalizer";

export interface OsdkLikeAgentClient {
  invokeTriage(
    request: ReturnType<typeof toFoundryRequest>,
  ): Promise<unknown>;
}

export interface OsdkTriageResult {
  request: ReturnType<typeof toFoundryRequest>;
  envelope: RawAgentResultEnvelope;
  normalized: NormalizationResult;
}

export async function executeTriageWithOsdkClient(
  client: OsdkLikeAgentClient,
  input: AgentCallInput,
): Promise<OsdkTriageResult> {
  const request = toFoundryRequest(input);
  const rawResponse =
    client && typeof client.invokeTriage === "function"
      ? await client.invokeTriage(request)
      : {
          caseId: input.caseId,
          source: "agent",
          outputText: "",
        };
  const envelope = fromFoundryResponse(rawResponse);

  if (!envelope.caseId) {
    envelope.caseId = input.caseId;
  }

  return {
    request,
    envelope,
    normalized: normalizeAgentResult(envelope),
  };
}
