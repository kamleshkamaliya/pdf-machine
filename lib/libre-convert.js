import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { readFile } from "fs/promises";

const execPromise = promisify(exec);

export async function convertWithLibre(inputPath, outputDir) {
  try {
    const command = `libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;
    await execPromise(command);
    
    // Output file path
    const fileName = path.basename(inputPath, path.extname(inputPath));
    const outputPath = path.join(outputDir, `${fileName}.pdf`);
    
    // Read file
    const pdfBuffer = await readFile(outputPath);
    return pdfBuffer;
    
  } catch (error) {
    throw new Error("LibreOffice conversion failed: " + error.message);
  }
}