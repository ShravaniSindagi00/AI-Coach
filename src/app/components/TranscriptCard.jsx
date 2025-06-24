import React from "react";

const TranscriptCard = ({ transcript, setTextToCopy, highlightTranscript, extractHighlightPhrases, feedbackSections }) => (
  <div
    className="min-h-[100px] border-2 border-[var(--accent)] bg-white/80 dark:bg-neutral-900/80 rounded-2xl p-6 mb-6 cursor-pointer text-neutral-800 dark:text-neutral-100 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl backdrop-blur-md"
    onClick={() => setTextToCopy(transcript)}
    title="Click to copy transcript"
  >
    {transcript
      ? <span className="text-lg leading-relaxed" dangerouslySetInnerHTML={{
          __html: highlightTranscript(transcript, extractHighlightPhrases(feedbackSections))
        }} />
      : <span className="text-neutral-400">Your transcript will appear here...</span>}
  </div>
);

export default TranscriptCard; 