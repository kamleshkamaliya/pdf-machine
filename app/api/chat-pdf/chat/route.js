import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { fileId, question, history = [] } = body; // History add kiya hai

    if (!fileId || !question) {
      return NextResponse.json({ error: "Missing document or question." }, { status: 400 });
    }

    // Retrieve the text from our in-memory cache
    const pdfText = global.pdfTextCache?.get(fileId);

    if (!pdfText) {
      return NextResponse.json({ error: "Document session expired. Please re-upload your PDF." }, { status: 400 });
    }

    // Format chat history so AI remembers the context
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
        
        // SMARTER PROMPT: Context aur general questions dono ko handle karega
        const prompt = `
          You are an intelligent AI assistant analyzing a document for a user.
          
          INSTRUCTIONS:
          1. If the user asks a question about the document, answer it accurately using ONLY the provided document text.
          2. If the user gives a conversational command (like "translate the previous answer to Hindi", "explain in simple terms", "talk in Hinglish"), fulfill their request based on the chat history and context.
          3. If the user asks a general question totally unrelated to the document, answer it using your general knowledge but politely mention it's not from the document.
          4. ALWAYS reply in the language the user is speaking (e.g., Hinglish, Hindi, English).

          --- DOCUMENT TEXT START ---
          ${pdfText}
          --- DOCUMENT TEXT END ---

          --- RECENT CHAT HISTORY ---
          ${chatHistoryText}
          
          Current User Command/Question: "${question}"
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

    const answerText = await result.response.text();

    return NextResponse.json({ answer: answerText });

  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Failed to generate answer." }, { status: 500 });
  }
}