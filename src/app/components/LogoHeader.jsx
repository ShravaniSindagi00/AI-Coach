import React from "react";

const LogoHeader = () => (
  <div className="w-full max-w-2xl bg-white/80 dark:bg-neutral-800/80 rounded-3xl shadow-2xl p-10 mb-6 border border-[var(--accent)] backdrop-blur-md">
    <div className="flex justify-center mb-4">
      <img src="/logo.jpeg" alt="VocalCoach AI Logo" className="h-24 w-auto rounded-full border-4 border-[var(--accent)] shadow-lg" />
    </div>
    <h2 className="text-4xl font-extrabold text-neutral-800 dark:text-white mb-2 tracking-tight text-center drop-shadow-lg">VocalCoach AI</h2>
    <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-2 text-center">Turn your voice into <span className='text-[var(--accent)] font-semibold'>actionable communication insights</span></p>
  </div>
);

export default LogoHeader; 