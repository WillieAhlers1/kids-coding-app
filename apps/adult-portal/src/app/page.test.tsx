import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdultPortalPage from "./page";

describe("AdultPortalPage", () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("submits setup and shows API response", async () => {
    const setupResponse = {
      childProfile: {
        childId: "child-ava",
        displayName: "Ava",
        ageBand: "5-7",
        guidanceSettings: ["narration-on"],
        progressSnapshot: "onboarding-complete"
      },
      adultAccount: {
        adultId: "mom-olivia",
        linkedChildren: ["child-ava"],
        consentState: "granted"
      },
      emittedEvents: ["ChildProfileCreated"]
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => setupResponse
      })
    );

    render(<AdultPortalPage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Save setup and handoff" }));

    expect(await screen.findByText(/setup saved/i)).toBeTruthy();
    expect(screen.getByText(/childprofilecreated/i)).toBeTruthy();
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
            displayName: ["Display name is required."],
            guidanceSettings: ["Select at least one guidance setting."]
          }
        })
      })
    );

    render(<AdultPortalPage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Save setup and handoff" }));

    expect(await screen.findByText(/request validation failed/i)).toBeTruthy();
    expect(screen.getAllByText(/display name is required/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/select at least one guidance setting/i).length).toBeGreaterThan(0);
  });
});
