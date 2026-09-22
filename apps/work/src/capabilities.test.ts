import { describe, expect, it } from "vitest";
import { getModeCapabilities } from "./capabilities";

describe("Work / Client capability boundary", () => {
  it("allows authoring only in Work mode entered from Work", () => {
    expect(getModeCapabilities("work", "work").canAuthorProject).toBe(true);
    expect(getModeCapabilities("client", "work").canAuthorProject).toBe(false);
    expect(getModeCapabilities("client", "direct-client").canAuthorProject).toBe(false);
    expect(getModeCapabilities("work", "direct-client").canAuthorProject).toBe(false);
  });

  it("lets Work preview return to Work but keeps direct client entry isolated", () => {
    expect(getModeCapabilities("client", "work").canReturnToWork).toBe(true);
    expect(getModeCapabilities("client", "direct-client").canReturnToWork).toBe(false);
  });

  it("keeps viewer inspection available in both modes", () => {
    expect(getModeCapabilities("work", "work").canInspectViewer).toBe(true);
    expect(getModeCapabilities("client", "direct-client").canInspectViewer).toBe(true);
  });
});
