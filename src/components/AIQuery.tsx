'use client';
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import ReactMarkdown from 'react-markdown';

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
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery] = useDebounce(query, 300);

  // Auto-show suggestions when typing
  useEffect(() => {
    if (debouncedQuery) {
      setShowSuggestions(true);
    }
  }, [debouncedQuery]);

  const handleSelect = useCallback((suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleQuery(suggestion); // Auto-submit on selection
  }, []);

  const handleQuery = useCallback(
    async (q?: string) => {
      const finalQuery = q || query;
      if (!finalQuery.trim()) return;

      setIsLoading(true);
      setError('');
      setResponse('');

      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: finalQuery }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        setResponse(data.response);
      } catch (err) {
        console.error('Error querying AI:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch response'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [query]
  );

  const filteredSuggestions = querySuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-2xl font-semibold mb-8 text-center'>
          Kubernetes Optimization Assistant
        </h1>

        <div className='relative w-full'>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Ask AI to optimize your cluster...'
            className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            onFocus={() => setShowSuggestions(true)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
          />

          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className='absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10'>
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(suggestion)}
                  className='p-2 cursor-pointer hover:bg-blue-50 transition-colors'
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={() => handleQuery()}
          disabled={isLoading}
          className='mt-6 mb-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2'
        >
          {isLoading ? (
            <>
              <span className='animate-spin'>🌀</span>
              Analyzing...
            </>
          ) : (
            'Optimize Cluster'
          )}
        </button>

        {error && (
          <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-red-600'>{error}</p>
          </div>
        )}

        {response && (
          <div className='mt-4 p-6 border rounded-lg bg-white shadow-sm'>
            <ReactMarkdown className='prose max-w-none'>
              {response}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

/*'use client';
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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelect = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleQuery = async () => {
    if (!query) return;

    setIsLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error querying AI:', error);
      setResponse('An error occurred while fetching the response.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-2xl font-semibold mb-8 text-center'>
          AI Optimization Query
        </h1>

        <div className='relative w-full'>
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
          disabled={isLoading}
          className='mt-6 mb-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed'
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>

        {response && (
          <div className='mt-3 p-4 border rounded-lg bg-gray-50'>
            <h2 className='text-lg font-medium'>AI Response:</h2>
            <p className='mt-2 text-gray-700'>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
*/
