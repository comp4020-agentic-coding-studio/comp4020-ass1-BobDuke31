import { buildWeeklyPlan, summarise, type Intensity } from "./plan";

// The markup is ours (index.html ships alongside this script), so a missing
// element is a broken template, not a runtime input to handle gracefully.
function requireElement<T extends Element>(doc: Document, selector: string): T {
  const el = doc.querySelector<T>(selector);
  if (!el) throw new Error(`expected an element matching ${selector}`);
  return el;
}

// Wires the week-builder controls to the plan/summary output. Takes a
// Document so it can be pointed at a real page or a JSDOM one in tests.
export function initPlanBuilder(doc: Document): void {
  const distanceInput = requireElement<HTMLSelectElement>(doc, '[data-testid="distance-input"]');
  const daysInput = requireElement<HTMLSelectElement>(doc, '[data-testid="days-input"]');
  const intensityInput = requireElement<HTMLSelectElement>(doc, '[data-testid="intensity-input"]');
  const planList = requireElement<HTMLUListElement>(doc, '[data-testid="weekly-plan"]');
  const summaryEl = requireElement<HTMLElement>(doc, '[data-testid="summary"]');

  function render(): void {
    const distanceKm = Number(distanceInput.value);
    const daysPerWeek = Number(daysInput.value);
    const intensity = intensityInput.value as Intensity;

    const plan = buildWeeklyPlan({ distanceKm, daysPerWeek });

    planList.replaceChildren(
      ...plan.days.map((planDay) => {
        const item = doc.createElement("li");
        item.textContent = planDay.isRunDay ? `${planDay.day}: run ${distanceKm} km` : `${planDay.day}: rest`;
        return item;
      }),
    );

    summaryEl.textContent = summarise(plan, intensity);
  }

  for (const input of [distanceInput, daysInput, intensityInput]) {
    input.addEventListener("change", render);
  }

  render();
}
