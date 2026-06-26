import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "./page";

describe("Child HomePage", () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("records mission completion and shows emitted events", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          progress: {
            childId: "child-ava",
            worldId: "world-pixel-park",
            completedMissions: ["mission-1"],
            unlockedFeatures: [],
            lastSessionState: "mission-complete"
          },
          emittedEvents: ["MissionCompleted"]
        })
      });

    vi.stubGlobal("fetch", fetchMock);

    render(<HomePage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Complete mission 1" }));

    expect(await screen.findByText(/mission-1 saved with updated progress/i)).toBeTruthy();
    expect(screen.getByText(/missioncompleted/i)).toBeTruthy();
  });

  it("shows field-level validation errors from the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: "ValidationError",
          message: "Request validation failed.",
          statusCode: 400,
          fieldErrors: {
            childId: ["Child ID is required."]
          }
        })
      })
    );

    render(<HomePage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Load onboarding profile" }));

    expect(await screen.findByText(/request validation failed/i)).toBeTruthy();
    expect(screen.getAllByText(/child id is required/i).length).toBeGreaterThan(0);
  });
});
