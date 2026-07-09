/**
 * Analytics engine — barrel export.
 *
 * All functions are pure, framework-independent, and operate on
 * GitVerse domain models. They can be used anywhere: API routes,
 * server-side props, or future worker processes.
 */

export { calculateStreaks } from "./streaks";
export {
  calculateWeeklyAverage,
  calculateMonthlyTotals,
  calculateYearlyTotals,
  calculateIntensityDistribution,
  calculateCommitFrequency,
  findMostActiveDay,
  findMostActiveHour,
  calculateContributionTotals,
} from "./totals";
export {
  calculateRepositoryRankings,
  calculateTotalStars,
  calculateTotalForks,
} from "./rankings";
export { calculateActivityScore } from "./activity-score";

export type { ActivityScore } from "./activity-score";
