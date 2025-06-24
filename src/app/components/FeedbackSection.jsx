import React from "react";

const FeedbackSection = ({ feedback, feedbackSections, dateTime, transcript }) => (
  feedback && (
    <>
      <div className="mt-8 bg-blue-50/80 dark:bg-neutral-900/80 border-2 border-[var(--accent)] rounded-2xl p-8 shadow-lg animate-fade-in">
        <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
          Communication Feedback
        </h3>
        <div className="space-y-4">
          {feedbackSections.length > 0 ? feedbackSections.map(({ title, content, idx }) => (
            <div key={idx}>
              <div className="font-bold text-neutral-800 dark:text-white mb-1 text-lg">{idx + 1}. {title}</div>
              <div className="text-neutral-700 dark:text-neutral-300 pl-4 text-base">{content}</div>
            </div>
          )) : <div className="text-neutral-700 dark:text-neutral-300">{feedback}</div>}
        </div>
      </div>
      {/* Download Feedback Button */}
      <div className="flex justify-end mt-4">
        <button
          className="px-5 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-semibold shadow transition-all"
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
  )
);

export default FeedbackSection; 