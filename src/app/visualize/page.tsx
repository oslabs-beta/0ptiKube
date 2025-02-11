import TimeGraph from '@/components/TimeGraph';

export default function VisualizePage() {
  return (
    <div>
      <div className='flex flex-col items-center justify-center min-h-screen p-10 bg-navy_blue-100'>
        <h1 className='text-3xl font-bold text-columbia_blue-900'>
          Visualization Dashboard
        </h1>
        <TimeGraph />
      </div>
    </div>
  );
}
