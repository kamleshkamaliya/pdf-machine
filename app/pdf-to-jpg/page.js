"use client";

import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, X, Trash2, Plus, ShieldCheck, Zap, Lock } from 'lucide-react';

export default function PdfToJpgDesign() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [fileType, setFileType] = useState(""); 
  const [error, setError] = useState(null);

  // --- HANDLERS (Exactly as your original) ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(f => f.type === 'application/pdf');

      if (validFiles.length === 0) {
         setError("Please select valid PDF files.");
         return;
      }

      setFiles(prev => {
        const remainingSlots = 10 - prev.length;
        if (remainingSlots <= 0) {
            setError("Limit reached! Maximum 10 files allowed.");
            return prev;
        }
        if (validFiles.length > remainingSlots) {
            setError(`Limit exceeded. Only added ${remainingSlots} files to fit the limit of 10.`);
            return [...prev, ...validFiles.slice(0, remainingSlots)];
        }
        setError(null);
        return [...prev, ...validFiles];
      });

      setDownloadUrl(null);
      setFileType("");
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(prev => {
        const updated = prev.filter((_, index) => index !== indexToRemove);
        if (updated.length < 10) setError(null);
        return updated;
    });
  };

  const resetAll = () => {
    setFiles([]);
    setDownloadUrl(null);
    setError(null);
    setFileType("");
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    files.forEach((file) => { formData.append('files', file); });
    try {
      const response = await fetch('/api/pdf-to-jpg', { method: 'POST', body: formData });
      if (!response.ok) throw new Error("Conversion failed");
      const contentType = response.headers.get('Content-Type');
      setFileType(contentType.includes('zip') ? 'zip' : 'jpg');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError("Failed. Ensure Poppler is installed on server.");
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      {/* 🌐 SEO METADATA */}
      <title>PDF to JPG Online - Convert PDF to Images for Free | PDF MACHINE</title>
      <meta name="description" content="Convert your PDF pages into high-quality JPG images instantly. 100% free, secure, and no signup required." />

      <div className="pt-32 pb-20 px-6 relative w-full min-h-screen flex flex-col items-center bg-slate-50/50">
        <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-orange-200/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob -z-10"></div>
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-red-200/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 -z-10"></div>

        <div className="w-full max-w-3xl px-6 z-10">
          <div className="text-center mb-10">
             <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight uppercase">PDF to <span className="text-[#FF3B1D]">JPG.</span></h1>
             <p className="text-slate-500 mt-3 text-lg font-medium max-w-2xl mx-auto">Convert multiple PDFs into high-quality images.</p>
          </div>

          <div className="w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 md:pt-5 shadow-2xl shadow-orange-500/10 ring-1 ring-white/60 border border-white/40">
            {files.length === 0 && (
              <div className="h-72 rounded-3xl flex flex-col items-center justify-center relative hover:bg-white/80 transition-all duration-500 cursor-pointer group border-3 border-dashed border-slate-300 hover:border-[#FF3B1D]/50 bg-slate-50/50">
                {/* 🎯 FIXED: Added outline-none focus:outline-none to remove black border */}
                <input type="file" multiple accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 outline-none focus:outline-none" />
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300 text-[#FF3B1D] border border-slate-100"><FileText className="w-10 h-10" /></div>
                <h3 className="text-slate-900 font-bold text-2xl mb-1">Select PDF Files</h3>
                <p className="text-slate-500 font-medium text-base">Select up to 10 files</p>
              </div>
            )}

            {files.length > 0 && !downloadUrl && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                <div className="flex justify-between items-center mb-6 px-2">
                   <h3 className="font-bold text-slate-700 flex items-center gap-2"><FileText className="w-5 h-5 text-[#FF3B1D]"/>Selected Files ({files.length}/10)</h3>
                   <button onClick={resetAll} className="text-xs font-bold text-[#FF3B1D] hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">Clear All</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {files.map((file, index) => (
                    <div key={index} className="relative group bg-white border border-slate-200 p-3 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                       <button onClick={() => removeFile(index)} className="absolute top-2 right-2 bg-slate-100 text-slate-400 hover:bg-[#FF3B1D] hover:text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer"><X className="w-3 h-3" /></button>
                       <div className="w-10 h-10 bg-orange-50 text-[#FF3B1D] rounded-xl flex items-center justify-center mb-2"><FileText className="w-5 h-5" /></div>
                       <p className="text-xs font-bold text-slate-700 w-full truncate px-1">{file.name}</p>
                       <p className="text-[10px] text-slate-400">{formatBytes(file.size)}</p>
                    </div>
                  ))}
                  {files.length < 10 && (
                      <label className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-orange-300 transition-all min-h-[100px]">
                          <Plus className="w-4 h-4 text-slate-400 mb-1" />
                          <span className="text-xs font-bold text-slate-500">Add More</span>
                          {/* 🎯 FIXED: Added outline-none focus:outline-none here too */}
                          <input type="file" multiple accept="application/pdf" onChange={handleFileChange} className="hidden outline-none focus:outline-none" />
                      </label>
                  )}
                </div>

                <button onClick={handleConvert} disabled={loading} className="w-full py-4 bg-[#FF3B1D] hover:bg-orange-600 text-white font-bold text-lg rounded-xl shadow-xl flex items-center justify-center gap-3 cursor-pointer active:scale-95 transition-all">
                  {loading ? <><Loader2 className="animate-spin w-5 h-5"/> Converting... </> : "Convert to JPG"}
                </button>
              </div>
            )}

            {downloadUrl && (
               <div className="animate-in zoom-in duration-500 text-center py-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2 uppercase">Success!</h2>
                  <div className="flex flex-col gap-3 px-2">
                     <a href={downloadUrl} download={fileType === 'zip' ? "converted_images.zip" : "page.jpg"} className="w-full py-4 bg-[#FF3B1D] hover:bg-orange-600 text-white font-bold text-xl rounded-xl shadow-xl flex items-center justify-center cursor-pointer uppercase tracking-wide transition-all active:scale-95">Download PDF</a>
                     <button onClick={resetAll} className="w-full py-3 text-slate-400 font-bold text-xs cursor-pointer uppercase">Convert More Files</button>
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* 🟠 NEW EXTRA SEO SECTIONS */}
        <div className="max-w-4xl w-full mt-24 space-y-20 px-2 pb-10">
          <section className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase mb-12 tracking-tight">How to Convert PDF to JPG?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="space-y-4">
                      <div className="text-2xl font-bold text-[#FF3B1D] bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-orange-100">1</div>
                      <h4 className="font-bold text-slate-800 uppercase text-sm">Upload PDF</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">Select up to 10 PDF documents from your computer or phone to start converting.</p>
                  </div>
                  <div className="space-y-4">
                      <div className="text-2xl font-bold text-[#FF3B1D] bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-orange-100">2</div>
                      <h4 className="font-bold text-slate-800 uppercase text-sm">Instant Process</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">Click convert and our high-speed engine will extract every page into a crisp image.</p>
                  </div>
                  <div className="space-y-4">
                      <div className="text-2xl font-bold text-[#FF3B1D] bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-orange-100">3</div>
                      <h4 className="font-bold text-slate-800 uppercase text-sm">Save ZIP</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">Download your organized images in a single ZIP folder instantly for easy sharing.</p>
                  </div>
              </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase tracking-tight">Secure Image Conversion</h2>
              <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                PDF Machine ensures 100% private document handling. Your files are encrypted with SSL and wiped from our servers automatically after 60 minutes.
              </p>
          </section>
        </div>
      </div>
    </>
  );
}