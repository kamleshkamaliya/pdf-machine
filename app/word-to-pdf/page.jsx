"use client";

import { useState } from "react";
import { 
  FileText, UploadCloud, Loader2, Download, CheckCircle, AlertCircle, 
  LayoutTemplate, Shield, Zap, FileType, ChevronDown, X 
} from "lucide-react";

// --- FAQ Component (Aapke Design Wala) ---
function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0 transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 md:py-6 flex items-center justify-between text-left cursor-pointer group"
      >
        <span className={`text-[15px] md:text-[17px] font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-[#ff3b1d]' : 'text-slate-800 group-hover:text-slate-900'}`}>
          {question}
        </span>
        
        <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-orange-50 text-[#ff3b1d] rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
           <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-slate-500 font-medium leading-relaxed text-[14px] md:text-[16px] max-w-[95%]">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function WordToPdfPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      if (
        selectedFile.type === "application/msword" ||
        selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile);
        setError("");
        setDownloadUrl("");
      } else {
        setError("Please upload a valid Word file (.doc or .docx)");
        setFile(null);
      }
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => { setIsDragging(false); };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/word-to-pdf", { method: "POST", body: formData });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Conversion failed");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setFileName(file.name.replace(/\.[^/.]+$/, "") + ".pdf");
    } catch (err) {
      setError("Failed to convert file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight">
            Word to PDF Converter
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed text-[13px] md:text-[15px]">
            Make your DOC and DOCX files easy to read and share. 
            Convert them to PDF instantly while preserving the original layout.
          </p>

          {/* Tool Card */}
          <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative z-10">
            <div className="p-8">
              {!downloadUrl ? (
                <>
                  {!file ? (
                    <label 
                      onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                      className={`flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer group
                        ${isDragging ? "border-[#ff3b1d] bg-orange-50/50" : "border-slate-200 bg-slate-50/50 hover:bg-orange-50/30 hover:border-[#ff3b1d]/50"}
                      `}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        <div className="p-5 bg-white rounded-2xl shadow-sm mb-5 group-hover:scale-110 transition-transform text-[#ff3b1d]">
                          <UploadCloud size={42} />
                        </div>
                        <p className="text-xl font-bold text-slate-800 mb-2">Click to upload or drag & drop</p>
                        <p className="text-sm text-slate-500 font-medium">Supports DOC & DOCX</p>
                      </div>
                      <input type="file" className="hidden" accept=".doc,.docx" onChange={(e) => handleFileChange(e.target.files[0])} />
                    </label>
                  ) : (
                    <div className="space-y-6 text-left">
                      <div className="flex items-center gap-4 p-5 bg-orange-50/50 rounded-2xl border border-orange-100">
                        <div className="p-3 bg-white text-[#ff3b1d] rounded-xl shadow-sm">
                          <FileText size={28} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate text-lg">{file.name}</p>
                          <p className="text-sm text-slate-500 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button 
                          onClick={() => setFile(null)} 
                          className="p-2 text-slate-400 hover:text-[#ff3b1d] hover:bg-orange-100/50 rounded-full transition-all"
                        >
                          <X size={22} strokeWidth={2.5} />
                        </button>
                      </div>

                      <button
                        onClick={handleConvert} disabled={loading}
                        className="w-full py-5 bg-[#ff3b1d] hover:bg-[#e6351a] text-white font-bold text-xl rounded-2xl shadow-xl shadow-[#ff3b1d]/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? <><Loader2 className="animate-spin" size={24} /> Converting...</> : <>Convert to PDF <Zap size={24} /></>}
                      </button>
                    </div>
                  )}
                  {error && <div className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 font-medium"><AlertCircle size={18} /> {error}</div>}
                </>
              ) : (
                <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-full mb-6 ring-8 ring-green-50"><CheckCircle size={48} /></div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-3 text-[14px] md:text-[16px]">File Converted!</h2>
                  <div className="flex flex-col gap-3">
                    <a href={downloadUrl} download={fileName} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 transition-all"><Download size={24} /> Download PDF</a>
                    <button onClick={() => { setFile(null); setDownloadUrl(""); }} className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg rounded-xl transition-all">Convert Another File</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-16 uppercase tracking-tighter text-[#ff3b1d]">Why Choose Our Tool?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="w-16 h-16 bg-orange-100 text-[#ff3b1d] rounded-2xl flex items-center justify-center mb-6"><LayoutTemplate size={32} /></div>
              <h3 className="text-xl font-bold mb-3">Keeps Formatting Intact</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-[13px] md:text-[15px]">Our technology ensures your fonts, images, and layout remain exactly as they were in the Word document.</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="w-16 h-16 bg-orange-100 text-[#ff3b1d] rounded-2xl flex items-center justify-center mb-6"><Shield size={32} /></div>
              <h3 className="text-xl font-bold mb-3">100% Secure & Private</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-[13px] md:text-[15px]">Privacy is our top priority. Files are processed securely and deleted automatically after conversion.</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="w-16 h-16 bg-orange-100 text-[#ff3b1d] rounded-2xl flex items-center justify-center mb-6"><FileType size={32} /></div>
              <h3 className="text-xl font-bold mb-3">DOC & DOCX Support</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-[13px] md:text-[15px]">Whether it's an old .doc file or a new .docx file, we convert them all to high-quality PDF documents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Convert Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">How to Convert Word to PDF?</h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[#ff3b1d] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-[#ff3b1d]/20">1</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload your file</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-[13px] md:text-[15px]">Drag and drop your Microsoft Word document into the box above, or click to select a file from your device.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[#ff3b1d] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-[#ff3b1d]/20">2</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Wait for conversion</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-[13px] md:text-[15px]">Our tool automatically converts your file while preserving the original layout. It usually takes less than 5 seconds.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[#ff3b1d] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-[#ff3b1d]/20">3</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Download PDF</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-[13px] md:text-[15px]">Once processed, click the Download button to save your new PDF file to your computer or mobile.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-12 text-center tracking-tight">Frequently Asked Questions</h2>
          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-[0_10px_50px_rgba(0,0,0,0.03)] border border-slate-50">
             <FaqItem question="1. Is this Word to PDF converter free?" answer="Yes! PDF Machine is completely free to use. You can convert unlimited Word documents without paying a single cent." />
             <FaqItem question="2. Will my formatting get messed up?" answer="No. We use advanced engines (Adobe & LibreOffice) to ensure your PDF looks exactly like your Word document." />
             <FaqItem question="3. Is it safe to upload my private documents?" answer="Absolutely. Files are processed securely and are automatically deleted shortly after conversion." />
             <FaqItem question="4. Does this work on Mobile phones?" answer="Yes! Our platform is fully responsive and works perfectly on iPhone, Android, and tablets." />
          </div>
        </div>
      </section>
    </div>
  );
}