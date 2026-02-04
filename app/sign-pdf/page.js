"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { PDFDocument, degrees } from "pdf-lib";
import { Rnd } from "react-rnd";
import { 
  Upload, Download, Maximize2, ChevronLeft, ChevronRight, Plus, 
  Trash2, Image as ImageIcon, RotateCw, Palette, MousePointer2, 
  CheckCircle, Shield, Zap, FileText, HelpCircle, ChevronDown 
} from "lucide-react";

// CSS Imports
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Dynamic Imports
const Document = dynamic(() => import("react-pdf").then(mod => mod.Document), { ssr: false });
const Page = dynamic(() => import("react-pdf").then(mod => mod.Page), { ssr: false });
const SignatureCanvas = dynamic(() => import("react-signature-canvas"), { ssr: false });

export default function SignPDF() {
  const [isClient, setIsClient] = useState(false);
  
  // PDF States
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfBytes, setPdfBytes] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  
  const [allSignatures, setAllSignatures] = useState([]); 
  const [selectedId, setSelectedId] = useState(null);

  // Tool States
  const [signMode, setSignMode] = useState("draw");
  const [typedName, setTypedName] = useState(""); 
  const [penColor, setPenColor] = useState("#000000");

  const sigPad = useRef(null); 
  const fileInputRef = useRef(null); 

  useEffect(() => {
    setIsClient(true);
    const setupWorker = async () => {
      const { pdfjs } = await import("react-pdf");
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    };
    setupWorker();
  }, []);

  // --- Helpers ---
  const getSelectedSig = () => allSignatures.find(s => s.id === selectedId);

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file?.type === "application/pdf") {
      const buffer = await file.arrayBuffer();
      setPdfBytes(buffer);
      setPdfFile(file);
      setAllSignatures([]);
      setPageNumber(1);
      setSelectedId(null);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // ✅ ROTATION LOGIC
  const handleRotateStart = (e, id) => {
    e.stopPropagation(); 
    e.preventDefault();

    const element = document.getElementById(`sig-${id}`);
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const onMove = (moveEvent) => {
      const clientX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const radians = Math.atan2(clientX - centerX, clientY - centerY);
      const degree = (radians * (180 / Math.PI) * -1) + 180;

      setAllSignatures(prev => prev.map(sig => 
        sig.id === id ? { ...sig, rotation: degree } : sig
      ));
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
  };

  // ✅ IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const pngDataUrl = canvas.toDataURL("image/png");

            const baseWidth = 200;
            const ratio = img.width / img.height;
            const calcHeight = baseWidth / ratio;

            const newId = Date.now();
            const newSignature = {
                id: newId,
                page: pageNumber,
                x: 50, y: 50,
                width: baseWidth, 
                height: calcHeight,
                rotation: 0,
                image: pngDataUrl
            };
            setAllSignatures([...allSignatures, newSignature]);
            setSelectedId(newId);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
      e.target.value = ""; 
    }
  };

  const addSignatureToPage = () => {
    let imageSrc = null;

    if (signMode === 'draw') {
      if (sigPad.current && !sigPad.current.isEmpty()) {
        imageSrc = sigPad.current.getTrimmedCanvas().toDataURL("image/png");
      }
    } else {
      if (!typedName.trim()) return;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 600; canvas.height = 200;
      ctx.font = "100px 'Great Vibes', cursive"; 
      ctx.fillStyle = penColor; 
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);
      imageSrc = canvas.toDataURL("image/png");
    }

    if (!imageSrc) return;

    const newId = Date.now();
    const newSignature = {
      id: newId,
      page: pageNumber,
      x: 50, y: 50,
      width: 200, height: 100,
      rotation: 0,
      image: imageSrc
    };

    setAllSignatures([...allSignatures, newSignature]);
    setSelectedId(newId);

    if(signMode === 'draw') sigPad.current.clear();
    setTypedName("");
  };

  const updateSignaturePosition = (id, d) => {
    setAllSignatures(prev => prev.map(sig => sig.id === id ? { ...sig, x: d.x, y: d.y } : sig));
    setSelectedId(id);
  };

  const updateSignatureSize = (id, ref, position) => {
    setAllSignatures(prev => prev.map(sig => 
      sig.id === id ? { ...sig, width: parseInt(ref.style.width), height: parseInt(ref.style.height), ...position } : sig
    ));
    setSelectedId(id);
  };

  const removeSignature = (id) => {
    setAllSignatures(prev => prev.filter(sig => sig.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  // ✅ SAVE PDF (With Memory Fix)
  const downloadPDF = async () => {
    if (!pdfBytes || allSignatures.length === 0) return;
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes.slice(0));
      const pages = pdfDoc.getPages();
      
      for (const sig of allSignatures) {
        const pageIndex = sig.page - 1;
        if (pageIndex >= pages.length) continue;
        
        const currentPage = pages[pageIndex];
        const pageWidth = currentPage.getWidth();
        const pageHeight = currentPage.getHeight();
        const scaleFactor = pageWidth / 600; 
        
        const pngImage = await pdfDoc.embedPng(sig.image);
        const pdfW = sig.width * scaleFactor;
        const pdfH = sig.height * scaleFactor;
        const pdfX = sig.x * scaleFactor;
        const pdfY = pageHeight - (sig.y * scaleFactor) - pdfH;

        currentPage.drawImage(pngImage, {
          x: pdfX,
          y: pdfY,
          width: pdfW,
          height: pdfH,
          rotate: degrees(sig.rotation),
        });
      }

      const modifiedBytes = await pdfDoc.save();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([modifiedBytes], { type: "application/pdf" }));
      link.download = "signed-document.pdf";
      link.click();
    } catch (err) { 
        console.error("Save Error:", err);
        alert("Error saving PDF. Please try again.");
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* 🔴 SEO & METADATA */}
      <title>Sign PDF Online - Free Digital Signature Tool | PDF Machine</title>
      <meta name="description" content="Sign PDF documents online for free. Add electronic signatures, text, and stamps securely. No registration required. Easy to use and secure." />
      <meta name="keywords" content="sign pdf, digital signature, electronic signature, free pdf signer, online pdf tools" />

      {/* Font for Signatures */}
      <style jsx global>{` @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap'); `}</style>

      {/* 🟢 HERO SECTION */}
      <section className="pt-24 pb-12 px-6 text-center space-y-4 max-w-5xl mx-auto">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 text-[#FF3B1D]">
            <Zap className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
           Sign PDF <span className="text-[#FF3B1D]">Online.</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
          Add your electronic signature to PDF documents easily. Upload, sign, and download in seconds. Secure and 100% free.
        </p>
      </section>

      {/* 🟡 MAIN TOOL WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        {!pdfBytes ? (
          <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] p-12 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-slate-100 text-center hover:-translate-y-1 transition-transform duration-300">
            <input type="file" accept="application/pdf" onChange={onFileChange} className="hidden" id="pdf-upload" />
            <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-6 group">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-[#FF3B1D] group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Upload className="w-10 h-10" />
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Select PDF File</h3>
                  <p className="text-slate-400 font-medium mt-2">or drag and drop here</p>
              </div>
              <span className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-[#FF3B1D] transition-colors">
                  Choose from Device
              </span>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
            
            {/* 🛠️ LEFT PANEL: TOOLS */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 sticky top-24">
                    
                    {/* Selected Item Info */}
                    {selectedId ? (
                        <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100 flex justify-between items-center">
                            <span className="text-xs font-bold text-orange-600 uppercase flex items-center gap-1"><MousePointer2 className="w-3 h-3"/> Selected</span>
                            <button onClick={() => setSelectedId(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">Deselect</button>
                        </div>
                    ) : (
                         <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs text-slate-400 font-medium">
                            Select a signature to edit or rotate.
                         </div>
                    )}

                    {/* Mode Switcher */}
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                        <button onClick={() => setSignMode('draw')} className={`flex-1 py-3 rounded-lg font-bold text-sm cursor-pointer transition-all ${signMode === 'draw' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Draw</button>
                        <button onClick={() => setSignMode('type')} className={`flex-1 py-3 rounded-lg font-bold text-sm cursor-pointer transition-all ${signMode === 'type' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Type</button>
                    </div>

                    {/* Color Picker */}
                    <div className="mb-4 flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4 text-slate-400"/>
                            <span className="text-sm font-bold text-slate-600">Ink Color</span>
                        </div>
                        <div className="relative cursor-pointer">
                            <input 
                                type="color" 
                                value={penColor}
                                onChange={(e) => setPenColor(e.target.value)}
                                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border-none p-0 bg-transparent"
                            />
                            <div className="absolute inset-0 rounded-full border border-slate-200 pointer-events-none" style={{ backgroundColor: penColor }}></div>
                        </div>
                    </div>

                    {/* Input Area */}
                    {signMode === 'draw' ? (
                        <div className="border-2 border-slate-100 rounded-2xl bg-slate-50 overflow-hidden cursor-crosshair relative">
                            <SignatureCanvas 
                                ref={sigPad} 
                                penColor={penColor} 
                                minWidth={2} maxWidth={2.5}
                                canvasProps={{width: 320, height: 160, className: 'sigCanvas'}} 
                            />
                            <button onClick={() => sigPad.current.clear()} className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white text-slate-500 cursor-pointer shadow-sm"><Trash2 className="w-4 h-4"/></button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <input type="text" value={typedName} onChange={(e) => setTypedName(e.target.value)} placeholder="Type Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-[#FF3B1D]" />
                            <div className="h-24 flex items-center justify-center border border-slate-100 rounded-xl bg-white overflow-hidden shadow-inner">
                                <span className="text-4xl" style={{ fontFamily: "'Great Vibes', cursive", color: penColor }}>{typedName || "Preview"}</span>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                        <button onClick={() => fileInputRef.current.click()} className="bg-slate-100 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 flex items-center justify-center gap-2 text-sm cursor-pointer transition-colors">
                           <ImageIcon className="w-4 h-4" /> Upload Stamp
                        </button>
                        <button onClick={addSignatureToPage} className="bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer transition-colors">
                           <Plus className="w-4 h-4" /> Add to Page
                        </button>
                    </div>

                    {allSignatures.length > 0 && (
                        <button onClick={downloadPDF} className="w-full mt-4 py-4 bg-[#FF3B1D] text-white rounded-xl font-bold shadow-xl shadow-orange-500/30 hover:bg-orange-600 transition-all flex items-center justify-center gap-2 text-lg cursor-pointer">
                            <Download className="w-5 h-5" /> Download Signed PDF
                        </button>
                    )}
                </div>
            </div>

            {/* 📄 RIGHT PANEL: PDF VIEWER */}
            <div className="lg:col-span-8 bg-slate-200 p-4 md:p-8 rounded-[2rem] border border-slate-300 flex flex-col items-center min-h-[700px] shadow-inner overflow-hidden">
                
                {/* Pagination Controls */}
                {numPages && (
                  <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-lg mb-6 border border-slate-100 z-30">
                    <button disabled={pageNumber <= 1} onClick={() => setPageNumber(prev => prev - 1)} className="p-2 hover:bg-slate-100 rounded-full disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-6 h-6 text-slate-700" /></button>
                    <span className="font-bold text-slate-700 tabular-nums">Page {pageNumber} of {numPages}</span>
                    <button disabled={pageNumber >= numPages} onClick={() => setPageNumber(prev => prev + 1)} className="p-2 hover:bg-slate-100 rounded-full disabled:opacity-30 cursor-pointer"><ChevronRight className="w-6 h-6 text-slate-700" /></button>
                  </div>
                )}

                {/* PDF Wrapper (Fixed Width for Logic, Scrollable for Mobile) */}
                <div className="w-full overflow-x-auto flex justify-center custom-scrollbar pb-4">
                    <div className="relative w-[600px] min-w-[600px] h-fit shadow-2xl rounded-xl border border-slate-300 bg-white" id="pdf-wrapper">
                        {allSignatures.map((sig) => (
                          sig.page === pageNumber && (
                            <Rnd
                                key={sig.id}
                                size={{ width: sig.width, height: sig.height }}
                                position={{ x: sig.x, y: sig.y }}
                                onMouseDown={() => setSelectedId(sig.id)}
                                onDragStop={(e, d) => updateSignaturePosition(sig.id, d)}
                                onResizeStop={(e, direction, ref, delta, position) => updateSignatureSize(sig.id, ref, position)}
                                bounds="parent"
                                lockAspectRatio={true}
                                cancel=".no-drag"
                                
                                // Disable Top-Right Resize to fix Delete Conflict
                                enableResizing={{
                                    top: false, right: false, bottom: false, left: false,
                                    topRight: false, bottomRight: true, bottomLeft: false, topLeft: false
                                }}

                                className="z-50 group" 
                            >
                                <div 
                                    id={`sig-${sig.id}`} 
                                    className={`w-full h-full relative ${selectedId === sig.id ? 'border-2 border-[#FF3B1D] border-dashed bg-white/10' : 'hover:border-2 hover:border-slate-300 hover:border-dashed'}`}
                                    style={{ transform: `rotate(${sig.rotation}deg)` }}
                                >
                                    <img src={sig.image} className="w-full h-full object-contain pointer-events-none select-none" alt="sign" />
                                    
                                    {selectedId === sig.id && (
                                        <>
                                            {/* Rotate Handle */}
                                            <div 
                                                className="no-drag absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-slate-300 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-sm hover:scale-110 hover:bg-[#FF3B1D] hover:text-white transition-all z-50"
                                                onMouseDown={(e) => handleRotateStart(e, sig.id)}
                                                onTouchStart={(e) => handleRotateStart(e, sig.id)}
                                            >
                                                <RotateCw className="w-3 h-3 pointer-events-none" />
                                            </div>

                                            {/* Resize Handle (Bottom-Right) */}
                                            <div className="absolute bottom-0 right-0 bg-[#FF3B1D] text-white p-1 rounded-tl-lg shadow-sm cursor-nwse-resize">
                                                <Maximize2 className="w-3 h-3 rotate-90 pointer-events-none" />
                                            </div>
                                            
                                            {/* Delete Button */}
                                            <button 
                                                className="no-drag absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:scale-110 cursor-pointer z-[100]"
                                                onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                                                onClick={(e) => { e.stopPropagation(); removeSignature(sig.id); }}
                                            >
                                                <Trash2 className="w-3 h-3 pointer-events-none"/>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </Rnd>
                          )
                        ))}
                        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess} loading={<div className="p-20 font-bold text-slate-400">Rendering PDF...</div>}>
                            <Page pageNumber={pageNumber} width={600} renderTextLayer={false} renderAnnotationLayer={false} />
                        </Document>
                    </div>
                </div>
            </div>

          </div>
        )}
      </div>

      {/* 🔹 SECTION 1: HOW IT WORKS */}
      <section className="bg-white py-20 px-6 border-y border-slate-100">
          <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">How to Sign a PDF?</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto">Follow these three simple steps to add your electronic signature to any PDF document.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-[#FF3B1D]">
                          <Upload className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-3">1. Upload PDF</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">Select your file from your device. We support all standard PDF documents securely.</p>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-[#FF3B1D]">
                          <Zap className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-3">2. Create Signature</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">Draw your signature, type your name, or upload an image of your stamp/signature.</p>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-[#FF3B1D]">
                          <CheckCircle className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-3">3. Download</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">Place the signature where you want, click download, and get your signed file instantly.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* 🔸 SECTION 2: WHY CHOOSE US */}
      <section className="py-20 px-6 bg-[#FF3B1D]/5">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Secure & Legal Electronic Signatures</h2>
                  <div className="space-y-6">
                      <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 text-[#FF3B1D] shadow-sm"><Shield className="w-6 h-6"/></div>
                          <div>
                              <h5 className="font-bold text-slate-900 text-lg">100% Secure</h5>
                              <p className="text-slate-500 text-sm mt-1">Files are processed locally in your browser. No data is stored on our servers.</p>
                          </div>
                      </div>
                      <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 text-[#FF3B1D] shadow-sm"><FileText className="w-6 h-6"/></div>
                          <div>
                              <h5 className="font-bold text-slate-900 text-lg">Multi-Format Support</h5>
                              <p className="text-slate-500 text-sm mt-1">Sign contracts, invoices, agreements, and forms with ease.</p>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                 <div className="space-y-4">
                     <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                         <span className="font-bold text-slate-700">Is it free?</span>
                         <Plus className="w-5 h-5 text-[#FF3B1D]" />
                     </div>
                     <p className="text-slate-500 text-sm">Yes, Sign PDF is completely free to use without any limits.</p>
                     
                     <div className="flex items-center justify-between border-b border-slate-50 pb-4 pt-2">
                         <span className="font-bold text-slate-700">Can I sign on mobile?</span>
                         <Plus className="w-5 h-5 text-[#FF3B1D]" />
                     </div>
                     <p className="text-slate-500 text-sm">Absolutely! Our tool is fully responsive and works on iPhone and Android.</p>
                 </div>
              </div>
          </div>
      </section>

    </div>
  );
}