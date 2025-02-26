/**
 * TimePresetSelector Component
 *
 * Renders a dropdown menu that allows users to select different timeframes for viewing in the TimeGraph component.
 *
 * @component
 */
import React, { JSX } from 'react';
import { TIME_PRESETS } from '@/constants/timePresets';

/**
 * Props interface for the TimePresetSelector component
 *
 * @interface TimePresetSelectorProps
 * @property {string} selectedPreset - The currently selected time preset identifier
 * @property {function} onChange - Callback function triggered when a new preset is selected
 */
interface TimePresetSelectorProps {
  selectedPreset: string;
  onChange: (presetId: string) => void;
}
/**
 * The component maps through the TIME_PRESETS object to create option elements for each available time preset
 * 1. 'last_hour' - 'Last Hour' (default view)
 * 2. 'last_12h' - 'Last 12 Hours'
 * 3. 'last_day' - 'Last 24 Hours'
 * 4. 'last_week' - 'Last 7 Days'
 *
 * @param {TimePresetSelectorProps} props - Component props containing selectedPreset and onChange
 * @returns {JSX.Element} A select dropdown menu with timeframe preset options
 */
export default function TimePresetSelector({
  selectedPreset,
  onChange,
}: TimePresetSelectorProps): JSX.Element {
  return (
    <div className='flex w-full items-center justify-center bg-[#0a192f] p-4'>
      <select
        value={selectedPreset}
        onChange={(e) => onChange(e.target.value)}
        className='h-10 w-40 rounded-md border border-cyan-400 bg-[#172a45] px-2 text-[#8892b0]'
      >
        {Object.values(TIME_PRESETS).map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  );
}
