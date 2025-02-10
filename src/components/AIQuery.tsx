'use client';
import { useState } from 'react';

const querySuggestions = [
  'Optimize CPU usage',
  'Reduce memory consumption',
  'Analyze pod efficiency',
  'Detect unused containers',
  'Find high-latency services',
];

export default function AIQuery() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelect = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleQuery = () => {
    // Mock AI response (replace with actual API call)
    setResponse(`Optimized results for: "${query}"`);
  };

  return (
    <div className='flex flex-col items-center justify-start h-screen pt-20 bg-gray-100 p-4'>
      <h1 className='text-2xl font-semibold mb-8 text-center'>
        AI Optimization Query
      </h1>

      <div className='relative w-full max-w-md'>
        <input
          type='text'
          value={query}
          onChange={handleChange}
          placeholder='Ask AI to optimize your metrics...'
          className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          onMouseEnter={() => setShowSuggestions(true)}
          onMouseLeave={() => setShowSuggestions(false)}
        />

        {showSuggestions && (
          <ul
            className='absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg'
            onMouseEnter={() => setShowSuggestions(true)}
            onMouseLeave={() => setShowSuggestions(false)}
          >
            {querySuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelect(suggestion)}
                className='p-2 cursor-pointer hover:bg-gray-200'
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleQuery}
        className='mt-6 mb-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
      >
        Submit
      </button>

      {response && (
        <div className='mt-3 p-4 border rounded-lg bg-gray-50 w-full max-w-md'>
          <h2 className='text-lg font-medium'>AI Response:</h2>
          <p className='mt-2 text-gray-700'>{response}</p>
        </div>
      )}
    </div>
  );
}
