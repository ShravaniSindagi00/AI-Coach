'use client'
import { useRef, useState } from 'react';

export default function Home() {
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
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
        <div className="mt-6">
          <h2 className="font-semibold">🎧 Your Recording:</h2>
          <audio controls src={audioURL} className="mt-2" />
        </div>
      )}
    </main>
  );
}
