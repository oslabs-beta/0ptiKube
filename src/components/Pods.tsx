interface PodProps {
<<<<<<< HEAD
    setSelectedPod: (pod: string) => void;
    podNames: string[];
    selectedPod: string;
  }
  
  const Pods = ({ setSelectedPod, podNames, selectedPod }: PodProps) => {
    return (
      <>
        <h1 className='mb-2 bg-gradient-to-r from-columbia_blue-300 to-columbia_blue-900 bg-clip-text text-center text-2xl font-semibold text-transparent'>
          Pods
        </h1>
        <div className='grid grid-cols-1 place-items-center gap-4'>
          {podNames.map((pod) => (
            <button
              key={pod}
              className={`text-md flex h-24 w-72 items-center justify-center rounded-xl bg-[#172a45] px-3 font-semibold text-[#8892b0] shadow-md transition-all hover:scale-105 hover:shadow-lg ${pod === selectedPod ? 'border border-cyan-400' : ''} `}
              onClick={() => setSelectedPod(pod)}
            >
              {pod}
            </button>
          ))}
        </div>
      </>
    );
  };
  
  export default Pods;
=======
  setSelectedPod: (pod: string) => void;
  podNames: string[];
  selectedPod: string;
}

const Pods = ({ setSelectedPod, podNames, selectedPod }: PodProps) => {
  return (
    <>
      <h1 className='mb-2 bg-gradient-to-r from-columbia_blue-300 to-columbia_blue-900 bg-clip-text text-center text-2xl font-semibold text-transparent'>
        Pods
      </h1>
      <div className='grid grid-cols-1 place-items-center gap-4'>
        {podNames.map((pod) => (
          <button
            key={pod}
            className={`text-md flex h-24 w-72 items-center justify-center rounded-xl bg-[#172a45] px-3 font-semibold text-[#8892b0] shadow-md transition-all hover:scale-105 hover:shadow-lg ${pod === selectedPod ? 'border border-cyan-400' : ''} `}
            onClick={() => setSelectedPod(pod)}
          >
            {pod}
          </button>
        ))}
      </div>
    </>
  );
};

export default Pods;
>>>>>>> dev
