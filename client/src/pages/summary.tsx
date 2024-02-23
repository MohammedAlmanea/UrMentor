import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Markdown from 'react-markdown';

interface Summary {
  content: string;
  id: string;
  audioURL?: string;
}

const SummaryComponent: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5600/api/summary/${resourceId}`,
        {
          credentials: 'include',
          method: 'GET',
        }
      );
      const data: Summary = await response.json();
      setSummary(data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch summary');
      setIsLoading(false);
    }
  }, [resourceId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleTTSClick = async () => {
    try {
      await fetch(`http://localhost:5600/api/tts/${summary?.id}`, {
        credentials: 'include',
        method: 'GET',
      });
      fetchSummary(); 
    } catch (err) {
      setError('Failed to process TTS');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      {summary && (
        <>
          <div className="mb-4 prose">
            <Markdown>{summary.content}</Markdown>
          </div>
          {summary.audioURL ? (
            <audio controls src={summary.audioURL} className="w-full"></audio>
          ) : (
            <button
              onClick={handleTTSClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              TTS
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default SummaryComponent;
