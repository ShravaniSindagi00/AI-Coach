// src/app/api/gemini/route.js

export async function POST(request) {
  // 1. Parse the transcript from the request body
  const { transcript } = await request.json();
  console.log("[Gemini API] Received transcript:", transcript);

  // 2. Prepare the prompt for Gemini
  const prompt = `You are an expert communication coach. Carefully review the following text and provide feedback ONLY in the following structured format, with NO introduction, summary, or restatement of the input text. Start directly with the numbered points:

1. Grammar: ...
2. Tone: ...
3. Awkward Phrasing: ...
4. Clarity and Conciseness: ...
5. Professional Rephrasing: Provide a single, improved version of the input text, rephrased to sound professional and clear.

Guidelines:
- Ignore trivial grammar issues such as capitalization of greetings or minor typos.
- Only provide feedback on issues that significantly impact communication, clarity, or professionalism.
- Be specific and actionable in your suggestions.

Here is the text to review:
"""
${transcript}
"""

Do not include any other text before or after the numbered feedback.`;
  console.log("[Gemini API] Prompt:", prompt);

  // 3. Get the Gemini API key from environment variables
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  console.log("[Gemini API] API Key present:", !!GEMINI_API_KEY);

  try {
    // 4. Make a POST request to Gemini API
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    // 5. Parse Gemini's response
    const data = await geminiResponse.json();
    console.log("[Gemini API] Raw response:", JSON.stringify(data));

    // 6. Extract the feedback text (handle possible errors)
    let feedback = "No feedback received.";
    try {
      feedback = data.candidates?.[0]?.content?.parts?.[0]?.text || feedback;
    } catch (e) {
      console.log("[Gemini API] Error extracting feedback:", e);
    }

    // 7. Return the feedback as JSON
    return new Response(JSON.stringify({ feedback }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.log("[Gemini API] Error in fetch or processing:", error);
    return new Response(JSON.stringify({ feedback: "Error contacting Gemini API." }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
}