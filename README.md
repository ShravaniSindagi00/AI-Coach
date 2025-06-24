# VocalCoach AI

**VocalCoach AI** is your personal, AI-powered communication coach. Instantly transcribe your speech, receive actionable feedback, and get professional rephrasings—all in a beautiful, user-friendly interface. Now with Google login, Google Calendar integration, and persistent user history!

---

## 🚀 Features

- **Google Login:** Secure authentication with your Google account. 
- **Live audio-to-text:** Speak and see your words transcribed in real time.
- **Automated feedback:** Instantly receive structured, actionable feedback on your communication.
- **Professional rephrasing:** Get a polished version of your speech—see how you could say it better.
- **History & download:** Review, download, and learn from your past sessions. History is saved per user in Supabase.
- **Google Calendar integration:** View your upcoming events and create new events directly from the app.
- **Transcript highlighting:** Problematic phrases are visually highlighted for targeted improvement.
- **Modern, responsive UI:** Beautiful glassmorphism cards, vibrant buttons, and dark mode support.

---

## 🦄 What Makes VocalCoach AI Unique?

- **End-to-End Voice Coaching Workflow:** From speech to feedback to improvement, all in one place.
- **Actionable, Structured Feedback:** No more vague advice—get clear, numbered suggestions.
- **Professional Rephrasing:** Not just critique, but a model answer for your communication.
- **Session History:** Track your progress and revisit past feedback, synced to your account.
- **Google Calendar Integration:** See and create events without leaving the app.
- **Visual Learning:** Instantly spot issues in your transcript with smart highlighting.

---

## 🛠️ Getting Started

### 1. **Clone the repository**
```bash
git clone https://github.com/yourusername/vocalcoach-ai.git
cd vocalcoach-ai
```

### 2. **Install dependencies**
```bash
npm install
```

### 3. **Set up environment variables**
- Create a `.env.local` file in the root directory.



### 4. **Google OAuth Setup**
- Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
- Add your Supabase project's callback URL as an authorized redirect URI.
- Add your app domain to the OAuth consent screen and add test users.
- Add your Google client ID, secret, and redirect URI to `.env.local`.

### 5. **Run the development server**
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to use the app.

---

## 🔐 Authentication & Usage
- **Sign in with Google** to access all features.
- Your feedback history and calendar events are private and tied to your account.
- Only authenticated users can view, save, or delete their history.

---


## 🤖 Built With

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Gemini API (Google)](https://ai.google.dev/)
- [react-speech-recognition](https://www.npmjs.com/package/react-speech-recognition)

---

## 💡 Future Ideas

- Upload and analyze meeting recordings (Zoom, Teams, Google Meet)
- Progress tracking and analytics
- Team dashboards and sharing
- Multilingual support
- More calendar integrations

---

**Ready to become a better communicator? Try VocalCoach AI now!**
