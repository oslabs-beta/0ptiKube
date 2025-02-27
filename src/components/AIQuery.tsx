/*import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import ReactMarkdown from 'react-markdown';
import { useDebounce } from 'use-debounce';

const querySuggestions = [
  'How can I optimize CPU usage for my Kubernetes workloads?',
  'What strategies can help reduce memory consumption in my cluster?',
  'What are some best practices for improving pod efficiency?',
  'How can I identify and remove unused containers?',
  'What steps can I take to troubleshoot high-latency services?',
];

const AIQuery = () => {
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
      <div className='mx-auto max-w-4xl'>
        <nav className='mb-8 py-4'>
          <h1
            className='text-center text-2xl font-semibold'
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
            placeholder='Ask our AI to assist in optimizing your cluster...'
            className='w-full rounded-lg border bg-[#A1B3D1] p-3 text-black placeholder-gray-900 focus:border-[#00ccff] focus:outline-none focus:ring-[#00ccff]'
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
          />

          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul
              className='absolute left-0 right-0 z-10 mt-2 rounded-lg border bg-white'
              style={{ borderColor: '#00ccff' }}
            >
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(suggestion)}
                  className='cursor-pointer rounded-md p-2 text-black transition hover:bg-blue-100'
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
          className='mb-4 mt-6 flex items-center justify-center rounded-lg px-6 py-2 font-semibold text-black'
          style={{ backgroundColor: '#00ccff' }}
        >
          {isLoading ? (
            <>
              <span className='mr-2 animate-spin'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              </span>
              Analyzing...
            </>
          ) : (
            'Optimize Cluster'
          )}
        </button>

        {error && (
          <div
            className='mt-4 rounded-lg border p-4'
            style={{ borderColor: '#ff0000', backgroundColor: '#ffebeb' }}
          >
            <p className='text-red-600'>{error}</p>
          </div>
        )}

        {response && (
          <div
            className='mt-4 rounded-lg border bg-opacity-10 p-6 text-white'
            style={{ borderColor: '#00ccff', backgroundColor: '#001f3f' }}
          >
            <ReactMarkdown
              className='prose max-w-none break-words'
              components={{
                code: ({ ...props }) => (
                  <code
                    {...props}
                    className='rounded border px-2 py-1'
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
                    className='overflow-x-auto rounded p-4'
                    style={{ backgroundColor: '#001f3f' }}
                  />
                ),
                a: ({ ...props }) => (
                  <a
                    {...props}
                    className='break-words hover:underline'
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
};

export default AIQuery;
*/

import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import ReactMarkdown from 'react-markdown';
import { useDebounce } from 'use-debounce';

const querySuggestions = [
  'Optimize CPU usage',
  'Reduce memory consumption',
  'Analyze pod efficiency',
  'Detect unused containers',
  'Find high-latency services',
];

const AIQuery = () => {
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
      <div className='mx-auto max-w-4xl'>
        <nav className='mb-8 py-4'>
          <h1
            className='text-center text-2xl font-semibold'
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
            className='w-full rounded-lg border bg-[#A1B3D1] p-3 text-black placeholder-gray-900 focus:border-[#00ccff] focus:outline-none focus:ring-[#00ccff]'
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
          />

          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul
              className='absolute left-0 right-0 z-10 mt-2 rounded-lg border'
              style={{
                backgroundColor: '#A1B3D1', // Same as input background
                borderColor: '#00ccff',
              }}
            >
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(suggestion)}
                  className='cursor-pointer rounded-md p-2 text-black transition hover:bg-blue-100'
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
          className='mb-4 mt-6 flex items-center justify-center rounded-lg px-6 py-2 font-semibold text-black'
          style={{ backgroundColor: '#00ccff' }}
        >
          {isLoading ? (
            <>
              <span className='mr-2 animate-spin'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 2v4M12 18v4M18 12h4M2 12h4M4.22 4.22l2.83 2.83M16.97 16.97l2.83 2.83M4.22 19.78l2.83-2.83M16.97 7.03l2.83-2.83'
                  />
                </svg>
              </span>
              Analyzing...
            </>
          ) : (
            'Optimize Cluster'
          )}
        </button>

        {error && (
          <div
            className='mt-4 rounded-lg border p-4'
            style={{ borderColor: '#ff0000', backgroundColor: '#ffebeb' }}
          >
            <p className='text-red-600'>{error}</p>
          </div>
        )}

        {response && (
          <div
            className='mt-4 rounded-lg border bg-opacity-10 p-6 text-white'
            style={{ borderColor: '#00ccff', backgroundColor: '#001f3f' }}
          >
            <ReactMarkdown
              className='prose max-w-none break-words'
              components={{
                code: ({ ...props }) => (
                  <code
                    {...props}
                    className='rounded border px-2 py-1'
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
                    className='overflow-x-auto rounded p-4'
                    style={{ backgroundColor: '#001f3f' }}
                  />
                ),
                a: ({ ...props }) => (
                  <a
                    {...props}
                    className='break-words hover:underline'
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
};

export default AIQuery;
