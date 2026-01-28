"use client";

import { useState, useEffect } from "react";

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  // UI Handlers...
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => file.type === "application/pdf");
    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    } else {
      alert("Please select PDF files only!");
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      alert("At least 2 PDF files are required.");
      return;
    }
    setIsProcessing(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const response = await fetch('/api/merge', { method: 'POST', body: formData });
      if (!response.ok) throw new Error("Server merge failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url); 
      setIsSuccess(true);
    } catch (error) {
      alert("Merge failed. Server error.");
    }
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "merged-document.pdf";
      link.click();
    }
  };

  const resetTool = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setFiles([]);
    setIsSuccess(false);
    setPdfUrl(null);
    setIsProcessing(false);
  };

  return (
    <>
      {/* 🌐 SEO METADATA SECTION */}
      <title>Merge PDF Files Online - 100% Free & Secure | PDF Machine</title>
      <meta name="description" content="Easily combine multiple PDF files into one single document with PDF Machine. No signup required, fast processing, and 100% secure file deletion." />
      <meta name="keywords" content="merge pdf, combine pdf, online pdf merger, join pdf files, free pdf tools" />

      <div className="pt-15 md:pt-15 pb-20 px-4 md:px-6 min-h-screen w-full bg-[#F7F9FB] flex flex-col items-center">
        
        {/* HEADER */}
        <div className="text-center mb-10 space-y-2 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight uppercase">
            Merge <span className="text-[#FF3B1D]">PDF</span> Files
          </h1>
          <p className="text-slate-500 text-base md:text-lg font-medium">
            Combine multiple documents into a single PDF file securely.
          </p>
        </div>

        {/* MAIN CARD (Original Design) */}
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative min-h-[400px]">
          {isProcessing && (
            <div className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center">
              <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-slate-100 border-t-[#FF3B1D] rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 uppercase">Processing...</h3>
              <p className="text-slate-500 mt-2 font-medium">Merging your files smoothly.</p>
            </div>
          )}

          <div className="p-6 md:p-10 h-full flex flex-col justify-center">
            {isSuccess ? (
               <div className="text-center py-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <svg className="w-10 h-10 md:w-12 md:h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 uppercase">Your PDF is Ready!</h2>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                    <button onClick={resetTool} className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-slate-100 font-bold hover:bg-slate-50 transition-colors uppercase text-xs cursor-pointer active:scale-95">Merge New Files</button>
                    <button onClick={handleDownload} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FF3B1D] text-white font-bold hover:bg-[#d93219] transition-all uppercase text-xs shadow-lg shadow-orange-500/20 cursor-pointer active:scale-95">Download PDF</button>
                  </div>
               </div>
            ) : (
              <>
                {files.length === 0 ? (
                  <div className="group relative w-full h-64 md:h-72 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-center cursor-pointer transition-all">
                    <input type="file" multiple accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <h3 className="text-base md:text-lg font-bold text-slate-800 uppercase">Drop your PDFs here</h3>
                    <p className="text-slate-400 mt-2 text-xs md:text-sm font-medium">Click to browse files from your device</p>
                  </div>
                ) : (
                  <div className="w-full">
                     <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                       <h2 className="font-bold text-slate-800 uppercase text-xs md:text-sm">{files.length} Files Selected</h2>
                       <button onClick={() => setFiles([])} className="text-red-500 text-xs font-bold hover:underline uppercase cursor-pointer transition-all">Reset All</button>
                     </div>
                     <div className="flex flex-col gap-3 mb-8 max-h-[250px] md:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                       {files.map((file, index) => (
                         <div key={index} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center group hover:border-slate-300 transition-all">
                           <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500 shrink-0 font-bold text-[10px]">{index + 1}</div>
                              <span className="truncate text-slate-700 font-bold text-sm">{file.name}</span>
                           </div>
                           <button onClick={() => removeFile(index)} className="text-slate-400 hover:text-red-500 p-2 rounded-full transition-colors cursor-pointer">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                           </button>
                       </div>
                       ))}
                     </div>
                     <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <input type="file" multiple accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <button className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 border border-slate-200 uppercase text-xs cursor-pointer transition-all">+ Add More</button>
                        </div>
                        <button onClick={mergePdfs} className="flex-[2] py-4 bg-[#FF3B1D] text-white font-bold rounded-xl hover:bg-[#e03216] shadow-lg shadow-orange-500/20 uppercase text-xs tracking-wider cursor-pointer active:scale-95 transition-transform">Merge Files Now</button>
                     </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* SEO CONTENT SECTIONS */}
        <div className="w-full max-w-4xl mt-20 space-y-20 px-2">
          <section className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase mb-8 tracking-tight">How to Combine PDFs?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="space-y-3">
                      <div className="text-2xl font-bold text-[#FF3B1D]">01.</div>
                      <h4 className="font-bold text-slate-800 uppercase text-sm">Upload</h4>
                      <p className="text-slate-500 text-sm font-medium">Select multiple PDF files from your computer or mobile device.</p>
                  </div>
                  <div className="space-y-3">
                      <div className="text-2xl font-bold text-[#FF3B1D]">02.</div>
                      <h4 className="font-bold text-slate-800 uppercase text-sm">Process</h4>
                      <p className="text-slate-500 text-sm font-medium">Our secure server merges your documents into a single PDF instantly.</p>
                  </div>
                  <div className="space-y-3">
                      <div className="text-2xl font-bold text-[#FF3B1D]">03.</div>
                      <h4 className="font-bold text-slate-800 uppercase text-sm">Download</h4>
                      <p className="text-slate-500 text-sm font-medium">Save your new merged document to your device with one click.</p>
                  </div>
              </div>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase tracking-tight">Secure PDF Merging</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                  PDF Machine ensures the highest level of document security. All file transfers are encrypted with SSL technology and your documents are automatically deleted from our servers within 60 minutes of processing.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                  <span className="bg-slate-50 px-4 py-2 rounded-full border border-slate-100 text-[10px] font-bold text-slate-600 uppercase">Privacy Protected</span>
                  <span className="bg-slate-50 px-4 py-2 rounded-full border border-slate-100 text-[10px] font-bold text-slate-600 uppercase">SSL Encrypted</span>
              </div>
          </section>
        </div>
      </div>
    </>
  );
}