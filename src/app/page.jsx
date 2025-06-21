"use client";
import "./globals.css";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";
import { useState, useEffect } from "react";

const App = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
      setIsClient(true);
  }, []);

  const [textToCopy, setTextToCopy] = useState("");
  const [isCopied, setCopied] = useClipboard(textToCopy, {
      successDuration: 1000
  });

  const [feedback, setFeedback] = useState(""); // <-- For Gemini feedback
  const [loading, setLoading] = useState(false); // <-- For loading state

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

    if (!isClient) {
      // Prevents hydration mismatch by rendering nothing on the server
      return null;
  }


    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div className="container">
            <h2>AI Coach</h2>
            <br />
            <p>
                Audio to text
            </p>
            <div className="main-content" onClick={() => setTextToCopy(transcript)}>
                {transcript}
            </div>
            <div className="btn-style">
                <button onClick={setCopied}>
                    {isCopied ? 'Copied!' : 'Copy to clipboard'}
                </button>
                <button onClick={startListening}>Start Listening</button>
                <button onClick={SpeechRecognition.stopListening}>Stop Listening</button>
                <button onClick={getFeedback} disabled={!transcript || loading}>
                    {loading ? "Getting Feedback..." : "Get Communication Feedback"}
                </button>
            </div>
            {feedback && (
                <div className="feedback">
                    <h3>Communication Feedback:</h3>
                    <p>{feedback}</p>
                </div>
            )}
        </div>
    );
};

export default App;
