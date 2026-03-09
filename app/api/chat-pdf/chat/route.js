import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { fileId, question, history = [] } = body;

    if (!fileId || !question) {
      return NextResponse.json({ error: "Missing document or question." }, { status: 400 });
    }

    const pdfText = global.pdfTextCache?.get(fileId);

    if (!pdfText) {
      return NextResponse.json({ error: "Document session expired. Please re-upload your PDF." }, { status: 400 });
    }

    const chatHistoryText = history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-1.5-flash"
    ];

    let result = null;
    let success = false;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // HIGHLIGHT: Prompt is now much smarter for translation and context
        const prompt = `
          You are an intelligent AI assistant analyzing a PDF document for a user.
          
          STRICT RULES:
          1. Answer questions based ONLY on the provided document text.
          2. IMPORTANT: If the user asks you to translate the answer, summarize it, or speak in a different language (e.g., "English me bata but Hindi me", which means Hinglish/Hindi written in English alphabet), YOU MUST DO IT. Translate the facts from the document into the requested language. Do NOT say "I cannot find the answer".
          3. If the user asks a follow-up question, use the "RECENT CHAT HISTORY" to understand the context.
          4. Format your answer nicely with bullet points if it's long.

          --- DOCUMENT TEXT START ---
          ${pdfText}
          --- DOCUMENT TEXT END ---

          --- RECENT CHAT HISTORY ---
          ${chatHistoryText}
          
          Current User Command: "${question}"
        `;

        result = await model.generateContent(prompt);
        success = true;
        break; 
      } catch (e) {
        console.warn(`Chat failed with ${modelName}:`, e.message);
      }
    }

    if (!success) {
      throw new Error("AI Models failed to respond.");
    }

    return NextResponse.json({ answer: result.response.text() });

  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Failed to generate answer." }, { status: 500 });
  }
}