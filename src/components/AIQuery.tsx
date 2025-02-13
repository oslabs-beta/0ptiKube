/*'use client';
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
*/
/*'use client';
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

  useEffect(() => {
    if (debouncedQuery) {
      setShowSuggestions(true);
    }
  }, [debouncedQuery]);

  const handleSelect = useCallback((suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleQuery(suggestion);
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
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Ask AI to optimize your cluster...'
            className='w-full p-3 border rounded-lg focus:outline-none text-black'
            style={{ borderColor: '#00ccff' }}
            onFocus={() => setShowSuggestions(true)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
          />

          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul
              className='absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg text-black'
              style={{ borderColor: '#00ccff' }}
            >
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(suggestion)}
                  className='p-2 cursor-pointer hover:bg-gray-200 transition'
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
                code: ({ node, ...props }) => (
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
                pre: ({ node, ...props }) => (
                  <pre
                    {...props}
                    className='p-4 rounded overflow-x-auto'
                    style={{ backgroundColor: '#001f3f' }}
                  />
                ),
                a: ({ node, ...props }) => (
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
*/
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

  useEffect(() => {
    if (debouncedQuery) {
      setShowSuggestions(true);
    }
  }, [debouncedQuery]);

  const handleSelect = useCallback((suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleQuery(suggestion);
  }, []);

  const handleQuery = useCallback(
    async (q) => {
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
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Ask AI to optimize your cluster...'
            className='w-full p-3 border rounded-lg focus:outline-none text-black'
            style={{ borderColor: '#00ccff' }}
            onFocus={() => setShowSuggestions(true)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
          />

          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul
              className='absolute left-0 right-0 mt-2 bg-white border rounded-lg z-10'
              style={{ borderColor: '#00ccff' }}
            >
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    handleSelect(suggestion);
                  }}
                  className='p-2 cursor-pointer text-black hover:bg-blue-100 transition rounded-md'
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
                code: ({ node, ...props }) => (
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
                pre: ({ node, ...props }) => (
                  <pre
                    {...props}
                    className='p-4 rounded overflow-x-auto'
                    style={{ backgroundColor: '#001f3f' }}
                  />
                ),
                a: ({ node, ...props }) => (
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
