import React from "react";

const ControlButtons = ({ setCopied, isCopied, startListening, stopListening, getFeedback, liveTranscript, loading, isRecording }) => (
  <div className="flex flex-wrap gap-4 mb-8 items-center justify-center bg-white/70 dark:bg-neutral-900/70 rounded-2xl shadow p-6">
    <button onClick={setCopied} className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow transition-all">
      {isCopied ? 'Copied!' : 'Copy to clipboard'}
    </button>
    <button onClick={startListening} className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow transition-all">
      Start Listening
    </button>
    <button onClick={stopListening} className="px-5 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold shadow transition-all">
      Stop Listening
    </button>
    <button onClick={getFeedback} disabled={!liveTranscript || loading} className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow transition-all disabled:opacity-50">
      {loading ? "Getting Feedback..." : "Get Communication Feedback"}
    </button>
    {isRecording && (
      <span className="ml-4 text-red-600 font-semibold animate-pulse">
        ● Recording...
      </span>
    )}
  </div>
);

export default ControlButtons; 