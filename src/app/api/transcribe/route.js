import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Readable } from 'stream';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('audio');

  if (!file) {
    return NextResponse.json({ error: 'No file found' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const stream = Readable.from(buffer);

  try {
    // Step 1: Transcribe
    const transcription = await openai.audio.transcriptions.create({
      file: stream,
      model: 'whisper-1',
      filename: 'recording.webm',
    });

    const transcriptText = transcription.text;

    // Step 2: Get feedback from GPT-4o-mini
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Analyze my speech and give suggestions to improve it:\n\n"${transcriptText}"`,
        },
      ],
    });

    const feedback = completion.choices[0].message.content;

    return NextResponse.json({
      transcript: transcriptText,
      feedback: feedback,
    });
  } catch (err) {
    console.error('Transcription or GPT error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
