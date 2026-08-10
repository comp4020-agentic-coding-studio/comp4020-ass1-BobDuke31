// Pure logic for the week-builder interaction: no DOM, so it's cheap to test
// directly and to reuse if the UI layer changes.

export type Intensity = "easy" | "moderate" | "hard";

export interface PlanInputs {
  distanceKm: number;
  daysPerWeek: number;
}

export interface PlanDay {
  day: string;
  isRunDay: boolean;
}

export interface WeeklyPlan {
  days: PlanDay[];
  totalDistanceKm: number;
  runCount: number;
}

export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const INTENSITY_LABEL: Record<Intensity, string> = {
  easy: "easy",
  moderate: "moderate",
  hard: "hard",
};

// Spreads `daysPerWeek` run days as evenly as possible across the 7-day week,
// e.g. 3 days lands on Wed/Fri/Sun rather than piling up at the front.
export function buildWeeklyPlan({ distanceKm, daysPerWeek }: PlanInputs): WeeklyPlan {
  const days: PlanDay[] = DAY_NAMES.map((day, i) => {
    const before = Math.floor((i * daysPerWeek) / 7);
    const after = Math.floor(((i + 1) * daysPerWeek) / 7);
    return { day, isRunDay: after > before };
  });

  const runCount = days.filter((d) => d.isRunDay).length;

  return {
    days,
    totalDistanceKm: runCount * distanceKm,
    runCount,
  };
}

export function summarise(plan: WeeklyPlan, intensity: Intensity): string {
  if (plan.runCount === 0) {
    return "No runs scheduled yet — pick at least one day to build your week.";
  }
  const runWord = plan.runCount === 1 ? "run" : "runs";
  return (
    `${plan.runCount} ${runWord} this week, ${plan.totalDistanceKm} km total, at ` +
    `${INTENSITY_LABEL[intensity]} intensity. Even "just going for a run" already ` +
    `means choosing a distance, a frequency and a pace.`
  );
}
