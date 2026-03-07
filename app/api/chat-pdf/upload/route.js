import { NextResponse } from "next/server";
import PDFParser from "pdf2json";
import { v4 as uuidv4 } from 'uuid'; // You'll need to run: npm install uuid

// Simple in-memory storage (Note: resets on serverless cold starts)
// You can move this to Redis or a temp file if needed later.
global.pdfTextCache = global.pdfTextCache || new Map();

const parsePDF = async (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);
    pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", () => {
      resolve(pdfParser.getRawTextContent());
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

    // Extract Text
    const pdfText = await parsePDF(buffer);
    
    // Check if text was found
    if (!pdfText || pdfText.trim() === "") {
        return NextResponse.json({ error: "Could not extract text from this PDF. It might be scanned images." }, { status: 400 });
    }

    // Generate a unique ID for this session and store the text
    const fileId = uuidv4();
    
    // Store first 30,000 characters to prevent huge token costs
    global.pdfTextCache.set(fileId, pdfText.substring(0, 30000));

    // Optional Cleanup: Remove from memory after 1 hour to prevent memory leaks
    setTimeout(() => {
        global.pdfTextCache.delete(fileId);
    }, 60 * 60 * 1000);

    return NextResponse.json({ fileId, success: true });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Failed to process PDF." }, { status: 500 });
  }
}