import { describe, expect, it } from "vitest";
import { buildWeeklyPlan, DAY_NAMES, summarise } from "./plan";

describe("buildWeeklyPlan", () => {
  it("schedules exactly as many run days as requested", () => {
    for (let daysPerWeek = 0; daysPerWeek <= 7; daysPerWeek++) {
      const plan = buildWeeklyPlan({ distanceKm: 5, daysPerWeek });
      expect(plan.runCount).toBe(daysPerWeek);
      expect(plan.days).toHaveLength(7);
    }
  });

  it("spreads run days evenly rather than bunching them at the start", () => {
    const plan = buildWeeklyPlan({ distanceKm: 5, daysPerWeek: 3 });
    const runDays = plan.days.filter((d) => d.isRunDay).map((d) => d.day);
    expect(runDays).toEqual(["Wed", "Fri", "Sun"]);
  });

  it("totals distance as run count times distance per run", () => {
    const plan = buildWeeklyPlan({ distanceKm: 8, daysPerWeek: 5 });
    expect(plan.runCount).toBe(5);
    expect(plan.totalDistanceKm).toBe(40);
  });

  it("has no runs and zero distance when zero days are chosen", () => {
    const plan = buildWeeklyPlan({ distanceKm: 5, daysPerWeek: 0 });
    expect(plan.runCount).toBe(0);
    expect(plan.totalDistanceKm).toBe(0);
    expect(plan.days.every((d) => !d.isRunDay)).toBe(true);
  });

  it("names every day of the week once", () => {
    const plan = buildWeeklyPlan({ distanceKm: 5, daysPerWeek: 4 });
    expect(plan.days.map((d) => d.day)).toEqual(DAY_NAMES);
  });
});

describe("summarise", () => {
  it("states run count, total distance and intensity", () => {
    const plan = buildWeeklyPlan({ distanceKm: 3, daysPerWeek: 4 });
    const text = summarise(plan, "moderate");
    expect(text).toContain("4 runs");
    expect(text).toContain("12 km");
    expect(text).toContain("moderate");
  });

  it("uses singular 'run' for a single run", () => {
    const plan = buildWeeklyPlan({ distanceKm: 3, daysPerWeek: 1 });
    expect(summarise(plan, "easy")).toContain("1 run ");
  });

  it("prompts for at least one day when none are chosen", () => {
    const plan = buildWeeklyPlan({ distanceKm: 3, daysPerWeek: 0 });
    expect(summarise(plan, "easy")).toMatch(/pick at least one day/i);
  });
});
