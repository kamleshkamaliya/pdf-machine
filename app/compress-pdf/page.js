"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Upload, FileText, Download, Loader2, CheckCircle, X, Zap, FileCheck, Info, AlertTriangle } from 'lucide-react';

export default function CompressPDFHub() {
  // --- GLOBAL STATE ---
  const [activeTab, setActiveTab] = useState("client");
  const [file, setFile] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  // --- CLIENT SIDE STATE ---
  const [quality, setQuality] = useState(0.6); 
  const [progress, setProgress] = useState(0);
  
  // --- 🛠️ WORKER SETUP (STABLE VERSION) ---
  useEffect(() => {
    const initPdfJs = async () => {
      try {
        // Humne ab version 3.11.174 fix kar diya hai, to worker bhi wahi use karega
        const pdfJS = await import('pdfjs-dist/build/pdf');
        pdfJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
      } catch (error) {
        console.error("Worker Error:", error);
      }
    };
    initPdfJs();
  }, []);

  // --- HANDLERS ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setCompressedSize(0);
      setProgress(0);
      setIsDone(false);
      setDownloadUrl(null);
      setError(null);
      setQuality(0.6);
    } else {
      alert("Please select a PDF file.");
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const resetAll = () => {
    setFile(null);
    setIsDone(false);
    setDownloadUrl(null);
    setProgress(0);
    setQuality(0.6);
    setError(null);
  };

  // --- ADVICE TEXT ---
  const getCompressionAdvice = (val) => {
    if (val <= 0.3) return { 
        title: "Max Compression", 
        desc: "Tiny file size. Text might be blurry.",
        color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100"
    };
    if (val > 0.3 && val <= 0.7) return { 
        title: "Balanced (Recommended)", 
        desc: "Best for Emails & WhatsApp.",
        color: "text-green-600", bg: "bg-green-50", border: "border-green-100"
    };
    return { 
        title: "High Quality", 
        desc: "Good for printing. Low compression.",
        color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100"
    };
  };

  // --- LOGIC: COMPRESSION ---
  const compressClientSide = async () => {
    if (!file) return;
    setIsCompressing(true);
    setProgress(5);
    setError(null);

    try {
      const pdfJS = await import('pdfjs-dist/build/pdf');
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfJS.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;

      let newPdf = null;

      for (let i = 1; i <= totalPages; i++) {
        setProgress(Math.round((i / totalPages) * 100));
        
        const page = await pdf.getPage(i);
        let scale = quality > 0.7 ? 1.5 : (quality < 0.4 ? 0.8 : 1.0); 

        const viewport = page.getViewport({ scale: scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        const imgData = canvas.toDataURL("image/jpeg", quality);
        
        const imgWidth = viewport.width;
        const imgHeight = viewport.height;
        const orientation = imgWidth > imgHeight ? 'l' : 'p'; 

        if (i === 1) {
            newPdf = new jsPDF({ orientation: orientation, unit: 'px', format: [imgWidth, imgHeight] });
            newPdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
        } else {
            newPdf.addPage([imgWidth, imgHeight], orientation);
            newPdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
        }
      }

      const pdfBlob = newPdf.output("blob");
      setCompressedSize(pdfBlob.size);
      setDownloadUrl(URL.createObjectURL(pdfBlob));
      setIsDone(true);

    } catch (error) {
      console.error("Client Error:", error);
      setError("Browser compression failed. Try standard mode.");
    }
    setIsCompressing(false);
  };

  const compressServerSide = async () => {
    if (!file) return;
    setIsCompressing(true);
    setProgress(50); 
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/compress', { method: 'POST', body: formData });
      if (!response.ok) throw new Error("Optimization Failed");

      const blob = await response.blob();
      setCompressedSize(blob.size);
      setDownloadUrl(window.URL.createObjectURL(blob));
      setIsDone(true);
      setProgress(100);

    } catch (err) {
      console.error("Server Error", err);
      setError("Server optimization failed.");
    } finally {
      setIsCompressing(false);
    }
  };

  const advice = getCompressionAdvice(quality);

  return (
    <>
      {/* 🌐 SEO TITLES & META (Naya kaam) */}
      <title>Compress PDF Online - 100% Free & Secure | PDF MACHINE</title>
      <meta name="description" content="Reduce your PDF file size instantly without losing quality. Secure, fast, and no registration required. 100% private document processing." />

      <div className="pt-15 pb-15 px-4 md:px-6 relative w-full min-h-screen flex flex-col items-center bg-slate-50/50">
        
        <div className={`fixed top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full mix-blend-multiply filter blur-[100px] animate-blob -z-10 transition-colors duration-700 ${activeTab === 'client' ? 'bg-orange-200/30' : 'bg-blue-200/30'}`}></div>
        <div className={`fixed bottom-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 -z-10 transition-colors duration-700 ${activeTab === 'client' ? 'bg-red-200/30' : 'bg-cyan-200/30'}`}></div>

        <div className="w-full max-w-3xl z-10">
          
          <div className="text-center mb-8 md:mb-12">
             <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
               Compress <span className="text-[#FF3B1D]">PDF</span> Hub
             </h1>
             <p className="text-slate-500 mt-3 text-base md:text-lg font-medium max-w-2xl mx-auto">
               Reduce file size securely. Select the mode that fits your needs.
             </p>
          </div>

          {/* TABS */}
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row relative">
              <button 
                  onClick={() => { setActiveTab('client'); resetAll(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer relative z-10 
                  ${activeTab === 'client' ? 'text-[#FF3B1D] bg-orange-50 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                  <Zap className="w-4 h-4" />
                  Strong Compression
                  {activeTab === 'client' && <span className="absolute -top-2 -right-2 bg-[#FF3B1D] text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">Smallest</span>}
              </button>
              <button 
                  onClick={() => { setActiveTab('server'); resetAll(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer relative z-10 
                  ${activeTab === 'server' ? 'text-blue-600 bg-blue-50 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                  <FileCheck className="w-4 h-4" />
                  Standard Optimization
                  {activeTab === 'server' && <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">Cleaner</span>}
              </button>
          </div>

          {/* MAIN CARD */}
          <div className={`w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-12 md:pt-5 shadow-2xl ring-1 border border-white/40 transition-colors duration-500
              ${activeTab === 'client' ? 'shadow-orange-500/10 ring-white/60' : 'shadow-blue-500/10 ring-white/60'}`}>
            
            {/* STATE 1: UPLOAD */}
            {!file && (
              <label className={`h-64 md:h-72 rounded-3xl flex flex-col items-center justify-center relative hover:bg-white/80 transition-all duration-500 cursor-pointer group border-3 border-dashed bg-slate-50/50
                  ${activeTab === 'client' ? 'border-slate-300 hover:border-[#FF3B1D]/50' : 'border-slate-300 hover:border-blue-500/50'}`}>
                
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                
                <div className={`w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-slate-100
                    ${activeTab === 'client' ? 'text-[#FF3B1D]' : 'text-blue-500'}`}>
                   <Upload className="w-10 h-10" />
                </div>
                
                <h3 className="text-slate-900 font-bold text-xl md:text-2xl mb-1">Select PDF File</h3>
                <p className="text-slate-500 font-medium text-sm md:text-base">
                    {activeTab === 'client' ? "Best for Scanned Docs" : "Best for Invoices & Resumes"}
                </p>
              </label>
            )}

            {/* STATE 2: CONTROLS */}
            {file && !isDone && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                
                {/* File Info */}
                <div className="flex justify-between items-center mb-8 px-2 border-b border-slate-100 pb-5">
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0
                          ${activeTab === 'client' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                         <FileText className="w-6 h-6" />
                      </div>
                      <div>
                          <p className="font-bold text-slate-900 truncate max-w-[150px] md:max-w-[300px] text-base md:text-lg">{file.name}</p>
                          <p className="text-sm text-slate-500 font-bold mt-0.5">{formatBytes(originalSize)}</p>
                      </div>
                   </div>
                   <button onClick={resetAll} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-all cursor-pointer">
                    <X className="w-6 h-6" />
                   </button>
                </div>

                {/* DYNAMIC ADVICE BOX */}
                {activeTab === 'client' && !isCompressing && (
                    <div className={`mb-6 p-4 rounded-2xl flex items-start gap-4 border transition-colors duration-300 ${advice.bg} ${advice.border}`}>
                       <div className={`p-2 rounded-lg bg-white/50 ${advice.color} shrink-0`}>
                        <Info className="w-5 h-5" />
                       </div>
                       <div>
                        <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${advice.color}`}>
                            {advice.title}
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {advice.desc}
                        </p>
                       </div>
                    </div>
                )}

                {/* SLIDER */}
                {!isCompressing && activeTab === 'client' && (
                  <div className="mb-10 px-2">
                     <div className="flex justify-between items-end mb-5">
                       <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Compression Level</span>
                       <div className="bg-slate-900 px-3 py-1 rounded-lg text-white font-bold text-sm shadow-md">
                         {Math.round(quality * 100)}%
                       </div>
                     </div>
                     <input 
                       type="range" min="0.1" max="1.0" step="0.1" 
                       value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))}
                       className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#FF3B1D] hover:accent-orange-600"
                     />
                     <div className="flex justify-between mt-3 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
                       <span className={quality <= 0.3 ? "text-[#FF3B1D]" : ""}>Max</span>
                       <span className={quality > 0.3 && quality <= 0.7 ? "text-[#FF3B1D]" : ""}>Balanced</span>
                       <span className={quality > 0.7 ? "text-[#FF3B1D]" : ""}>Low</span>
                     </div>
                  </div>
                )}

                {/* MESSAGE SERVER */}
                {!isCompressing && activeTab === 'server' && (
                  <div className="mb-10 px-2 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 items-start">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
                          <Zap className="w-5 h-5" />
                      </div>
                      <div>
                          <h4 className="font-bold text-blue-900 text-sm">Smart Engine</h4>
                          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                              Auto-optimizes structure. 
                              <span className="italic opacity-80 block mt-1">*Size reduction is calculated after processing.*</span>
                          </p>
                      </div>
                  </div>
                )}

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium flex gap-2">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0"/> {error}
                    </div>
                )}

                {/* PROGRESS */}
                {isCompressing && (
                  <div className="mb-8 px-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>Processing...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                      <div className={`h-full transition-all duration-300 rounded-full relative overflow-hidden ${activeTab === 'client' ? 'bg-[#FF3B1D]' : 'bg-blue-500'}`} style={{ width: `${progress}%` }}>
                         <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex gap-4 pt-4 border-t border-slate-100 px-2">
                   <button onClick={resetAll} disabled={isCompressing} className="px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50 text-sm cursor-pointer">
                     Cancel
                   </button>
                   <button 
                      onClick={activeTab === 'client' ? compressClientSide : compressServerSide}
                      disabled={isCompressing}
                      className={`flex-1 py-4 text-white font-bold text-lg rounded-xl shadow-xl transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2 cursor-pointer active:scale-95
                      ${activeTab === 'client' 
                          ? 'bg-[#FF3B1D] shadow-orange-500/20 hover:bg-orange-600 hover:-translate-y-1' 
                          : 'bg-blue-600 shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1'}`}
                    >
                      {isCompressing ? (
                          <> <Loader2 className="animate-spin w-5 h-5"/> Processing... </>
                      ) : (
                          activeTab === 'client' ? "Compress Now" : "Optimize Now"
                      )}
                   </button>
                </div>
              </div>
            )}

            {/* STATE 3: RESULT */}
            {isDone && (
               <div className="animate-in zoom-in duration-500 text-center py-6">
                  
                  <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-white ring-4 ring-green-50">
                    <CheckCircle className="w-12 h-12" />
                  </div>

                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Ready!</h2>
                  <p className="text-slate-500 mb-8 text-lg">File optimized successfully.</p>

                  <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-sm gap-4 md:gap-0">
                     <div className="text-center z-10 w-full md:w-auto">
                        <p className="text-xs font-bold uppercase text-slate-400 mb-1 tracking-wider">Original</p>
                        <p className="text-lg md:text-xl font-bold text-slate-600 line-through decoration-red-400/50">{formatBytes(originalSize)}</p>
                     </div>
                     <div className="text-slate-300 text-3xl z-10 rotate-90 md:rotate-0">➜</div>
                     <div className="text-center z-10 w-full md:w-auto">
                        <p className="text-xs font-bold uppercase text-green-600 mb-1 tracking-wider">New Size</p>
                        <p className="text-3xl md:text-4xl font-black text-green-600">{formatBytes(compressedSize)}</p>
                     </div>
                     <div className="absolute right-0 top-0 bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
                       SAVED {Math.round(((originalSize - compressedSize) / originalSize) * 100)}%
                     </div>
                  </div>

                  <div className="flex flex-col gap-3 px-2">
                     <a 
                       href={downloadUrl} 
                       download={`optimized_${activeTab}_${file.name}`}
                       className={`w-full py-4 text-white font-bold text-xl rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 hover:-translate-y-1 cursor-pointer active:scale-95
                       ${activeTab === 'client' 
                          ? 'bg-[#FF3B1D] shadow-orange-500/30 hover:bg-orange-600' 
                          : 'bg-blue-600 shadow-blue-500/30 hover:bg-blue-700'}`}
                     >
                       Download PDF
                       <Download className="w-6 h-6" />
                     </a>
                     
                     <button onClick={resetAll} className="w-full py-3 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors cursor-pointer hover:bg-slate-50 rounded-xl">
                       Compress Another PDF
                     </button>
                  </div>

               </div>
            )}
          </div>
        </div>

        {/* 🟠 EXTRA SEO SECTIONS (Naya kaam) */}
        <div className="max-w-4xl w-full mt-24 space-y-20 px-4 pb-10">
          <section className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase mb-12 tracking-tight">How to Compress PDF?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="space-y-4 text-center">
                      <div className="text-2xl font-bold text-[#FF3B1D]">01.</div>
                      <h4 className="font-bold text-slate-800 uppercase text-sm">Upload File</h4>
                      <p className="text-slate-500 text-sm font-medium">Select the PDF file you wish to optimize from your computer or mobile device.</p>
                  </div>
                  <div className="space-y-4 text-center">
                      <div className="text-2xl font-bold text-[#FF3B1D]">02.</div>
                      <h4 className="font-bold text-slate-800 uppercase text-sm">Choose Level</h4>
                      <p className="text-slate-500 text-sm font-medium">Select between Strong Compression or Standard Optimization for the best results.</p>
                  </div>
                  <div className="space-y-4 text-center">
                      <div className="text-2xl font-bold text-[#FF3B1D]">03.</div>
                      <h4 className="font-bold text-slate-800 uppercase text-sm">Download Result</h4>
                      <p className="text-slate-500 text-sm font-medium">Wait for a few seconds and download your optimized, smaller PDF file instantly.</p>
                  </div>
              </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase tracking-tight text-center">Fast & Secure Processing</h2>
              <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-2xl mx-auto text-center">
                At PDF Machine, privacy is our mission. All file transfers are encrypted with SSL technology and your documents are automatically deleted after 60 minutes.
              </p>
          </section>
        </div>
      </div>
    </>
  );
}