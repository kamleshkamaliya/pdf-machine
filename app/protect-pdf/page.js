"use client";

import { useState, useMemo } from "react";
import {
  Upload,
  FileText,
  Download,
  Loader2,
  CheckCircle,
  X,
  Lock,
  ShieldCheck,
  Info,
  AlertTriangle,
} from "lucide-react";

/**
 * ✅ IMPORTANT (Next.js App Router SEO)
 * App Router me <title> / <meta> JSX ke andar recommended nahi hota.
 * Is page ko SEO-ready banane ke liye SAME ROUTE par ek file add karo:
 *
 * ✅ app/protect-pdf/head.js   (most compatible, copy-paste)
 * OR
 * ✅ app/protect-pdf/metadata.js (if you prefer)
 *
 * Main neeche "head.js" ka exact code de raha hoon.
 */

// ---------- Helpers ----------
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function getPasswordStrength(pwd) {
  if (!pwd) return { label: "Enter a password", color: "text-slate-500", score: 0 };

  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (pwd.length < 6) return { label: "Very Weak", color: "text-red-600", score };
  if (score <= 3) return { label: "Weak", color: "text-orange-600", score };
  if (score <= 5) return { label: "Strong", color: "text-green-600", score };
  return { label: "Very Strong", color: "text-emerald-600", score };
}

function generateStrongPassword(len = 14) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function ProtectPDFHub() {
  // --- GLOBAL STATE ---
  const [file, setFile] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const [originalSize, setOriginalSize] = useState(0);
  const [protectedSize, setProtectedSize] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  // ---------- JSON-LD (AI + SEO) ----------
  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Protect PDF",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "Protect PDF with a password using AES-256 encryption. Secure processing and auto-delete.",
      url: "https://YOURDOMAIN.com/protect-pdf",
      publisher: { "@type": "Organization", name: "PDF Machine" },
    }),
    []
  );

  // --- HANDLERS ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && selectedFile.type === "application/pdf") {
      // cleanup old blob URL if any
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      setFile(selectedFile);
      setOriginalSize(selectedFile.size);

      setProtectedSize(0);
      setDownloadUrl(null);
      setIsDone(false);
      setIsWorking(false);
      setProgress(0);
      setError(null);

      setPassword("");
      setConfirm("");
    } else {
      alert("Please select a PDF file.");
    }
  };

  const resetAll = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);

    setFile(null);
    setIsWorking(false);
    setIsDone(false);
    setOriginalSize(0);
    setProtectedSize(0);
    setDownloadUrl(null);
    setPassword("");
    setConfirm("");
    setProgress(0);
    setError(null);
  };

  const suggestPassword = () => {
    const p = generateStrongPassword(14);
    setPassword(p);
    setConfirm(p);
    setError(null);
  };

  const protectPdf = async () => {
    if (!file) return;
    setError(null);

    if (!password || password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setIsWorking(true);
    setProgress(25);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("password", password);

      setProgress(45);

      const res = await fetch("/api/protect-pdf", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "Failed");
        throw new Error(text || "Protect PDF failed");
      }

      setProgress(75);

      const blob = await res.blob();

      // cleanup old
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      setProtectedSize(blob.size);
      setDownloadUrl(window.URL.createObjectURL(blob));

      setProgress(100);
      setIsDone(true);
    } catch (e) {
      setError(e?.message || "Server encryption failed.");
      setProgress(0);
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <>
      {/* ✅ JSON-LD for AI + SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="pt-15 pb-15 px-4 md:px-6 relative w-full min-h-screen flex flex-col items-center bg-slate-50/50">
        {/* background blobs (brand style) */}
        <div className="fixed top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full mix-blend-multiply filter blur-[100px] animate-blob -z-10 transition-colors duration-700 bg-blue-200/30"></div>
        <div className="fixed bottom-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 -z-10 transition-colors duration-700 bg-cyan-200/30"></div>

        <div className="w-full max-w-3xl z-10">
          {/* header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Protect <span className="text-blue-600">PDF</span> Hub
            </h1>
            <p className="text-slate-500 mt-3 text-base md:text-lg font-medium max-w-2xl mx-auto">
              Add password protection to your PDF (AES-256). Secure processing with auto-delete.
            </p>
          </div>

          {/* main card */}
          <div className="w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-12 md:pt-5 shadow-2xl ring-1 border border-white/40 transition-colors duration-500 shadow-blue-500/10 ring-white/60">
            {/* Upload */}
            {!file && (
              <label className="h-64 md:h-72 rounded-3xl flex flex-col items-center justify-center relative hover:bg-white/80 transition-all duration-500 cursor-pointer group border-3 border-dashed bg-slate-50/50 border-slate-300 hover:border-blue-500/50">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-slate-100 text-blue-500">
                  <Upload className="w-10 h-10" />
                </div>

                <h3 className="text-slate-900 font-bold text-xl md:text-2xl mb-1">
                  Select PDF File
                </h3>
                <p className="text-slate-500 font-medium text-sm md:text-base">
                  Add a password to open your PDF
                </p>
              </label>
            )}

            {/* Form */}
            {file && !isDone && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                {/* file row */}
                <div className="flex justify-between items-center mb-8 px-2 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0 bg-blue-50 text-blue-500">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 truncate max-w-[150px] md:max-w-[300px] text-base md:text-lg">
                        {file.name}
                      </p>
                      <p className="text-sm text-slate-500 font-bold mt-0.5">
                        {formatBytes(originalSize)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={resetAll}
                    className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
                    aria-label="Remove file"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* info box */}
                {!isWorking && (
                  <div className="mb-6 p-4 rounded-2xl flex items-start gap-4 border transition-colors duration-300 bg-blue-50 border-blue-100">
                    <div className="p-2 rounded-lg bg-white/50 text-blue-600 shrink-0">
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider mb-1 text-blue-700">
                        AES-256 Protection
                      </p>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        This will require a password to open the PDF. Keep your password safe — it cannot be recovered.
                      </p>
                    </div>
                  </div>
                )}

                {/* password inputs */}
                {!isWorking && (
                  <>
                    <div className="mb-4 px-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                          Password
                        </label>
                        <div className="mt-2 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-3">
                          <Lock className="w-5 h-5 text-blue-600" />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full outline-none text-slate-800 font-semibold"
                            autoComplete="new-password"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                          Confirm
                        </label>
                        <div className="mt-2 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-3">
                          <ShieldCheck className="w-5 h-5 text-blue-600" />
                          <input
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="Confirm password"
                            className="w-full outline-none text-slate-800 font-semibold"
                            autoComplete="new-password"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Strength + Suggestion */}
                    <div className="px-2 mb-6 flex items-center justify-between gap-3">
                      <p className={`text-sm font-bold ${strength.color}`}>
                        Strength: {strength.label}
                      </p>

                      <button
                        type="button"
                        onClick={suggestPassword}
                        className="text-xs font-bold px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
                      >
                        Suggest Strong Password
                      </button>
                    </div>
                  </>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium flex gap-2">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {isWorking && (
                  <div className="mb-8 px-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>Encrypting...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                      <div
                        className="h-full transition-all duration-300 rounded-full relative overflow-hidden bg-blue-500"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* actions */}
                <div className="flex gap-4 pt-4 border-t border-slate-100 px-2">
                  <button
                    onClick={resetAll}
                    disabled={isWorking}
                    className="px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50 text-sm cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={protectPdf}
                    disabled={isWorking}
                    className="flex-1 py-4 text-white font-bold text-lg rounded-xl shadow-xl transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2 cursor-pointer active:scale-95 bg-blue-600 shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1"
                  >
                    {isWorking ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" /> Processing...
                      </>
                    ) : (
                      "Protect Now"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Done */}
            {isDone && (
              <div className="animate-in zoom-in duration-500 text-center py-6">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-white ring-4 ring-green-50">
                  <CheckCircle className="w-12 h-12" />
                </div>

                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Ready!</h2>
                <p className="text-slate-500 mb-8 text-lg">
                  Your PDF is password protected successfully.
                </p>

                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-sm gap-4 md:gap-0">
                  <div className="text-center z-10 w-full md:w-auto">
                    <p className="text-xs font-bold uppercase text-slate-400 mb-1 tracking-wider">
                      Original
                    </p>
                    <p className="text-lg md:text-xl font-bold text-slate-600">
                      {formatBytes(originalSize)}
                    </p>
                  </div>

                  <div className="text-slate-300 text-3xl z-10 rotate-90 md:rotate-0">➜</div>

                  <div className="text-center z-10 w-full md:w-auto">
                    <p className="text-xs font-bold uppercase text-green-600 mb-1 tracking-wider">
                      Protected
                    </p>
                    <p className="text-3xl md:text-4xl font-black text-green-600">
                      {formatBytes(protectedSize)}
                    </p>
                  </div>

                  <div className="absolute right-0 top-0 bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
                    AES-256
                  </div>
                </div>

                <div className="flex flex-col gap-3 px-2">
                  <a
                    href={downloadUrl}
                    download={`protected_${file?.name}`}
                    className="w-full py-4 text-white font-bold text-xl rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 hover:-translate-y-1 cursor-pointer active:scale-95 bg-blue-600 shadow-blue-500/30 hover:bg-blue-700"
                  >
                    Download PDF
                    <Download className="w-6 h-6" />
                  </a>

                  <button
                    onClick={resetAll}
                    className="w-full py-3 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors cursor-pointer hover:bg-slate-50 rounded-xl"
                  >
                    Protect Another PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* bottom sections */}
        <div className="max-w-4xl w-full mt-24 space-y-20 px-4 pb-10">
          <section className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase mb-12 tracking-tight">
              How to Protect PDF?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-4 text-center">
                <div className="text-2xl font-bold text-blue-600">01.</div>
                <h4 className="font-bold text-slate-800 uppercase text-sm">Upload File</h4>
                <p className="text-slate-500 text-sm font-medium">
                  Select the PDF you want to lock.
                </p>
              </div>
              <div className="space-y-4 text-center">
                <div className="text-2xl font-bold text-blue-600">02.</div>
                <h4 className="font-bold text-slate-800 uppercase text-sm">Set Password</h4>
                <p className="text-slate-500 text-sm font-medium">
                  Enter a password and confirm it.
                </p>
              </div>
              <div className="space-y-4 text-center">
                <div className="text-2xl font-bold text-blue-600">03.</div>
                <h4 className="font-bold text-slate-800 uppercase text-sm">Download</h4>
                <p className="text-slate-500 text-sm font-medium">
                  Download your protected PDF instantly.
                </p>
              </div>
            </div>
          </section>

          {/* ✅ FAQ section for SEO */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm text-left space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase tracking-tight">
              FAQs
            </h2>

            <div className="space-y-4 text-slate-600 text-sm md:text-base font-medium">
              <div>
                <p className="font-bold text-slate-900">Is Protect PDF free?</p>
                <p>Yes. You can password-protect PDFs for free.</p>
              </div>
              <div>
                <p className="font-bold text-slate-900">What encryption is used?</p>
                <p>We use AES-256 encryption for strong protection.</p>
              </div>
              <div>
                <p className="font-bold text-slate-900">Can I recover a forgotten password?</p>
                <p>No. If you forget the password, the PDF cannot be opened.</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase tracking-tight text-center">
              Fast & Secure Processing
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-2xl mx-auto text-center">
              At PDF Machine, privacy is our mission. All transfers are encrypted and your documents are automatically deleted after 60 minutes.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
