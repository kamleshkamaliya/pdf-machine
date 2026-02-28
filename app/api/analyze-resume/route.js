import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFParser from "pdf2json";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: PDF Parse karna (Ye perfectly kaam kar raha hai)
const parsePDF = async (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);
    
    pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
    
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const text = pdfParser.getRawTextContent();
      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Text Extract
    const resumeText = await parsePDF(buffer);

    // --- SMART MODEL LIST (Priority Wise) ---
    // Hum pehle 2.5 try karenge, agar fail hua toh Lite, phir 1.5
    const modelsToTry = [
      "gemini-2.5-flash",                   // 1. Latest & Best
      "gemini-2.0-flash-lite-preview-02-05", // 2. High Limit Backup
      "gemini-1.5-flash"                    // 3. Old Reliable
    ];

    let result = null;
    let success = false;
    let lastError = null;
    let usedModel = "";

    // Loop chalayenge taaki sahi model apne aap pakad le
    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting with model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // --- UPDATED PROMPT FOR SCORE BREAKDOWN ---
        const prompt = `
          You are an expert ATS (Applicant Tracking System) & Senior Technical Recruiter.
          Analyze the following resume text strictly.

          Resume Text: "${resumeText.substring(0, 15000)}"

          Goal: Provide a quantified score breakdown and specific action plan.
          
          Return a JSON response ONLY (no markdown) with this exact structure:
          {
            "overall_score": number (0-100),
            "breakdown": {
              "impact": number (0-100, score based on quantification/metrics used),
              "keywords": number (0-100, score based on technical/industry terms),
              "formatting": number (0-100, score based on structure/readability),
              "brevity": number (0-100, score based on conciseness/length)
            },
            "score_reason": "One sharp sentence explaining WHY the score is low or high.",
            "critical_missing_skills": ["Skill 1", "Skill 2", "Skill 3"],
            "action_plan": ["Step 1 (Specific fix)", "Step 2 (Specific fix)", "Step 3"]
          }
        `;

        result = await model.generateContent(prompt);
        usedModel = modelName;
        success = true;
        break; // Agar chal gaya toh loop roko
      } catch (e) {
        console.warn(`Failed with ${modelName}:`, e.message);
        lastError = e;
      }
    }

    if (!success) {
      throw lastError || new Error("All models failed");
    }

    const response = await result.response;
    let text = response.text();

    // Clean JSON (Markdown removal)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    console.log(`✅ Success! Used Model: ${usedModel}`);

    return NextResponse.json(JSON.parse(text));

  } catch (error) {
    console.error("Final Server Error:", error);
    return NextResponse.json(
      { error: "Analysis failed. API Key or Model Name issue." },
      { status: 500 }
    );
  }
}