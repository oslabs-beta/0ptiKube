'use client';

import {
  useState,
  useCallback,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import { useDebounce } from 'use-debounce';
import ReactMarkdown from 'react-markdown';

const querySuggestions = [
  'Optimize CPU usage',
  'Reduce memory consumption',
  'Analyze pod efficiency',
  'Detect unused containers',
  'Find high-latency services',
];

function AIQuery() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery && isTyping) {
      setShowSuggestions(true);
    }
  }, [debouncedQuery, isTyping]);

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
          err instanceof Error ? err.message : 'Failed to fetch response',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [query],
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsTyping(true);
  };

  const handleSelect = useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      setShowSuggestions(false);
      setIsTyping(false);
      handleQuery(suggestion);
    },
    [handleQuery],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleQuery(query);
    }
  };

  const filteredSuggestions = querySuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className='min-h-screen bg-navy_blue-100 p-4 text-white'>
      <div className='max-w-4xl mx-auto'>
        <nav className='py-4 mb-8'>
          <h1
            className='text-2xl font-semibold text-center'
            style={{ color: '#00ccff' }}
          >
            Kubernetes Optimization Assistant
          </h1>
        </nav>

        <div className='relative w-full'>
          <input
            type='text'
            value={query}
            onChange={handleInputChange}
            placeholder='Ask AI to optimize your cluster...'
            className='w-full p-3 border rounded-lg focus:outline-none text-black'
            style={{ borderColor: '#00ccff' }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
          />

          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul
              className='absolute left-0 right-0 mt-2 bg-white border rounded-lg z-10'
              style={{ borderColor: '#00ccff' }}
            >
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(suggestion)}
                  className='p-2 cursor-pointer text-black hover:bg-blue-100 transition rounded-md'
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={() => handleQuery(query)}
          disabled={isLoading}
          className='mt-6 mb-4 px-6 py-2 text-black font-semibold rounded-lg'
          style={{ backgroundColor: '#00ccff' }}
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
          <div
            className='mt-4 p-4 border rounded-lg'
            style={{ borderColor: '#ff0000', backgroundColor: '#ffebeb' }}
          >
            <p className='text-red-600'>{error}</p>
          </div>
        )}

        {response && (
          <div
            className='mt-4 p-6 border rounded-lg bg-opacity-10 text-white'
            style={{ borderColor: '#00ccff', backgroundColor: '#001f3f' }}
          >
            <ReactMarkdown
              className='prose max-w-none break-words'
              components={{
                code: ({ ...props }) => (
                  <code
                    {...props}
                    className='px-2 py-1 rounded border'
                    style={{
                      backgroundColor: '#002244',
                      borderColor: '#00ccff',
                      color: '#00ccff',
                    }}
                  />
                ),
                pre: ({ ...props }) => (
                  <pre
                    {...props}
                    className='p-4 rounded overflow-x-auto'
                    style={{ backgroundColor: '#001f3f' }}
                  />
                ),
                a: ({ ...props }) => (
                  <a
                    {...props}
                    className='hover:underline break-words'
                    style={{ color: '#00ccff' }}
                  />
                ),
              }}
            >
              {response}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIQuery;
