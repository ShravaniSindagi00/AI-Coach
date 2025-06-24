import React from "react";

const TranscriptCard = ({ transcript, setTextToCopy, highlightTranscript, extractHighlightPhrases, feedbackSections }) => (
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
);

export default TranscriptCard; 