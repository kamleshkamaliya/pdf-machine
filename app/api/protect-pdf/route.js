import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export const runtime = "nodejs";

function ownerPass() {
  return randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, "");
}

export async function POST(req) {
  let inputPath = "";
  let outputPath = "";

  try {
    const form = await req.formData();
    const file = form.get("file");
    const password = form.get("password");

    if (!file || typeof file === "string") {
      return new NextResponse("Missing file", { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 4) {
      return new NextResponse("Invalid password", { status: 400 });
    }

    const filename = file.name || "file.pdf";
    if (!filename.toLowerCase().endsWith(".pdf")) {
      return new NextResponse("Only PDF files are allowed", { status: 400 });
    }

    const tmp = os.tmpdir();
    const id = randomUUID();

    inputPath = path.join(tmp, `protect-in-${id}.pdf`);
    outputPath = path.join(tmp, `protect-out-${id}.pdf`);

    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, buf);

    // AES-256 encryption
    const args = ["--encrypt", password, ownerPass(), "256", "--", inputPath, outputPath];
    await execFileAsync("qpdf", args, { timeout: 60_000 });

    const outBuf = await fs.readFile(outputPath);

    // cleanup
    await fs.unlink(inputPath).catch(() => {});
    await fs.unlink(outputPath).catch(() => {});

    return new NextResponse(outBuf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="protected-${path.basename(filename)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    if (inputPath) await fs.unlink(inputPath).catch(() => {});
    if (outputPath) await fs.unlink(outputPath).catch(() => {});

    return new NextResponse(err?.message || "Protect PDF failed", { status: 500 });
  }
}
