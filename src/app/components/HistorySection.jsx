import React from "react";

const HistorySection = ({
  history,
  showHistory,
  setShowHistory,
  setTranscript,
  setFeedback,
  setDateTime,
  setHistory,
  onClearHistory,
  user
}) => (
  <div className="w-full max-w-2xl mb-6">
    <button
      className="mb-4 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-semibold shadow transition-all"
      onClick={() => setShowHistory((v) => !v)}
    >
      {showHistory ? 'Hide History' : 'Show History'}
    </button>
    {showHistory && (
      <div className="bg-white/80 dark:bg-neutral-900/80 rounded-2xl shadow-lg p-6 max-h-64 overflow-y-auto border-2 border-[var(--accent)] animate-fade-in">
        {history.length === 0 && <div className="text-neutral-500">No history yet.</div>}
        {history.length > 0 && (
          <button
            className="mb-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm float-right font-semibold shadow transition-all"
            onClick={onClearHistory}
          >
            Delete History
          </button>
        )}
        {history.map((item, idx) => (
          <div
            key={idx}
            className="border-b border-neutral-200 dark:border-neutral-700 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-neutral-700 rounded transition-all"
            onClick={() => {
              setTranscript(item.transcript);
              setFeedback(item.feedback);
              setDateTime(item.dateTime);
              setShowHistory(false);
            }}
          >
            <div className="text-xs text-neutral-500">{item.dateTime}</div>
            <div className="truncate text-base text-neutral-800 dark:text-neutral-200 font-medium">{item.transcript.slice(0, 60)}{item.transcript.length > 60 ? '...' : ''}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default HistorySection; 