import React from "react";

const FeedbackSection = ({ feedback, feedbackSections, dateTime, transcript }) => (
  feedback && (
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
  )
);

export default FeedbackSection; 