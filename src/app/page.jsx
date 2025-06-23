"use client";
import "./globals.css";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";
import { useState, useEffect } from "react";

const HISTORY_KEY = 'ai_coach_history';

const App = () => {
  const [isClient, setIsClient] = useState(false);
  const [textToCopy, setTextToCopy] = useState("");
  const [isCopied, setCopied] = useClipboard(textToCopy, { successDuration: 1000 });
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { transcript: liveTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isRecording, setIsRecording] = useState(false);
  const MAX_RECORDING_TIME = 30000; // 30 seconds

  useEffect(() => {
    setIsClient(true);
    // Set current date/time in desired format
    const now = new Date();
    setDateTime(now.toLocaleString('en-US', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }));
    // Load history from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    }
  }, []);

  // Keep transcript in sync with liveTranscript unless viewing history
  useEffect(() => {
    if (!feedback) setTranscript(liveTranscript);
  }, [liveTranscript, feedback]);

  // Start listening and set timers
  const startListening = () => {
    setIsRecording(true);
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    // Auto-stop after max time
    setTimeout(() => {
      SpeechRecognition.stopListening();
      setIsRecording(false);
    }, MAX_RECORDING_TIME);
  };

  // Stop listening handler
  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsRecording(false);
  };

  // Function to send transcript to Gemini API
  const getFeedback = async () => {
    setLoading(true);
    setFeedback("");
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: liveTranscript })
      });
      const data = await res.json();
      setFeedback(data.feedback);
      setTranscript(liveTranscript);
      // Save to history
      const newEntry = {
        dateTime,
        transcript: liveTranscript,
        feedback: data.feedback
      };
      const updatedHistory = [newEntry, ...history].slice(0, 20); // keep last 20
      setHistory(updatedHistory);
      if (typeof window !== 'undefined') {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      }
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

  // Helper: Extract highlight phrases from feedback sections
  function extractHighlightPhrases(feedbackSections) {
    // Only use Grammar, Awkward Phrasing, Clarity
    const keys = ["Grammar", "Awkward Phrasing", "Clarity and Conciseness", "Clarity"];
    let phrases = [];
    feedbackSections.forEach(({ title, content }) => {
      if (keys.some(k => title.toLowerCase().includes(k.toLowerCase()))) {
        // Extract quoted phrases or short problematic words (rudimentary)
        const matches = content.match(/"([^"]+)"|'([^']+)'|`([^`]+)`/g);
        if (matches) {
          matches.forEach(m => {
            const clean = m.replace(/['"`]/g, "").trim();
            if (clean.length > 1) phrases.push(clean);
          });
        }
        // Also add short phrases (less than 5 words) split by comma
        content.split(',').forEach(part => {
          const p = part.trim();
          if (p && p.length < 40 && p.split(' ').length <= 5 && !p.includes('...')) phrases.push(p);
        });
      }
    });
    // Deduplicate
    return [...new Set(phrases.map(p => p.toLowerCase()))];
  }

  // Helper: Highlight phrases in transcript
  function highlightTranscript(text, phrases) {
    if (!phrases.length) return text;
    let result = text;
    // Sort phrases by length (longest first)
    phrases = phrases.sort((a, b) => b.length - a.length);
    phrases.forEach(phrase => {
      if (!phrase || phrase.length < 2) return;
      // Use regex to match whole words/phrases, case-insensitive
      const regex = new RegExp(`(${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      result = result.replace(regex, '<mark class="bg-yellow-200 text-black rounded px-1">$1</mark>');
    });
    return result;
  }

  if (!isClient) return null;
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center py-8 px-2">
      {/* Instructions */}
      <div className="w-full max-w-2xl mb-4">
        <div className="bg-yellow-100 text-yellow-800 rounded p-2 text-sm mb-2">
          <b>Tip:</b> For best results, use a headset or dedicated microphone in a quiet environment.
        </div>
      </div>
      {/* History Section */}
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
      {/* Date/Time Header */}
      <div className="w-full max-w-2xl flex justify-end text-xs text-neutral-400 mb-2">
        <span>{dateTime}</span>
      </div>
      {/* Main Card */}
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-4">
          <img src="/logo.jpeg" alt="VocalCoach AI Logo" className="h-20 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2"> VocalCoach AI</h2>
        <p className="text-neutral-600 dark:text-neutral-300 mb-4">Turn your voice into actionable communication insights</p>
        <div
          className="min-h-[100px] border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-md p-4 mb-4 cursor-pointer text-neutral-800 dark:text-neutral-100"
          onClick={() => setTextToCopy(transcript)}
        >
          {transcript
            ? <span dangerouslySetInnerHTML={{
                __html: highlightTranscript(transcript, extractHighlightPhrases(feedbackSections))
              }} />
            : <span className="text-neutral-400">Your transcript will appear here...</span>}
        </div>
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
        {/* Feedback Section */}
        {feedback && (
          <>
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
            {/* Download Feedback Button */}
            <div className="flex justify-end mt-2">
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md"
                onClick={() => {
                  const blob = new Blob([
                    `Date/Time: ${dateTime}\n\nTranscript:\n${transcript}\n\nFeedback:\n${feedback}`
                  ], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `AI-Coach-Feedback-${dateTime.replace(/\W+/g, '-')}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                Download Feedback
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
