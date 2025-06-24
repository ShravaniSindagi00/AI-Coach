import React from "react";

const HistorySection = ({
  history,
  showHistory,
  setShowHistory,
  setTranscript,
  setFeedback,
  setDateTime,
  setHistory,
  HISTORY_KEY
}) => (
  <div className="w-full max-w-2xl mb-4">
    <button
      className="mb-2 px-4 py-2 bg-gray-200 dark:bg-neutral-700 text-neutral-800 dark:text-white rounded-md"
      onClick={() => setShowHistory((v) => !v)}
    >
      {showHistory ? 'Hide' : 'Show'} History
    </button>
    {showHistory && (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 max-h-64 overflow-y-auto">
        {history.length === 0 && <div className="text-neutral-500">No history yet.</div>}
        {history.length > 0 && (
          <button
            className="mb-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm float-right"
            onClick={() => {
              setHistory([]);
              if (typeof window !== 'undefined') {
                localStorage.removeItem(HISTORY_KEY);
              }
            }}
          >
            Delete History
          </button>
        )}
        {history.map((item, idx) => (
          <div
            key={idx}
            className="border-b border-neutral-200 dark:border-neutral-700 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-neutral-700 rounded"
            onClick={() => {
              setTranscript(item.transcript);
              setFeedback(item.feedback);
              setDateTime(item.dateTime);
              setShowHistory(false);
            }}
          >
            <div className="text-xs text-neutral-500">{item.dateTime}</div>
            <div className="truncate text-sm text-neutral-800 dark:text-neutral-200">{item.transcript.slice(0, 60)}{item.transcript.length > 60 ? '...' : ''}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default HistorySection; 