import { useState } from 'react';
import { parseTask } from '../utils/parser';

const TaskInput = ({ onAddTask }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!input.trim()) {
      setError('Please enter a task');
      return;
    }

    try {
      const parsedTask = parseTask(input);
      
      if (!parsedTask.taskName) {
        setError('Could not parse task name');
        return;
      }

      onAddTask({
        ...parsedTask,
        id: Date.now(), // Simple unique ID
      });

      setInput('');
    } catch (err) {
      setError('Error parsing task. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="task-input" className="block text-lg font-semibold text-gray-900">
            Add New Task
          </label>
          <p className="text-sm text-gray-500">
            Use natural language to describe your task. Include details like assignee, due date, and priority.
          </p>
          <div className="relative">
            <input
              id="task-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="e.g., Finish landing page by Aman tomorrow 5pm P1"
              className={`w-full p-3.5 border rounded-lg transition-all duration-200 ${
                isFocused
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-gray-200 hover:border-gray-300'
              } ${error ? 'border-red-500 ring-2 ring-red-500/20' : ''}`}
            />
            {error && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            )}
          </div>
          {error && (
            <p className="text-red-500 text-sm flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium
            hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Add Task
        </button>
      </form>
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-900 mb-3">Example Tasks:</p>
        <div className="space-y-2">
          {[
            'Finish landing page by Aman tomorrow 5pm P1',
            'Call client Rajeev by Wednesday',
            'Submit PR by EOD Thursday P2'
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => setInput(example)}
              className="w-full text-left p-2.5 text-sm text-gray-600 hover:text-gray-900
                hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskInput; 