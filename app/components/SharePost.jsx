"use client";

import { useState } from "react";
import { Share2, Facebook, Linkedin, Mail, Copy, Check, X } from "lucide-react";

export default function SharePost({ title, url }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Window.location se current URL uthayega
  const fullUrl = typeof window !== "undefined" ? window.location.href : url || "https://pdfmachine.pro";

  const shareLinks = [
    {
      name: "Facebook",
      icon: <Facebook className="w-6 h-6" />,
      color: "bg-blue-50 text-blue-600",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-6 h-6" />,
      color: "bg-sky-50 text-sky-600",
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
    },
    {
      name: "Email",
      icon: <Mail className="w-6 h-6" />,
      color: "bg-orange-50 text-orange-600",
      link: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(fullUrl)}`,
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Fix: Isse popup window block nahi hogi
  const openPopup = (e, link) => {
    e.preventDefault();
    const width = 600, height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    window.open(link, 'share-dialog', `width=${width},height=${height},left=${left},top=${top},scrollbars=no,resizable=no`);
  };

  return (
    <>
      <div className="mt-20 pt-10 border-t border-slate-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50 p-8 rounded-[2rem]">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Found this helpful?</h3>
            <p className="text-slate-500 text-sm">Share this article with your friends.</p>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-[#ff3b1d] text-white px-6 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-500/30"
          >
            <Share2 className="w-5 h-5" /> Share Article
          </button>
        </div>
      </div>

      {/* 🟢 Share Modal (Premium Design like your image) */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
            
            {/* Header */}
            <div className="flex justify-between items-center p-8 pb-4">
              <h4 className="font-black text-slate-900 uppercase tracking-tight text-xl">Share Tool</h4>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Social Icons Container */}
            <div className="px-8 pb-10 flex justify-center gap-8 border-b border-slate-50">
              {shareLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  onClick={(e) => item.name !== 'Email' && openPopup(e, item.link)}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className={`${item.color} w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                </a>
              ))}
            </div>

            {/* Copy Link Section */}
            <div className="p-8 bg-slate-50/50">
              <div className="flex items-center gap-2 bg-white p-2 pl-4 rounded-2xl border border-slate-200 shadow-inner">
                <input
                  type="text"
                  readOnly
                  value={fullUrl}
                  className="bg-transparent border-none text-xs font-bold text-slate-500 flex-1 outline-none truncate"
                />
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-tighter transition-all ${copied ? "bg-green-500 text-white" : "bg-[#0f172a] text-white hover:bg-black"}`}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}