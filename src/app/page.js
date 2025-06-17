'use client';
import { useRef, useState } from 'react';

export default function Home() {
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access denied or not supported', error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;

    setLoading(true);
    setTranscript('');

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.text) {
        setTranscript(data.text);
      } else {
        setTranscript('⚠️ Transcription failed.');
      }
    } catch (err) {
      console.error('Error transcribing audio:', err);
      setTranscript('⚠️ An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">🎤 AI Meeting Coach</h1>

      <div className="flex gap-4">
        <button
          onClick={handleStartRecording}
          disabled={isRecording}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Start Recording
        </button>

        <button
          onClick={handleStopRecording}
          disabled={!isRecording}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Stop Recording
        </button>
      </div>

      {audioURL && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <audio controls src={audioURL} />
          <button
            onClick={handleTranscribe}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? 'Transcribing...' : 'Transcribe Audio'}
          </button>
        </div>
      )}

      {transcript && (
        <div className="mt-4 max-w-xl text-center">
          <h2 className="text-lg font-semibold mb-2">📝 Transcript:</h2>
          <p className="bg-gray-100 p-4 rounded">{transcript}</p>
        </div>
      )}
    </main>
  );
}
