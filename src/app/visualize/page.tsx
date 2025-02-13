'use client';
import { useEffect, useState } from 'react';
import Gauge from '@/components/Gauge';
import TimeGraph from '@/components/TimeGraph';
import './page.css';

export default function VisualizePage() {
  const [memoryData, setMemoryData] = useState(null);
  const [cpuData, setCpuData] = useState(null);

  useEffect(() => {
    // Fetch memory metrics
    fetch('http://localhost:3000/api/metrics/cluster/memory/percent')
      .then((res) => res.json())
      .then((jsonData) => setMemoryData(jsonData))
      .catch((err) => console.error('Memory fetch error:', err));

    // Fetch CPU metrics
    fetch('http://localhost:3000/api/metrics/cluster/cpu/percent')
      .then((res) => res.json())
      .then((jsonData) => setCpuData(jsonData))
      .catch((err) => console.error('CPU fetch error:', err));
  }, []);

  if (!memoryData || !cpuData) {
    return <div>Loading...</div>;
  }

  const memoryPercent = memoryData.result?.[0]?.value?.value || 0;
  const cpuPercent = cpuData.result?.[0]?.value?.value || 0;

  return (
    <>
      <div className='container min-w-screen min-h-screen w-full h-full bg-[#0a192f]'>
        <div className='time-graph bg-[#112240] p-4 rounded-lg shadow-lg'>
          <TimeGraph />
        </div>
        <div className='gauge bg-[#112240] flex justify-around items-center p-6 my-4 rounded-lg shadow-lg'>
          <Gauge value={memoryPercent} name='Memory' />
          <Gauge value={cpuPercent} name='CPU' />
        </div>
        <div className='pods bg-[#112240] p-6 rounded-lg shadow-lg'>
          <div className='grid grid-cols-1 gap-4 place-items-center'>
            <div className='h-24 w-72 rounded-xl bg-[#172a45] shadow-md transition-all hover:shadow-lg hover:scale-105 flex items-center justify-center text-[#8892b0]'>
              Pod 1
            </div>
            <div className='h-24 w-72 rounded-xl bg-[#172a45] shadow-md transition-all hover:shadow-lg hover:scale-105 flex items-center justify-center text-[#8892b0]'>
              Pod 2
            </div>
            <div className='h-24 w-72 rounded-xl bg-[#172a45] shadow-md transition-all hover:shadow-lg hover:scale-105 flex items-center justify-center text-[#8892b0]'>
              Pod 3
            </div>
            <div className='h-24 w-72 rounded-xl bg-[#172a45] shadow-md transition-all hover:shadow-lg hover:scale-105 flex items-center justify-center text-[#8892b0]'>
              Pod 4
            </div>
            <div className='h-24 w-72 rounded-xl bg-[#172a45] shadow-md transition-all hover:shadow-lg hover:scale-105 flex items-center justify-center text-[#8892b0]'>
              Pod 5
            </div>
            <div className='h-24 w-72 rounded-xl bg-[#172a45] shadow-md transition-all hover:shadow-lg hover:scale-105 flex items-center justify-center text-[#8892b0]'>
              Pod 6
            </div>
            <div className='h-24 w-72 rounded-xl bg-[#172a45] shadow-md transition-all hover:shadow-lg hover:scale-105 flex items-center justify-center text-[#8892b0]'>
              Pod 7
            </div>
            <div className='h-24 w-72 rounded-xl bg-[#172a45] shadow-md transition-all hover:shadow-lg hover:scale-105 flex items-center justify-center text-[#8892b0]'>
              Pod 8
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
