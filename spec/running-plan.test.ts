import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { initPlanBuilder } from "../ui";

// Exercises the core interaction against the page's own markup (not the
// built bundle) so the test survives a change of build tool: choosing a
// distance, a frequency and an intensity must change what the visitor sees.
function renderPage() {
  const html = readFileSync(resolve("index.html"), "utf8");
  const dom = new JSDOM(html);
  initPlanBuilder(dom.window.document);
  return dom;
}

function choose(dom: JSDOM, testId: string, value: string) {
  const select = dom.window.document.querySelector<HTMLSelectElement>(`[data-testid="${testId}"]`);
  if (!select) throw new Error(`missing [data-testid="${testId}"]`);
  select.value = value;
  select.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
}

function planText(dom: JSDOM): string {
  return Array.from(dom.window.document.querySelectorAll('[data-testid="weekly-plan"] li'))
    .map((li) => li.textContent)
    .join(" | ");
}

function summaryText(dom: JSDOM): string {
  return dom.window.document.querySelector('[data-testid="summary"]')?.textContent ?? "";
}

describe("the week-builder interaction", () => {
  it("shows a plan and summary for the page's default choices", () => {
    const dom = renderPage();
    expect(planText(dom)).toContain("run 3 km");
    expect(summaryText(dom)).toContain("3 runs");
  });

  it("updates the plan and summary when the visitor changes distance, days or intensity", () => {
    const dom = renderPage();
    const before = { plan: planText(dom), summary: summaryText(dom) };

    choose(dom, "distance-input", "8");
    choose(dom, "days-input", "5");
    choose(dom, "intensity-input", "hard");

    const after = { plan: planText(dom), summary: summaryText(dom) };

    expect(after.plan).not.toBe(before.plan);
    expect(after.summary).not.toBe(before.summary);
    expect(after.plan).toContain("run 8 km");
    expect(after.summary).toContain("5 runs");
    expect(after.summary).toContain("40 km");
    expect(after.summary).toContain("hard");
  });

  it("schedules a rest day for every day not chosen to run", () => {
    const dom = renderPage();
    choose(dom, "days-input", "2");

    const items = Array.from(dom.window.document.querySelectorAll('[data-testid="weekly-plan"] li'));
    expect(items).toHaveLength(7);
    expect(items.filter((li) => li.textContent?.includes("rest"))).toHaveLength(5);
    expect(items.filter((li) => li.textContent?.includes("run"))).toHaveLength(2);
  });
});
