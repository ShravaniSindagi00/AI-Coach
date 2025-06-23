"use client";
import "./globals.css";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";
import { useState, useEffect } from "react";

const App = () => {
  const [isClient, setIsClient] = useState(false);
  const [textToCopy, setTextToCopy] = useState("");
  const [isCopied, setCopied] = useClipboard(textToCopy, { successDuration: 1000 });
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    setIsClient(true);
    // Set current date/time in desired format
    const now = new Date();
    setDateTime(now.toLocaleString('en-US', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }));
  }, []);

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Function to send transcript to Gemini API
  const getFeedback = async () => {
    setLoading(true);
    setFeedback("");
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript })
      });
      const data = await res.json();
      setFeedback(data.feedback);
    } catch (err) {
      setFeedback("Error getting feedback.");
    }
    setLoading(false);
  };

  // Parse feedback into sections (numbered points)
  const feedbackSections = feedback
    ? feedback.split(/\n?\d+\. /).filter(Boolean).map((section, idx) => ({
        title: section.split(":")[0],
        content: section.substring(section.indexOf(":") + 1).trim(),
        idx
      }))
    : [];

  if (!isClient) return null;
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center py-8 px-2">
      {/* Date/Time Header */}
      <div className="w-full max-w-2xl flex justify-end text-xs text-neutral-400 mb-2">
        <span>{dateTime}</span>
      </div>
      {/* Main Card */}
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">AI Coach</h2>
        <p className="text-neutral-600 dark:text-neutral-300 mb-4">Audio to text</p>
        <div
          className="min-h-[100px] border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-md p-4 mb-4 cursor-pointer text-neutral-800 dark:text-neutral-100"
          onClick={() => setTextToCopy(transcript)}
        >
          {transcript || <span className="text-neutral-400">Your transcript will appear here...</span>}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={setCopied} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
            {isCopied ? 'Copied!' : 'Copy to clipboard'}
          </button>
          <button onClick={startListening} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">Start Listening</button>
          <button onClick={SpeechRecognition.stopListening} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md">Stop Listening</button>
          <button onClick={getFeedback} disabled={!transcript || loading} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md disabled:opacity-50">
            {loading ? "Getting Feedback..." : "Get Communication Feedback"}
          </button>
        </div>
        {/* Feedback Section */}
        {feedback && (
          <div className="mt-6 bg-blue-50 dark:bg-neutral-900 border border-blue-200 dark:border-neutral-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">Communication Feedback</h3>
            <div className="space-y-4">
              {feedbackSections.length > 0 ? feedbackSections.map(({ title, content, idx }) => (
                <div key={idx}>
                  <div className="font-bold text-neutral-800 dark:text-white mb-1">{idx + 1}. {title}</div>
                  <div className="text-neutral-700 dark:text-neutral-300 pl-4">{content}</div>
                </div>
              )) : <div className="text-neutral-700 dark:text-neutral-300">{feedback}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
