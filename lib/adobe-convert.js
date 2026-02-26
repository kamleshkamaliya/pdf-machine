import { ServicePrincipalCredentials, PDFServices, MimeType, CreatePDFJob, CreatePDFResult } from "@adobe/pdfservices-node-sdk";
import fs from "fs";
import { Readable } from "stream";

// Helper: Stream ko Buffer mein badalne ke liye
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function convertWithAdobe(inputPath) {
  try {
    // 1. Check agar Keys set nahi hain
    if (!process.env.ADOBE_CLIENT_ID || !process.env.ADOBE_CLIENT_SECRET) {
      throw new Error("Adobe API Keys missing in .env file");
    }

    // 2. Credentials Setup
    const credentials = new ServicePrincipalCredentials({
      clientId: process.env.ADOBE_CLIENT_ID,
      clientSecret: process.env.ADOBE_CLIENT_SECRET
    });

    const pdfServices = new PDFServices({ credentials });

    // 3. File Read Stream
    const readStream = fs.createReadStream(inputPath);

    // 4. Asset Upload (Adobe Cloud par)
    // Hum assume kar rahe hain ki file DOCX hai.
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.DOCX
    });

    // 5. Job Create (Convert to PDF)
    const job = new CreatePDFJob({ asset: inputAsset });
    
    // 6. Job Submit aur Result ka wait
    const pollingURL = await pdfServices.submit({ job });
    const pdfResult = await pdfServices.getJobResult({ pollingURL, resultType: CreatePDFResult });

    // 7. Result Download
    const resultStream = await pdfServices.getContent({ asset: pdfResult.asset });
    
    // Stream ko Buffer mein convert karke return karein
    return await streamToBuffer(resultStream);

  } catch (error) {
    console.error("Adobe Conversion Error:", error);
    throw error; // Error upar pheko taaki LibreOffice par switch ho sake
  }
}