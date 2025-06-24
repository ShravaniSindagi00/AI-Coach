import React from "react";

const LogoHeader = () => (
  <div className="w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8">
    <div className="flex justify-center mb-4">
      <img src="/logo.jpeg" alt="VocalCoach AI Logo" className="h-20 w-auto" />
    </div>
    <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2"> VocalCoach AI</h2>
    <p className="text-neutral-600 dark:text-neutral-300 mb-4">Turn your voice into actionable communication insights</p>
  </div>
);

export default LogoHeader; 