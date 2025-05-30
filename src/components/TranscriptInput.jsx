import { useState } from 'react';
import { parseTranscriptWithAI } from '../utils/parseFromAI';

const TranscriptInput = ({ onTasksParsed }) => {
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleParse = async () => {
    if (!transcript.trim()) {
      setError('Please enter a transcript to parse');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const parsedTasks = await parseTranscriptWithAI(transcript);
      onTasksParsed(parsedTasks);
      setTranscript('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">AI Transcript Parser</h2>
      <div className="space-y-4">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript here..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        <button
          onClick={handleParse}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Parsing...' : 'Parse with AI'}
        </button>
      </div>
    </div>
  );
};

export default TranscriptInput; 