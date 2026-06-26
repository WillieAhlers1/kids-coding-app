"use client";

import React from "react";
import { useMemo, useState } from "react";

type SetupResponse = {
  childProfile: {
    childId: string;
    displayName: string;
    ageBand: "5-7" | "8-10";
    guidanceSettings: string[];
    progressSnapshot: string;
  };
  adultAccount: {
    adultId: string;
    linkedChildren: string[];
    consentState: "pending" | "granted" | "revoked";
  };
  emittedEvents: string[];
};

type GuidanceResponse = {
  childProfile: {
    childId: string;
    guidanceSettings: string[];
    progressSnapshot: string;
  } | null;
  emittedEvents: string[];
};

type ApiErrorPayload = {
  error: string;
  message: string;
  statusCode: number;
  fieldErrors: Record<string, string[]>;
};

const readApiError = async (
  response: Pick<Response, "json" | "status">
): Promise<ApiErrorPayload> => {
  const fallback: ApiErrorPayload = {
    error: "RequestFailed",
    message: `Request failed with status ${response.status}.`,
    statusCode: response.status,
    fieldErrors: {}
  };

  try {
    const payload = (await response.json()) as Partial<ApiErrorPayload>;
    return {
      error: payload.error ?? fallback.error,
      message: payload.message ?? fallback.message,
      statusCode: payload.statusCode ?? fallback.statusCode,
      fieldErrors: payload.fieldErrors ?? {}
    };
  } catch {
    return fallback;
  }
};

export default function AdultPortalPage() {
  const apiBase = useMemo(() => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000", []);
  const [adultId, setAdultId] = useState("mom-olivia");
  const [childId, setChildId] = useState("child-ava");
  const [displayName, setDisplayName] = useState("Ava");
  const [ageBand, setAgeBand] = useState<"5-7" | "8-10">("5-7");
  const [guidanceInput, setGuidanceInput] = useState("narration-on,parent-hints-on");
  const [status, setStatus] = useState("Ready for parent setup.");
  const [setupResult, setSetupResult] = useState<SetupResponse | null>(null);
  const [guidanceResult, setGuidanceResult] = useState<GuidanceResponse | null>(null);
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);

  const parseGuidance = (value: string): string[] =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const fieldErrors = apiError?.fieldErrors ?? {};
  const renderFieldErrors = (fieldName: string) =>
    fieldErrors[fieldName]?.map((message: string) => (
      <p className="field-error" key={`${fieldName}-${message}`}>
        {message}
      </p>
    ));

  const runSetup = async () => {
    setApiError(null);
    setStatus("Saving parent and child setup...");
    try {
      const response = await fetch(`${apiBase}/onboarding/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adultId,
          childId,
          displayName,
          ageBand,
          guidanceSettings: parseGuidance(guidanceInput)
        })
      });

      if (!response.ok) {
        const error = await readApiError(response);
        setApiError(error);
        setStatus(error.message);
        return;
      }

      const data = (await response.json()) as SetupResponse;
      setApiError(null);
      setSetupResult(data);
      setStatus("Setup saved. Child can now start mission 1 in the child app.");
    } catch {
      setStatus("Setup failed. Ensure platform-api is running on port 4000.");
    }
  };

  const updateGuidance = async () => {
    setApiError(null);
    setStatus("Updating guidance settings...");
    try {
      const response = await fetch(`${apiBase}/onboarding/${childId}/guidance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guidanceSettings: parseGuidance(guidanceInput) })
      });

      if (!response.ok) {
        const error = await readApiError(response);
        setApiError(error);
        setStatus(error.message);
        return;
      }

      const data = (await response.json()) as GuidanceResponse;
      setApiError(null);
      setGuidanceResult(data);
      setStatus("Guidance settings updated for the child profile.");
    } catch {
      setStatus("Guidance update failed. Ensure platform-api is running on port 4000.");
    }
  };

  return (
    <main>
      <section className="shell">
        <div className="panel">
          <p className="status">Version 1 shared adult portal</p>
          <h1>Guide first missions, review progress, and manage family sharing</h1>
          <p>
            Parent setup now connects to the API onboarding flow so the child app can hand off into
            mission progression.
          </p>
          <p className="status-text">{status}</p>
          {apiError && Object.keys(fieldErrors).length > 0 ? (
            <div aria-live="polite">
              <p className="status-text">Validation details</p>
              {(Object.entries(fieldErrors) as [string, string[]][]).map(([fieldName, messages]) => (
                <p className="field-error" key={fieldName}>
                  {fieldName}: {messages.join(", ")}
                </p>
              ))}
            </div>
          ) : null}
        </div>
        <div className="panel">
          <h2>Parent setup</h2>
          <div className="form-grid">
            <label>
              Adult ID
              <input value={adultId} onChange={(event) => setAdultId(event.target.value)} />
              {renderFieldErrors("adultId")}
            </label>
            <label>
              Child ID
              <input value={childId} onChange={(event) => setChildId(event.target.value)} />
              {renderFieldErrors("childId")}
            </label>
            <label>
              Child display name
              <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
              {renderFieldErrors("displayName")}
            </label>
            <label>
              Age band
              <select
                value={ageBand}
                onChange={(event) => setAgeBand(event.target.value as "5-7" | "8-10")}
              >
                <option value="5-7">5-7</option>
                <option value="8-10">8-10</option>
              </select>
              {renderFieldErrors("ageBand")}
            </label>
            <label className="full-row">
              Guidance settings (comma-separated)
              <input
                value={guidanceInput}
                onChange={(event) => setGuidanceInput(event.target.value)}
              />
              {renderFieldErrors("guidanceSettings")}
            </label>
          </div>
          <div className="actions">
            <button onClick={runSetup}>Save setup and handoff</button>
            <button className="secondary" onClick={updateGuidance}>
              Update guidance only
            </button>
          </div>
        </div>
        <div className="panel">
          <h2>Latest onboarding result</h2>
          <pre>{setupResult ? JSON.stringify(setupResult, null, 2) : "No setup submission yet."}</pre>
        </div>
        <div className="panel">
          <h2>Latest guidance update</h2>
          <pre>
            {guidanceResult ? JSON.stringify(guidanceResult, null, 2) : "No guidance update yet."}
          </pre>
        </div>
      </section>
    </main>
  );
}
