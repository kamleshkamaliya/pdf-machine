"use client";

import { useState } from 'react';
import { FileImage, Loader2, CheckCircle, X, Plus, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';

export default function JpgToPdfPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  // --- HANDLERS ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      // ✅ Updated logic: Only allow JPG, PNG, and WEBP
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const validFiles = selectedFiles.filter(f => allowedTypes.includes(f.type));
      
      if (validFiles.length !== selectedFiles.length) {
        alert("Only JPG, PNG, and WEBP images are allowed. Other files were skipped.");
      }
      
      setFiles(prev => [...prev, ...validFiles]);
      setError(null);
      setDownloadUrl(null);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const resetAll = () => {
    setFiles([]);
    setDownloadUrl(null);
    setError(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    files.forEach((file) => { formData.append('files', file); });
    try {
      const response = await fetch('/api/jpg-to-pdf', { method: 'POST', body: formData });
      if (!response.ok) throw new Error("Conversion failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError("Failed. Ensure Tesseract/Server is ready.");
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
      {/* 🌐 SEO METADATA - NEW */}
      <title>JPG to PDF Online - Combine Images to PDF for Free | PDF MACHINE</title>
      <meta name="description" content="Convert JPG, PNG, and other images to PDF online for free. Combine multiple images into one single PDF document securely and instantly." />
      <meta name="keywords" content="jpg to pdf, images to pdf, png to pdf, convert image to pdf online, free pdf machine" />

      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-6 relative w-full min-h-screen flex flex-col items-center bg-slate-50/50">
        
        {/* Background Blobs (Original Design) */}
        <div className="fixed top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-200/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob -z-10"></div>
        <div className="fixed bottom-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-red-200/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 -z-10"></div>

        <div className="w-full max-w-3xl z-10">
          
          {/* HEADER */}
          <div className="text-center mb-10">
             <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight uppercase">
               JPG to <span className="text-[#FF3B1D]">PDF.</span>
             </h1>
             <p className="text-slate-500 mt-3 text-base md:text-lg font-medium max-w-2xl mx-auto">
               Combine your images into a single PDF document.
             </p>
          </div>

          {/* MAIN CARD (Original Design) */}
          <div className="w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-12 md:pt-5 shadow-2xl shadow-orange-500/10 ring-1 ring-white/60 border border-white/40">
            
            {files.length === 0 && (
              <label className="h-64 md:h-72 rounded-3xl flex flex-col items-center justify-center relative hover:bg-white/80 transition-all duration-500 cursor-pointer group border-2 border-dashed border-slate-300 bg-slate-50/50">
                {/* ✅ Added specific accept types */}
                <input type="file" multiple accept=".jpg,.jpeg,.png,.webp" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300 text-[#FF3B1D] border border-slate-100">
                   <FileImage className="w-10 h-10" />
                </div>
                <h3 className="text-slate-900 font-bold text-xl md:text-2xl mb-1 uppercase">Select Images</h3>
                <p className="text-slate-400 font-medium text-xs md:text-sm">JPG, PNG, WEBP supported</p>
              </label>
            )}

            {files.length > 0 && !downloadUrl && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                <div className="flex justify-between items-center mb-6 px-2">
                   <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2 uppercase">
                      Selected Images ({files.length})
                   </h3>
                   <button onClick={resetAll} className="text-[10px] font-bold text-[#FF3B1D] hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer uppercase">
                      Clear All
                   </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {files.map((file, index) => (
                    <div key={index} className="relative group bg-white border border-slate-200 p-3 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                       <button onClick={() => removeFile(index)} className="absolute top-2 right-2 bg-slate-100 text-slate-400 hover:bg-[#FF3B1D] hover:text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer">
                          <X className="w-3 h-3" />
                       </button>
                       <div className="w-8 h-8 bg-orange-50 text-[#FF3B1D] rounded-xl flex items-center justify-center mb-2 font-bold text-[10px]">{index + 1}</div>
                       <p className="text-[10px] font-bold text-slate-700 w-full truncate px-1">{file.name}</p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase">{formatBytes(file.size)}</p>
                    </div>
                  ))}
                  <label className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all min-h-[100px]">
                      <Plus className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Add More</span>
                      {/* ✅ Added specific accept types here too */}
                      <input type="file" multiple accept=".jpg,.jpeg,.png,.webp" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs flex items-center font-bold uppercase border border-red-100"><X className="w-5 h-5 mr-3 shrink-0" />{error}</div>}

               <button
  onClick={handleConvert}
  disabled={loading}
  className="w-full py-4 bg-[#FF3B1D] hover:bg-orange-600 text-white font-bold text-base rounded-xl shadow-xl transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
>
  {loading ? (
    <span className="flex items-center justify-center gap-2">
      <Loader2 className="animate-spin w-5 h-5" />
      Creating PDF...
    </span>
  ) : (
    "Convert to PDF"
  )}
</button>

              </div>
            )}

            {downloadUrl && (
               <div className="animate-in zoom-in duration-500 text-center py-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-slate-900 mb-2 uppercase">Success!</h2>
                  <p className="text-slate-500 mb-10 font-bold uppercase text-[10px] tracking-widest">Your document is ready for download</p>
                  <div className="flex flex-col gap-3 px-2">
                     <a href={downloadUrl} download="images_merged.pdf" className="w-full py-4 bg-[#FF3B1D] hover:bg-orange-600 text-white font-bold text-lg rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer uppercase tracking-wide">
                       Download PDF <ArrowRight className="w-6 h-6" />
                     </a>
                     <button onClick={resetAll} className="w-full py-3 text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer uppercase">Convert New Images</button>
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* 🟠 NEW EXTRA SEO SECTIONS - NEW WORK */}
        <div className="max-w-4xl w-full mt-24 space-y-20 px-2 pb-10">
          <section className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase mb-12 tracking-tight">How to Convert JPG to PDF?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="space-y-4">
                      <div className="text-2xl font-bold text-[#FF3B1D] bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-orange-100 uppercase">1</div>
                      <h4 className="font-bold text-slate-800 uppercase text-sm">Upload Images</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">Select JPG, PNG, or other image files from your device that you want to merge into a PDF.</p>
                  </div>
                  <div className="space-y-4">
                      <div className="text-2xl font-bold text-[#FF3B1D] bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-orange-100 uppercase">2</div>
                      <h4 className="font-bold text-slate-800 uppercase text-sm">Organize</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">Add more images or remove files to get your document order exactly right before conversion.</p>
                  </div>
                  <div className="space-y-4">
                      <div className="text-2xl font-bold text-[#FF3B1D] bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-orange-100 uppercase">3</div>
                      <h4 className="font-bold text-slate-800 uppercase text-sm">Get PDF</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">Click 'Convert' and our secure server will generate your high-quality PDF document instantly.</p>
                  </div>
              </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1 space-y-6 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase leading-tight tracking-tight">Secure Image <br/><span className="text-[#FF3B1D]">Conversion.</span></h2>
                  <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">PDF Machine provides 100% private image conversion. Your files are encrypted with SSL and automatically deleted after 60 minutes to ensure your data stays safe.</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                          <Zap className="w-4 h-4 text-[#FF3B1D]" />
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Fast Process</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                          <Lock className="w-4 h-4 text-[#FF3B1D]" />
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">SSL Secure</span>
                      </div>
                  </div>
              </div>
              <div className="flex-1 w-full bg-orange-50/50 rounded-3xl p-8 border border-orange-100 text-center">
                  <ShieldCheck className="w-12 h-12 text-[#FF3B1D] mx-auto opacity-30 mb-4" />
                  <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest italic leading-relaxed">"The most secure way to merge photos into a professional document instantly."</p>
              </div>
          </section>
        </div>
      </div>
    </>
  );
}