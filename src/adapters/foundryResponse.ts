import type { RawAgentResultEnvelope } from "../contracts/types";

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function readString(
  value: Record<string, unknown> | null,
  key: string,
): string | undefined {
  const candidate = value?.[key];
  return typeof candidate === "string" ? candidate : undefined;
}

function readNumber(
  value: Record<string, unknown> | null,
  key: string,
): number | undefined {
  const candidate = value?.[key];
  return typeof candidate === "number" && Number.isFinite(candidate)
    ? candidate
    : undefined;
}

function readBoolean(
  value: Record<string, unknown> | null,
  key: string,
): boolean | undefined {
  const candidate = value?.[key];
  return typeof candidate === "boolean" ? candidate : undefined;
}

export function fromFoundryResponse(response: unknown): RawAgentResultEnvelope {
  const responseRecord = asRecord(response);
  const telemetryRecord = asRecord(responseRecord?.telemetry);
  const outputText = readString(responseRecord, "outputText");

  if (typeof outputText === "string") {
    const requestId = readString(responseRecord, "requestId");
    const caseId = readString(responseRecord, "caseId");
    const rawSource = responseRecord?.source;
    const source =
      rawSource === "agent" || rawSource === "function" ? rawSource : undefined;
    return {
      outputText,
      caseId,
      requestId,
      source,
      receivedAt:
        readString(responseRecord, "receivedAt") ??
        readString(telemetryRecord, "receivedAt"),
      modelName:
        readString(responseRecord, "modelName") ??
        readString(telemetryRecord, "modelName"),
      latencyMs:
        readNumber(responseRecord, "latencyMs") ??
        readNumber(telemetryRecord, "latencyMs"),
      retryCount:
        readNumber(responseRecord, "retryCount") ??
        readNumber(telemetryRecord, "retryCount"),
      fallbackUsed:
        readBoolean(responseRecord, "fallbackUsed") ??
        readBoolean(telemetryRecord, "fallbackUsed"),
    };
  }

  return {
    outputText: "",
    source: "agent",
  };
}
