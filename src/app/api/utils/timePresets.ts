/**
 * Import necessary constants from the shared constants file
 */
import {
  TIME_PRESETS,
  DEFAULT_PRESET_ID,
  formatStep,
  calculateStartTime,
} from '@/constants/timePresets';

/**
 * Define an interface representing the parameters needed for time-based queries.
 * This standardizes the format for all route handlers.
 */
interface TimeRangeParams {
  start: Date; // When to begin fetching metrics
  end: Date; // When to stop fetching metrics (now)
  step: string; // Interval between data points in Prometheus format
}

/**
 * Converts a preset ID into concrete time parameters.
 *
 * @param presetId - The ID of the time preset to use (e.g., 'last_hour')
 * @returns An object with start time, end time, and step interval
 *
 * Logic:
 * 1. Check if the provided presetId exists in our presets
 * 2. If it exists, use that preset; otherwise fall back to the default
 * 3. Calculate the appropriate start time based on preset's timeframe
 * 4. Set end time to current time
 * 5. Format the step interval in Prometheus-compatible format
 */
export function getTimeRangeFromPreset(
  presetId?: string | null,
): TimeRangeParams {
  const preset =
    presetId && TIME_PRESETS[presetId]
      ? TIME_PRESETS[presetId]
      : TIME_PRESETS[DEFAULT_PRESET_ID];

  return {
    start: calculateStartTime(preset),
    end: new Date(),
    step: formatStep(preset),
  };
}
