"use client";

import { useState } from "react";
import { Lock, Unlock, FileText, Loader2, Download, ShieldCheck, Zap, EyeOff, CheckCircle2, HelpCircle, ChevronDown } from "lucide-react";

// --- FAQ Item Component ---
function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0 transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 md:py-6 flex items-center justify-between text-left cursor-pointer group"
      >
        <span className={`text-[14px] md:text-[16px] font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-[#FF3B1D]' : 'text-slate-800 group-hover:text-slate-900'}`}>
          {question}
        </span>
        
        <div className={`p-1.5 rounded-full transition-all duration-300 ${isOpen ? 'bg-orange-50 text-[#FF3B1D] rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
           <ChevronDown className="w-4 h-4" />
        </div>
      </button>
      
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-slate-500 font-medium leading-relaxed text-[13px] md:text-[15px] max-w-[90%]">
          {answer}
        </p>
      </div>
    </div>
  );
}

// --- Main Client Component ---
export default function UnlockPDFClient() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
      setDownloadUrl("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!file || !password) return setError("File and password are required.");

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Incorrect password or the file is already unlocked.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-2xl mb-4 shadow-sm">
            <Unlock size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 md:text-5xl tracking-tight">
            Unlock PDF Online
          </h1>
          <p className="text-slate-600 mt-4 text-lg max-w-2xl mx-auto">
            Remove passwords, decryption, and security restrictions from your PDF documents instantly without losing any data quality.
          </p>
        </div>

        {/* Main Tool Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden mb-16">
          {!downloadUrl ? (
            <div className="p-8">
              {!file ? (
                <label className="group relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50 hover:bg-white hover:border-red-400 transition-all cursor-pointer">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-5 bg-white rounded-2xl shadow-md group-hover:scale-110 transition-transform mb-4 border border-slate-100">
                      <FileText className="text-red-500" size={36} />
                    </div>
                    <p className="text-lg text-slate-700 font-bold mb-1">Click to upload or drag & drop</p>
                    <p className="text-sm text-slate-400 font-medium tracking-wide">Secure PDF Upload (Max 20MB)</p>
                  </div>
                  <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                      <p className="text-xs text-slate-400 font-semibold">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button onClick={() => setFile(null)} className="px-3 py-1 text-xs font-bold text-red-500 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors">Change</button>
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Secure Password Authentication</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="password"
                        placeholder="Enter PDF password to decrypt..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold focus:ring-4 focus:ring-red-50 outline-none border-focus:border-red-400 transition-all text-slate-800"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleUnlock}
                    disabled={loading}
                    className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Unlock size={22} />}
                    {loading ? "Decrypting File..." : "Remove Password"}
                  </button>
                </div>
              )}

              {error && <div className="mt-6 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl animate-shake">
                <span className="text-red-600 font-bold mt-0.5">⚠️</span>
                <p className="text-sm font-bold text-red-600">{error}</p>
              </div>}
            </div>
          ) : (
            <div className="p-12 text-center animate-in zoom-in duration-500">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-full mb-8 ring-8 ring-green-50">
                <ShieldCheck size={48} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Decryption Successful!</h2>
              <p className="text-slate-500 text-lg mb-10 font-medium">Your PDF is now unlocked and ready for use.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={downloadUrl}
                  download={`unlocked-${file?.name}`}
                  className="px-10 py-5 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 transition-all text-lg hover:-translate-y-1"
                >
                  <Download size={22} /> Download PDF
                </a>
                <button
                  onClick={() => { setFile(null); setDownloadUrl(""); setPassword(""); }}
                  className="px-10 py-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition-all text-lg"
                >
                  Process Another
                </button>
              </div>
            </div>
          )}
        </div>

        {/* HOW IT WORKS */}
        <div className="mb-20">
          <h2 className="text-2xl font-black text-center text-slate-900 mb-10 tracking-tight">How to Unlock Password Protected PDF</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload PDF", desc: "Select the password-protected PDF file from your device or drag it into the box.", icon: <FileText /> },
              { step: "02", title: "Enter Password", desc: "Type the current password of the PDF file to allow our system to decrypt it.", icon: <Lock /> },
              { step: "03", title: "Download", desc: "Click the download button to save your unlocked PDF without any restrictions.", icon: <Download /> },
            ].map((item, idx) => (
              <div key={idx} className="relative p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
                <span className="absolute top-4 left-4 text-4xl font-black text-slate-100 select-none">{item.step}</span>
                <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-2xl mb-4 relative z-10">
                  {item.icon}
                </div>
                <h3 className="font-black text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* KEY BENEFITS */}
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 mb-20 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-red-600/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-12 text-center md:text-left">Why Choose PDF Machine to Unlock Files?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex gap-5">
                <div className="shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-red-400">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Blazing Fast Speed</h4>
                  <p className="text-slate-400 leading-relaxed">Our advanced cloud decryption technology removes restrictions in seconds, no matter how complex the encryption.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-red-400">
                  <EyeOff size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Privacy First Policy</h4>
                  <p className="text-slate-400 leading-relaxed">Your files are encrypted during transit and automatically deleted from our servers after processing. We never store your data.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-red-400">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">All Restrictions Removed</h4>
                  <p className="text-slate-400 leading-relaxed">Say goodbye to "Print Disabled" or "Edit Locked" messages. Get full access to your PDF content instantly.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-red-400">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">No Quality Loss</h4>
                  <p className="text-slate-400 leading-relaxed">We unlock the file structure without altering images, fonts, or formatting. Your PDF stays perfect.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-10 flex items-center justify-center gap-3">
            <HelpCircle className="text-[#FF3B1D]" /> Frequently Asked Questions
          </h2>
          
          <div className="bg-white rounded-[2.5rem] p-4 md:p-10 shadow-[0_10px_50px_rgba(0,0,0,0.03)] border border-slate-50">
            <FaqItem 
              question="Is it safe to unlock my PDF here?" 
              answer="Yes. PDF Machine uses SSL encryption and automated deletion protocols. Your files are processed securely and are never stored on our servers permanently." 
            />
            <FaqItem 
              question="Do I need to install any software to remove PDF passwords?" 
              answer="No, our tool is 100% web-based. You can remove PDF passwords on Chrome, Safari, or Firefox without downloading any third-party software." 
            />
            <FaqItem 
              question="Can I unlock a PDF if I don't know the password?" 
              answer="To remove encryption and restrictions, you must provide the correct current password. We prioritize document security and do not support unauthorized password cracking." 
            />
            <FaqItem 
              question="Will unlocking a PDF affect its original quality?" 
              answer="Absolutely not. Our decryption process only removes the security layer. Your text, images, and formatting will remain exactly as they were in the original file." 
            />
            <FaqItem 
              question="Can I unlock password-protected PDFs on my mobile?" 
              answer="Yes! PDF Machine is fully optimized for mobile devices. You can upload, decrypt, and download PDFs directly from your iPhone, iPad, or Android device." 
            />
          </div>
        </div>
      </div>
    </div>
  );
}