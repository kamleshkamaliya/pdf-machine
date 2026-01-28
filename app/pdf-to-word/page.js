"use client";

import { useState } from 'react';
import { FileText, Loader2, CheckCircle, X, CloudUpload, FileOutput, ScanLine, Layers, Clock, AlertTriangle } from 'lucide-react';

export default function PdfToWordPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  // --- HANDLERS ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type !== 'application/pdf') {
        alert("Only PDF files are allowed.");
        return;
      }

      setFile(selectedFile);
      setError(null);
      setDownloadUrl(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setDownloadUrl(null);
    setError(null);
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await fetch('/api/pdf-to-word', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
         const errData = await response.json();
         if (errData.error.includes("PAGE_LIMIT_ERROR")) {
             throw new Error("⚠️ Too many pages! Please upload a PDF with only 1 or 2 pages.");
         }
         throw new Error(errData.error || "Conversion failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 md:px-6 relative w-full min-h-screen flex flex-col items-center bg-slate-50/50">
      
      {/* Animated Background Blobs */}
      <div className="fixed top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-200/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-red-200/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 -z-10"></div>

      <div className="w-full max-w-3xl z-10">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-10 px-2">
           <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
             PDF to Word
           </h1>
           <p className="text-slate-500 mt-3 text-base md:text-lg font-medium max-w-2xl mx-auto">
             For best results, upload 1-2 page documents.
           </p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white/90 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 md:pt-5 shadow-2xl shadow-orange-500/10 ring-1 ring-white/60 border border-white/40">
          
          {/* STATE 1: UPLOAD AREA */}
          {!file && (
            <label className="h-64 rounded-3xl flex flex-col items-center justify-center relative hover:bg-white/80 transition-all duration-500 cursor-pointer group border-3 border-dashed border-slate-300 hover:border-[#FF3B1D]/50 bg-slate-50/50">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-3xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 text-[#FF3B1D] border border-slate-100">
                 <CloudUpload className="w-8 h-8" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg md:text-xl mb-1">Select PDF File</h3>
              <p className="text-slate-500 font-medium text-xs md:text-sm">Max 2 Pages Allowed</p>
            </label>
          )}

          {/* STATE 2: FILE SELECTED & ACTIONS */}
          {file && !downloadUrl && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              
              {/* File Info Bar */}
              <div className="bg-white border border-slate-200 p-3 md:p-4 rounded-2xl shadow-sm flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 text-[#FF3B1D] rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs md:text-sm font-bold text-slate-700 truncate max-w-[150px] md:max-w-[250px]">{file.name}</p>
                        <p className="text-[10px] md:text-xs text-slate-400 font-bold">{(file.size / (1024*1024)).toFixed(2)} MB</p>
                    </div>
                 </div>
                 <button onClick={removeFile} disabled={loading} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors cursor-pointer shrink-0">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200 font-bold flex items-center gap-3 animate-pulse">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0"/> 
                      <span className="flex-1">{error}</span>
                  </div>
              )}

              {/* LOADING UI (ORANGE BOX RESTORED) */}
              {loading ? (
                <div className="w-full bg-orange-50/80 border-2 border-orange-100 rounded-2xl p-6 md:p-8 text-center animate-pulse relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
                    <div className="flex justify-center mb-4">
                        <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-[#FF3B1D] animate-spin relative z-10" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 tracking-tight">Analyzing Document...</h3>
                    <p className="text-slate-400 text-xs mt-4 font-medium uppercase tracking-widest">Checking layout & font data</p>
                </div>
              ) : (
                <button 
                  onClick={handleConvert} 
                  className="w-full py-4 bg-[#FF3B1D] hover:bg-orange-600 text-white font-bold text-lg rounded-xl shadow-xl shadow-orange-500/20 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Convert to Word
                </button>
              )}
            </div>
          )}

          {/* STATE 3: SUCCESS */}
          {downloadUrl && (
             <div className="text-center py-6 animate-in zoom-in duration-300">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
                  <CheckCircle className="w-10 h-10 md:w-12 md:h-12" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Success!</h2>
                <p className="text-slate-500 mb-8 text-sm md:text-base font-medium">Your Word document is ready.</p>
                
                <a 
                  href={downloadUrl} 
                  download={file ? file.name.replace('.pdf', '.docx') : 'converted.docx'} 
                  className="w-full py-4 bg-[#FF3B1D] hover:bg-orange-600 text-white font-bold text-lg md:text-xl rounded-xl shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                    Download Word File
                </a>
                
                <button onClick={removeFile} className="w-full py-3 text-slate-400 hover:text-slate-600 font-bold text-sm mt-4 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors">
                    Convert Another File
                </button>
             </div>
          )}

        </div>
      </div>
      
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}