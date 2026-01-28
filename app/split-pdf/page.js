"use client";

import { useState, useEffect } from 'react';
import { FileText, Loader2, CheckCircle, X, CloudUpload, Scissors, Download, AlertTriangle, Layers, Zap, ShieldCheck, Lock } from 'lucide-react';

export default function SplitPdfPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('all'); 
  const [range, setRange] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

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
    setRange('');
  };

  const handleSplit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);
    if (mode === 'range') formData.append('range', range);

    try {
      const response = await fetch('/api/split-pdf', { method: 'POST', body: formData });
      if (!response.ok) throw new Error("Split failed.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Split PDF Online | Extract Pages | PDF MACHINE</title>
      <meta name="description" content="Split your PDF documents into separate pages instantly. Fast and secure." />

      <div className="pt-15 md:pt-15 pb-20 px-4 md:px-6 relative w-full min-h-screen flex flex-col items-center bg-slate-50/50">
        
        {/* HEADER */}
        <div className="text-center mb-10 md:mb-12 max-w-2xl">
           <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight uppercase">
             Split <span className="text-[#FF3B1D]">PDF.</span>
           </h1>
           <p className="text-slate-500 mt-3 text-base md:text-lg font-medium">
             Separate PDF pages or extract specific ranges instantly.
           </p>
        </div>

        {/* MAIN CARD */}
        <div className="w-full max-w-3xl bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-xl border border-slate-100">
          
          {!file && (
            <label className="h-64 md:h-72 rounded-3xl flex flex-col items-center justify-center relative hover:bg-slate-50 transition-all cursor-pointer group border-2 border-dashed border-slate-200">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 text-[#FF3B1D] group-hover:scale-110 transition-transform">
                 <CloudUpload className="w-8 h-8" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg md:text-xl uppercase group-hover:text-[#FF3B1D] transition-colors">Upload PDF</h3>
              <p className="text-slate-400 font-medium text-xs md:text-sm mt-1">Click to browse your file</p>
            </label>
          )}

          {file && !downloadUrl && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
              {/* File Info */}
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
                 <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-5 h-5 text-[#FF3B1D] shrink-0" />
                    <p className="text-xs md:text-sm font-bold text-slate-700 truncate">{file.name}</p>
                 </div>
                 <button onClick={removeFile} className="p-2 text-slate-400 hover:text-red-500 cursor-pointer">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              {/* Mode Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <button onClick={() => setMode('all')} className={`p-5 rounded-2xl border-2 font-bold transition-all flex items-center md:flex-col gap-3 cursor-pointer ${mode === 'all' ? 'border-[#FF3B1D] bg-orange-50 text-[#FF3B1D]' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}>
                      <Layers className="w-6 h-6 md:w-8 md:h-8"/>
                      <span className="text-xs uppercase tracking-wider">Split All Pages</span>
                  </button>
                  <button onClick={() => setMode('range')} className={`p-5 rounded-2xl border-2 font-bold transition-all flex items-center md:flex-col gap-3 cursor-pointer ${mode === 'range' ? 'border-[#FF3B1D] bg-orange-50 text-[#FF3B1D]' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}>
                      <Scissors className="w-6 h-6 md:w-8 md:h-8"/>
                      <span className="text-xs uppercase tracking-wider">Extract Range</span>
                  </button>
              </div>

              {mode === 'range' && (
                   <div className="animate-in slide-in-from-top-2 duration-300">
                       <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest ml-1">Page Range (e.g. 1-5)</label>
                       <input type="text" placeholder="e.g. 1-3" className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-[#FF3B1D] outline-none font-bold text-slate-800 text-base" value={range} onChange={(e) => setRange(e.target.value)} />
                   </div>
               )}

              {loading ? (
                <div className="w-full bg-orange-50 p-6 rounded-2xl text-center">
                    <Loader2 className="w-8 h-8 text-[#FF3B1D] animate-spin mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">Splitting PDF...</p>
                </div>
              ) : (
                <button onClick={handleSplit} className="w-full py-4 bg-[#FF3B1D] hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all cursor-pointer uppercase text-sm tracking-wider">
                  Split PDF Now
                </button>
              )}
            </div>
          )}

          {downloadUrl && (
             <div className="text-center py-4 animate-in zoom-in duration-300">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-8 uppercase tracking-tight">Your ZIP is Ready!</h2>
                <div className="space-y-3">
                    <a href={downloadUrl} download="split_files.zip" className="w-full py-4 bg-[#FF3B1D] text-white font-bold rounded-xl flex items-center justify-center gap-3 cursor-pointer uppercase text-sm">
                        <Download className="w-5 h-5"/> Download ZIP
                    </a>
                    <button onClick={removeFile} className="w-full py-3 text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer uppercase">Split Another File</button>
                </div>
             </div>
          )}
        </div>

        {/* 🟠 HOW IT WORKS SECTION (RE-DESIGNED FOR VISIBILITY) */}
        <div className="max-w-5xl w-full mt-20 md:mt-24 space-y-20 px-2">
          <section className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase mb-12 tracking-tight">How to Split PDF Online?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                  {/* Step 1 */}
                  <div className="space-y-4">
                      <div className="text-2xl font-bold text-[#FF3B1D] bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-orange-100">1</div>
                      <h4 className="font-bold text-slate-800 uppercase text-sm">Upload Document</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">Select the PDF file you wish to split or extract pages from using our secure uploader.</p>
                  </div>
                  {/* Step 2 */}
                  <div className="space-y-4">
                      <div className="text-2xl font-bold text-[#FF3B1D] bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-orange-100">2</div>
                      <h4 className="font-bold text-slate-800 uppercase text-sm">Select Mode</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">Choose 'Split All' to save every page separately or 'Extract Range' for specific pages.</p>
                  </div>
                  {/* Step 3 */}
                  <div className="space-y-4">
                      <div className="text-2xl font-bold text-[#FF3B1D] bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-orange-100">3</div>
                      <h4 className="font-bold text-slate-800 uppercase text-sm">Save Files</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">Click Split and download your files in a single, organized ZIP folder instantly.</p>
                  </div>
              </div>
          </section>

          {/* Security & Features */}
          <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-16 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1 space-y-6 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase leading-tight tracking-tight">Fast & Private <br/><span className="text-[#FF3B1D]">Page Extraction.</span></h2>
                  <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">PDF Machine provides a seamless way to manage your documents. All files are encrypted with SSL and wiped automatically after 60 minutes.</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                          <Zap className="w-4 h-4 text-[#FF3B1D]" />
                          <span className="text-[10px] font-bold text-slate-600 uppercase">Instant Processing</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                          <Lock className="w-4 h-4 text-[#FF3B1D]" />
                          <span className="text-[10px] font-bold text-slate-600 uppercase">Secure Cloud</span>
                      </div>
                  </div>
              </div>
              <div className="flex-1 w-full bg-orange-50/50 rounded-3xl p-8 border border-orange-100 text-center">
                  <ShieldCheck className="w-12 h-12 text-[#FF3B1D] mx-auto opacity-30 mb-4" />
                  <p className="text-slate-700 text-xs font-bold uppercase tracking-widest italic leading-relaxed">"High-speed splitting without compromising document resolution. Your secure choice for PDF management."</p>
              </div>
          </section>
        </div>
      </div>
    </>
  );
}