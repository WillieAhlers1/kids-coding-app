"use client";

import React from "react";
import { useMemo, useState } from "react";

type ChildProfileResponse = {
  childProfile: {
    childId: string;
    displayName: string;
    ageBand: "5-7" | "8-10";
    guidanceSettings: string[];
    progressSnapshot: string;
  } | null;
};

type ProgressResponse = {
  progress: {
    childId: string;
    worldId: string;
    completedMissions: string[];
    unlockedFeatures: string[];
    lastSessionState: string;
  };
  emittedEvents?: string[];
};

export default function HomePage() {
  const apiBase = useMemo(() => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000", []);
  const [childId, setChildId] = useState("child-ava");
  const [status, setStatus] = useState("Ready for onboarding handoff.");
  const [childProfile, setChildProfile] = useState<ChildProfileResponse["childProfile"]>(null);
  const [progress, setProgress] = useState<ProgressResponse["progress"] | null>(null);
  const [emittedEvents, setEmittedEvents] = useState<string[]>([]);

  const loadChildProfile = async () => {
    setStatus("Loading child onboarding profile...");
    try {
      const response = await fetch(`${apiBase}/onboarding/${childId}`);
      if (!response.ok) {
        setStatus(`Profile lookup failed with status ${response.status}.`);
        return;
      }

      const data = (await response.json()) as ChildProfileResponse;
      setChildProfile(data.childProfile);
      setStatus(data.childProfile ? "Onboarding profile loaded." : "No profile yet. Ask parent to run setup.");
    } catch {
      setStatus("Profile lookup failed. Ensure platform-api is running on port 4000.");
    }
  };

  const loadProgress = async () => {
    setStatus("Loading mission progress...");
    try {
      const response = await fetch(`${apiBase}/progress/${childId}/world-pixel-park`);
      if (!response.ok) {
        setStatus(`Progress lookup failed with status ${response.status}.`);
        return;
      }

      const data = (await response.json()) as ProgressResponse;
      setProgress(data.progress);
      setStatus("Progress loaded.");
    } catch {
      setStatus("Progress lookup failed. Ensure platform-api is running on port 4000.");
    }
  };

  const completeMission = async (missionId: string, unlockSandbox = false) => {
    setStatus(`Completing ${missionId}...`);
    try {
      const response = await fetch(`${apiBase}/progress/${childId}/world-pixel-park/mission-complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId, unlockSandbox })
      });

      if (!response.ok) {
        setStatus(`Mission update failed with status ${response.status}.`);
        return;
      }

      const data = (await response.json()) as ProgressResponse;
      setProgress(data.progress);
      setEmittedEvents(data.emittedEvents ?? []);
      setStatus(`${missionId} saved with updated progress.`);
    } catch {
      setStatus("Mission update failed. Ensure platform-api is running on port 4000.");
    }
  };

  return (
    <main>
      <section className="hero">
        <div className="card">
          <span className="pill">Pixel Park Adventure</span>
          <h1>Family-first coding adventures for curious 7-year-olds</h1>
          <p>
            The child flow now reads onboarding handoff from the API and records mission completion.
          </p>
          <p className="status">{status}</p>
          <div className="controls">
            <input value={childId} onChange={(event) => setChildId(event.target.value)} />
            <button onClick={loadChildProfile}>Load onboarding profile</button>
            <button onClick={loadProgress}>Load progress</button>
          </div>
        </div>
        <div className="grid">
          <article className="card">
            <h2>Mission Path</h2>
            <p>Short guided coding missions with quick animation feedback.</p>
            <div className="mission-actions">
              <button onClick={() => completeMission("mission-1")}>Complete mission 1</button>
              <button onClick={() => completeMission("mission-2")}>Complete mission 2</button>
              <button onClick={() => completeMission("mission-3", true)}>Complete mission 3</button>
            </div>
          </article>
          <article className="card">
            <h2>Onboarding handoff</h2>
            <pre>{childProfile ? JSON.stringify(childProfile, null, 2) : "No child profile loaded."}</pre>
          </article>
          <article className="card">
            <h2>Progress and unlocks</h2>
            <pre>{progress ? JSON.stringify(progress, null, 2) : "No progress loaded."}</pre>
            <p className="events">Events: {emittedEvents.length > 0 ? emittedEvents.join(", ") : "none"}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
