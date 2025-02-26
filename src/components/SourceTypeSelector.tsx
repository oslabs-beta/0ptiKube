import { useState } from 'react';

interface SourceTypeSelectorProps {
  sourceType: 'cluster' | 'container';
  setSourceType: (type: 'cluster' | 'container') => void;
  setSelectedPod: (pod: string) => void;
}

export default function SourceTypeSelector({
  sourceType,
  setSourceType,
  setSelectedPod,
}: SourceTypeSelectorProps) {
  function handleSelectCluster() {
    setSourceType('cluster');
    setSelectedPod(''); // Clear pod when switching to cluster
  }

  function handleSelectContainer() {
    setSourceType('container');
  }

  const [isOpen, setIsOpen] = useState(false);

  const handlePress = () => {
    setIsOpen((prev) => !prev);
  };

  const clusterClosed = `
    motion-safe:animate-out
    motion-scale-out-[0.5]
    motion-translate-y-out-[30%]
    motion-opacity-out-[0%]
    motion-ease-spring-bouncier
    motion-duration-[0.5s]
    motion-delay-[0.5s]
    pointer-events-none
  `;

  const clusterOpen = `
    motion-safe:animate-in
    motion-scale-in-[0.5]
    motion-translate-y-in-[30%]
    motion-opacity-in-[0%]
    motion-ease-spring-bouncier
    motion-duration-[0.5s]
    motion-delay-[0.250s]
  `;

  const podClosed = `
    motion-safe:animate-out
    motion-scale-out-[0.5]
    motion-translate-y-out-[30%]
    motion-opacity-out-[0%]
    motion-ease-spring-bouncier
    motion-duration-[0.5s]
    motion-delay-[0.250s]
    pointer-events-none
  `;

  const podOpen = `
    motion-safe:animate-in
    motion-scale-in-[0.5]
    motion-translate-y-in-[30%]
    motion-opacity-in-[0%]
    motion-ease-spring-bouncier
    motion-duration-[0.5s]
    motion-delay-[0.125s]
  `;

  return (
    <div className="fixed bottom-8 right-8">
      {/* CLUSTER BUTTON */}
      <button
        onClick={handleSelectCluster}
        className={`
          absolute
          bg-[#112240]
          rounded-full
          flex items-center
          overflow-hidden
          h-[60px]
          w-[200px]
          right-0
          bottom-[170px]
          cursor-pointer
          shadow-md

          ease-in-out
          duration-300
          hover:scale-105

          ${isOpen ? clusterOpen : clusterClosed}

          ${
            sourceType === 'cluster'
              ? 'bg-bright_blue-400 font-extrabold text-white'
              : 'text-gray-500 hover:bg-bright_blue-500'
           }
        `}
      >
        <div className="w-[60px] h-[60px] flex justify-center items-center">
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='icon icon-tabler icons-tabler-outline icon-tabler-chart-cohort'
          >
            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
            <path d='M3 9h18v-6h-18v18h6v-18' />
            <path d='M3 15h12v-12' />
          </svg>
        </div>
        <span className="text-white text-[18px] whitespace-nowrap">
          Cluster View
        </span>
      </button>

      {/* POD BUTTON */}
      <button
        onClick={handleSelectContainer}
        className={`
          absolute
          bg-[#112240]
          rounded-full
          flex items-center
          overflow-hidden
          h-[60px]
          w-[200px]
          right-0
          bottom-[90px]
          cursor-pointer
          shadow-md

          ease-in-out
          duration-300
          hover:scale-105

          ${isOpen ? podOpen : podClosed}

          ${
            sourceType === 'container'
              ? 'bg-bright_blue-400 font-extrabold text-white'
              : 'text-gray-500 hover:bg-bright_blue-500'
           }
        `}
      >
        <div className="w-[60px] h-[60px] flex justify-center items-center">
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='icon icon-tabler icons-tabler-outline icon-tabler-cube'
          >
            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
            <path
              d='M21 16.008v-8.018a1.98 1.98 0 0 0 -1 -1.717l-7 -4.008a2.016 2.016 0 0 0
               -2 0l-7 4.008c-.619 .355 -1 1.01 -1 1.718v8.018c0 .709 .381 1.363 1 1.717l7
               4.008a2.016 2.016 0 0 0 2 0l7 -4.008c.619 -.355 1 -1.01 1 -1.718z'
            />
            <path d='M12 22v-10' />
            <path d='M12 12l8.73 -5.04' />
            <path d='M3.27 6.96l8.73 5.04' />
          </svg>
        </div>
        <span className="text-white text-[18px] whitespace-nowrap">
          Pod View
        </span>
      </button>

      {/* PLUS BUTTON */}
      <button
        onClick={handlePress}
        className={`
          absolute
          bg-[#182648]
          rounded-full
          w-[60px]
          h-[60px]
          flex
          items-center
          justify-center
          right-0
          bottom-0
          transition-transform
          duration-500
          ${isOpen ? 'rotate-45' : 'rotate-0'}
        `}
      >
        <svg width='60' height='60' aria-hidden='true' viewBox='0 0 50 50' fill='#8691af'>
          <path d='M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C
           37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C
           36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46
           4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26
           L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z' />
        </svg>
      </button>
    </div>
  );
}
