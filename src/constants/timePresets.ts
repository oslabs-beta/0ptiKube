/**
 * Time Presets Configuration
 *
 * This file defines the timeframe preset options used throughout the application for selecting different time ranges when viewing CPU and memory performance metric historical views. Each preset defines:
 * 1. A timeframe (total duration to view)
 * 2. An interval (data granularity/step for fetching metrics)
 *
 * These presets power the TimePresetSelector dropdown component and control the time range displayed in the TimeGraph component for monitoring historical views of system resource consumption.
 *
 * @module timePresets
 */

/**
 * @interface TimePreset
 * @property {string} id - Unique identifier for the preset
 * @property {string} label - Human-readable name displayed in the UI
 * @property {Object} timeframe - The total time window to display
 * @property {number} timeframe.value - Numeric value of the timeframe
 * @property {('s' | 'm' | 'h' | 'd')} timeframe.unit - Unit for timeframe (seconds, minutes, hours, days)
 * @property {Object} interval - The data point collection interval/step
 * @property {number} interval.value - Numeric value of the interval
 * @property {('s' | 'm' | 'h')} interval.unit - Unit for interval (seconds, minuntes, hours)
 * @property {string} description - Text description of what this preset is useful for
 */
export interface TimePreset {
  id: string;
  label: string;
  timeframe: {
    value: number;
    unit: 's' | 'm' | 'h' | 'd'; // seconds, minutes, hours, days
  };
  interval: {
    value: number;
    unit: 's' | 'm' | 'h'; // seconds, minutes, hours
  };
  description?: string;
}

/**
 * Collection of predefined time presets for monitoring views
 *
 * Each preset defines a specific time window and data resolution combinaton optimized for different monitoring scenarios.
 *
 * Note: The 'last_15m' preset is currently disabled due to inconsistent CPU metric collection at 15s intervals.
 */
export const TIME_PRESETS: Record<string, TimePreset> = {
  // Temporarily disabled due to incosistent CPU metric collection at 15s intervals.
  // TODO: Revisit once rate calculation for CPU metrics is further optimized and/or real-time data monitoring is being used.
  // last_15m: {
  //   id: 'last_15m',
  //   label: 'Last 15 Minutes',
  //   timeframe: { value: 15, unit: 'm' },
  //   interval: { value: 15, unit: 's' },
  //   description: 'High resolution, short-term view',
  // },
  last_hour: {
    id: 'last_hour',
    label: 'Last Hour',
    timeframe: { value: 1, unit: 'h' },
    interval: { value: 30, unit: 's' },
    description: 'Default view',
  },
  last_12h: {
    id: 'last_12h',
    label: 'Last 12 Hours',
    timeframe: { value: 12, unit: 'h' },
    interval: { value: 5, unit: 'm' },
    description: 'Medium-term View',
  },
  last_day: {
    id: 'last_day',
    label: 'Last 24 Hours',
    timeframe: { value: 24, unit: 'h' },
    interval: { value: 10, unit: 'm' },
    description: 'Full Day Overview',
  },
  last_week: {
    id: 'last_week',
    label: 'Last 7 Days',
    timeframe: { value: 7, unit: 'd' },
    interval: { value: 1, unit: 'h' },
    description: 'Long-term Trends',
  },
};

// Default preset ID to use if none is specified
export const DEFAULT_PRESET_ID = 'last_hour';

// Helper function to conver timeframe/interval to milliseconds
export function convertToMs(
  value: number,
  unit: 's' | 'm' | 'h' | 'd',
): number {
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit];
}

// Helper function to convert preset to Prometheus-compatible step format
export function formatStep(preset: TimePreset): string {
  return `${preset.interval.value}${preset.interval.unit}`;
}

// Helper function to calculate start time based on preset
export function calculateStartTime(preset: TimePreset): Date {
  const now = new Date();
  const msAgo = convertToMs(preset.timeframe.value, preset.timeframe.unit);
  return new Date(now.getTime() - msAgo);
}
