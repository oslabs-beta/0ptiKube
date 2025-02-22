import React from 'react';
import { TIME_PRESETS } from '@/constants/timePresets';

interface TimePresetSelectorProps {
  selectedPreset: string;
  onChange: (presetId: string) => void;
}

export default function TimePresetSelector({
  selectedPreset,
  onChange,
}: TimePresetSelectorProps) {
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
