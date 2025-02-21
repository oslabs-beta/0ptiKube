interface SourceTypeSelectorProps {
  sourceType: 'cluster' | 'container';
  setSourceType: (type: 'cluster' | 'container') => void;
  setSelectedPod: (pod: string) => void;
}

const SourceTypeSelector = ({
  sourceType,
  setSourceType,
  setSelectedPod,
}: SourceTypeSelectorProps) => (
  <div className='flex h-full w-full items-center justify-center bg-[#0a192f] p-4'>
    <select
      className='h-10 w-40 rounded-md border border-cyan-400 bg-[#172a45] px-2 text-[#8892b0]'
      value={sourceType}
      onChange={(e) => {
        setSourceType(e.target.value as 'cluster' | 'container');
        if (e.target.value === 'cluster') setSelectedPod('');
      }}
    >
      <option value='cluster'>Cluster</option>
      <option value='container'>Container</option>
    </select>
  </div>
);

export default SourceTypeSelector;
