import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdultPortalPage from "./page";

describe("AdultPortalPage", () => {
  beforeEach(() => {
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
});
