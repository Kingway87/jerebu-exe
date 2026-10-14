/**
 * "The Loop": a simplified model of a recurring public-attention cycle.
 *
 * It is not a causal claim about any individual haze event. Fires have many
 * causes, and where smoke travels depends on weather. Establishing causes is
 * what the evidence work is for.
 */

export interface LoopStep {
  name: string;
  note: string;
}

export const loopSteps: readonly LoopStep[] = [
  { name: "Fires", note: "Land and vegetation burn, for many possible reasons." },
  { name: "Smoke", note: "Smoke rises and moves with the wind." },
  { name: "Haze", note: "Skies dim, sometimes across borders." },
  { name: "Public anger", note: "Questions and blame circulate. Answers are scattered." },
  { name: "Rain", note: "The weather changes and the sky clears." },
  { name: "Attention disappears", note: "The story fades. Most questions stay open." },
  { name: "Repeat", note: "The next season starts with the same questions." },
];
