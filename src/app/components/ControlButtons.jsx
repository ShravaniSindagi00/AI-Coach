import React from "react";

const ControlButtons = ({ setCopied, isCopied, startListening, stopListening, getFeedback, liveTranscript, loading, isRecording }) => (
  <div className="flex flex-wrap gap-2 mb-6 items-center">
    <button onClick={setCopied} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
      {isCopied ? 'Copied!' : 'Copy to clipboard'}
    </button>
    <button onClick={startListening} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">Start Listening</button>
    <button onClick={stopListening} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md">Stop Listening</button>
    <button onClick={getFeedback} disabled={!liveTranscript || loading} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md disabled:opacity-50">
      {loading ? "Getting Feedback..." : "Get Communication Feedback"}
    </button>
    {isRecording && (
      <span className="ml-4 text-red-600 font-semibold animate-pulse">● Recording...</span>
    )}
  </div>
);

export default ControlButtons; 