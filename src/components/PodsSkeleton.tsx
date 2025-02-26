const PodsSkeleton = () => (
  <>
    <h1 className='animate-pulse-slow mb-2 bg-gradient-to-r from-columbia_blue-300 to-columbia_blue-900 bg-clip-text text-center text-2xl font-semibold text-transparent'>
      Pods
    </h1>
    <div className='grid grid-cols-1 place-items-center gap-4'>
      {[...Array(14)].map((_, i) => (
        <div
          key={i}
          className='flex h-24 w-72 animate-pulse items-center justify-center rounded-xl bg-[#172a45] opacity-40'
        >
          <div className='h-4 w-32 rounded bg-[#8892b0] opacity-30'></div>
        </div>
      ))}
    </div>
  </>
);

export default PodsSkeleton;
