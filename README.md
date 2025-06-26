# VocalCoach AI

**VocalCoach AI** is your real-time communication assistant for meetings. Use it during your calls to record and transcribe your speech, then get instant, AI-powered feedback on your communication. Identify mistakes, learn from your history, and become a more effective speaker—so you don't repeat the same mistakes again.

---

## 🚀 Features

- **Real-time meeting feedback:** Record and transcribe your voice during meetings, then get actionable feedback on your communication.
- **Google Login:** Secure authentication with your Google account (via Supabase Auth).
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
- Add the following:
  ```
  GEMINI_API_KEY=your_gemini_api_key
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  GOOGLE_REDIRECT_URI=your_google_redirect_uri
  ```
- Set up your Supabase project and Google OAuth credentials as described below.

### 4. **Supabase Setup**
- Create a [Supabase](https://supabase.com/) project.
- Enable Google provider in Supabase Auth settings.
- Create a `history` table with columns: `id` (uuid, PK), `user_id` (uuid), `date_time` (text), `transcript` (text), `feedback` (text), `created_at` (timestamp).
- Add your Supabase URL and anon key to `.env.local`.

### 5. **Google OAuth Setup**
- Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
- Add your Supabase project's callback URL as an authorized redirect URI.
- Add your app domain to the OAuth consent screen and add test users.
- Add your Google client ID, secret, and redirect URI to `.env.local`.

### 6. **Run the development server**
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

## 🖼️ Logo

The project logo is located at `public/logo.jpeg`.  
Feel free to replace it with your own branding!

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
