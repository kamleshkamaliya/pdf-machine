"use client";

import { useState, useRef } from "react";
import { 
  Code, Heading1, Heading2, Type, Link as LinkIcon, 
  Image as ImageIcon, UploadCloud, Loader2, Eye, EyeOff 
} from "lucide-react";

export default function RichTextEditor({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [showSource, setShowSource] = useState(true); // Default Source Code mode
  const textareaRef = useRef(null);

  // ✅ 1. Insert HTML Logic (Wraps selected text or inserts snippet)
  const insertHTML = (tagOpen, tagClose = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const selected = text.substring(start, end);

    const newText = before + tagOpen + selected + tagClose + after;
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selected.length);
    }, 10);
  };

  // ✅ 2. Local Image Upload logic
  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);

      // Local API route
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      // Inserts responsive image tag into HTML
      insertHTML(`<img src="${data.url}" alt="image description" class="w-full h-auto rounded-2xl my-6" />\n`);
    } catch (err) {
      alert("Upload Error: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg ring-1 ring-slate-200/50">
      
      {/* 🛠️ Advanced Toolbar */}
      <div className="p-3 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/80 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <button type="button" onClick={() => insertHTML("<h1>", "</h1>")} className="p-2.5 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-600 flex items-center gap-1 font-bold text-xs shadow-sm hover:shadow-md">
            <Heading1 className="w-4 h-4 text-blue-600" /> H1
          </button>
          <button type="button" onClick={() => insertHTML("<h2>", "</h2>")} className="p-2.5 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-600 flex items-center gap-1 font-bold text-xs shadow-sm hover:shadow-md">
            <Heading2 className="w-4 h-4 text-blue-500" /> H2
          </button>
          <button type="button" onClick={() => insertHTML("<p>", "</p>")} className="p-2.5 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-600 flex items-center gap-1 font-bold text-xs shadow-sm hover:shadow-md">
            <Type className="w-4 h-4 text-slate-500" /> P
          </button>
          
          {/* ✅ List Buttons Added for convenience */}
          <button type="button" onClick={() => insertHTML("<ul>\n  <li>", "</li>\n</ul>")} className="p-2.5 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-600 font-bold text-xs shadow-sm hover:shadow-md">
             List
          </button>

          <button type="button" onClick={() => insertHTML('<a href="#" class="text-blue-600 hover:underline">', "</a>")} className="p-2.5 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-600 font-bold text-xs shadow-sm hover:shadow-md">
            <LinkIcon className="w-4 h-4 text-indigo-500" /> Link
          </button>

          <div className="w-px h-6 bg-slate-200 mx-2" />

          {/* 📸 Local Image Upload */}
          <label className="p-2.5 hover:bg-blue-600 hover:text-white rounded-xl border border-transparent hover:border-blue-700 transition-all text-blue-600 flex items-center gap-2 cursor-pointer font-bold text-xs shadow-sm hover:shadow-md">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Add Image"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        {/* Mode Switcher */}
        <button 
          type="button" 
          onClick={() => setShowSource(!showSource)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all border ${showSource ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 shadow-sm'}`}
        >
          {showSource ? <><Eye className="w-4 h-4" /> Visual Preview</> : <><Code className="w-4 h-4" /> Source Code</>}
        </button>
      </div>

      {/* 📝 Editor Area */}
      <div className="relative">
        {showSource ? (
          <div className="bg-slate-950 p-1">
             <div className="absolute top-4 right-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] pointer-events-none select-none z-10">
               HTML-ENGINE-V1
             </div>
             <textarea
                ref={textareaRef}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Write HTML or plain text here..."
                className="w-full min-h-[550px] p-8 font-mono text-[13px] text-blue-300 focus:outline-none bg-transparent leading-relaxed resize-y selection:bg-blue-500/30"
                spellCheck="false"
             />
          </div>
        ) : (
          /* 👁️ Instant Visual Preview Mode with Fixes */
          <div className="w-full min-h-[550px] p-10 bg-white overflow-y-auto">
             <div 
               className="prose prose-slate max-w-none lg:prose-lg
                          prose-headings:font-black prose-headings:text-slate-900
                          prose-p:text-slate-600 prose-p:leading-relaxed
                          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                          prose-img:rounded-2xl prose-img:shadow-sm
                          prose-ul:list-disc prose-ul:pl-6
                          prose-ol:list-decimal prose-ol:pl-6
                          prose-li:marker:text-slate-400" 
               dangerouslySetInnerHTML={{ __html: value }} 
             />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 text-[10px] text-slate-400 border-t border-slate-100 bg-white flex justify-between items-center font-bold uppercase tracking-wider">
        <span>Aap direct HTML likh kar Preview mode me check kar sakte hain.</span>
        <span className="text-blue-500">HTML Version: 5.0</span>
      </div>
    </div>
  );
}