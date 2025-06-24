"use client";
import "./globals.css";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";
import { useState, useEffect } from "react";
import Instructions from "./components/Instructions";
import LogoHeader from "./components/LogoHeader";
import HistorySection from "./components/HistorySection";
import TranscriptCard from "./components/TranscriptCard";
import ControlButtons from "./components/ControlButtons";
import FeedbackSection from "./components/FeedbackSection";
import AuthStatus from "./components/AuthStatus";
import { supabase } from "../utils/supabaseClient";
import GoogleLoginButton from "./components/GoogleLoginButton";

const HISTORY_KEY = 'ai_coach_history';

const App = () => {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(null);
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

  const fetchHistoryFromSupabase = async (userId) => {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) {
      console.error('Error fetching history:', error);
      return [];
    }
    return data || [];
  };

  useEffect(() => {
    setIsClient(true);
    // Set current date/time in desired format
    const now = new Date();
    setDateTime(now.toLocaleString('en-US', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }));
    // Check auth status
    supabase.auth.getSession().then(async ({ data }) => {
      const currentUser = data?.session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const supabaseHistory = await fetchHistoryFromSupabase(currentUser.id);
        setHistory(supabaseHistory);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const supabaseHistory = await fetchHistoryFromSupabase(currentUser.id);
        setHistory(supabaseHistory);
      } else {
        setHistory([]);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
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
      // Save to Supabase history
      if (user) {
        const { error } = await supabase.from('history').insert([
          {
            user_id: user.id,
            date_time: dateTime,
            transcript: liveTranscript,
            feedback: data.feedback
          }
        ]);
        if (error) {
          console.error('Error saving feedback to Supabase:', error);
        } else {
          // Fetch updated history from Supabase
          const supabaseHistory = await fetchHistoryFromSupabase(user.id);
          setHistory(supabaseHistory);
        }
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

  // Function to clear all history for the current user from Supabase
  const onClearHistory = async () => {
    if (user) {
      const { error } = await supabase.from('history').delete().eq('user_id', user.id);
      if (error) {
        console.error('Error deleting history from Supabase:', error);
      } else {
        setHistory([]);
      }
    }
  };

  if (!isClient) return null;
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center py-8 px-2">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-red-700">Please sign in to use AI Coach</h2>
          <GoogleLoginButton />
        </div>
      </div>
    );
  }
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center py-8 px-2">
      <AuthStatus />
      <Instructions />
      <HistorySection
        history={history}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        setTranscript={setTranscript}
        setFeedback={setFeedback}
        setDateTime={setDateTime}
        setHistory={setHistory}
        onClearHistory={onClearHistory}
        user={user}
      />
      <div className="w-full max-w-2xl flex justify-end text-xs text-neutral-400 mb-2">
        <span>{dateTime}</span>
      </div>
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8">
        <LogoHeader />
        <TranscriptCard
          transcript={transcript}
          setTextToCopy={setTextToCopy}
          highlightTranscript={highlightTranscript}
          extractHighlightPhrases={extractHighlightPhrases}
          feedbackSections={feedbackSections}
        />
        <ControlButtons
          setCopied={setCopied}
          isCopied={isCopied}
          startListening={startListening}
          stopListening={stopListening}
          getFeedback={getFeedback}
          liveTranscript={liveTranscript}
          loading={loading}
          isRecording={isRecording}
        />
        <FeedbackSection
          feedback={feedback}
          feedbackSections={feedbackSections}
          dateTime={dateTime}
          transcript={transcript}
        />
      </div>
    </div>
  );
};

export default App;
