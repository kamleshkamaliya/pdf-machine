"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useState, useLayoutEffect } from "react"; 
import { usePathname } from "next/navigation";
import { 
  Menu, X, ChevronDown, Share2, Facebook, Linkedin, 
  Mail, Copy, CheckCircle2 
} from "lucide-react";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  const shareUrl = "https://pdfmachine.pro/";
  const shareTitle = "PDF Machine Pro - Fast, Secure & Free PDF Tools";

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const closeMenu = () => {
    setIsOpen(false);
    setIsMoreOpen(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to check active route
  const isActive = (path) => pathname === path;

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    email: `mailto:?subject=${shareTitle}&body=Check out this awesome tool: ${shareUrl}`
  };

  return (
    <html lang="en">
      <body 
        className={`${inter.className} min-h-screen flex flex-col bg-white bg-subtle-grid`}
        suppressHydrationWarning={true}
      >
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-ELV49B0MW3" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ELV49B0MW3');
          `}
        </Script>

        <header className="fixed top-0 w-full z-[100] bg-white border-b border-gray-100 h-14 md:h-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
            
            <Link href="/" onClick={closeMenu} className="flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-[#FF3B1D] rounded-lg flex items-center justify-center text-white font-bold text-[9px] md:text-xs shadow-lg shadow-orange-500/30">
                PDF
              </div>
              <span className="text-sm md:text-xl font-black tracking-tighter text-slate-900 uppercase">
                PDF MACHINE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[14px] font-bold">
              <Link href="/merge-pdf" className={`${isActive('/merge-pdf') ? 'text-[#FF3B1D]' : 'text-slate-600'} hover:text-[#FF3B1D] transition-colors`}>Merge PDF</Link>
              <Link href="/split-pdf" className={`${isActive('/split-pdf') ? 'text-[#FF3B1D]' : 'text-slate-600'} hover:text-[#FF3B1D] transition-colors`}>Split PDF</Link>
              <Link href="/compress-pdf" className={`${isActive('/compress-pdf') ? 'text-[#FF3B1D]' : 'text-slate-600'} hover:text-[#FF3B1D] transition-colors`}>Compress</Link>
              <Link href="/sign-pdf" className={`${isActive('/sign-pdf') ? 'text-[#FF3B1D]' : 'text-slate-600'} hover:text-[#FF3B1D] transition-colors`}>Sign PDF</Link>
              
              <div className="relative group py-2">
                <button className={`flex items-center gap-1 font-bold transition-colors cursor-pointer ${isActive('/jpg-to-pdf') || isActive('/pdf-to-jpg') ? 'text-[#FF3B1D]' : 'text-slate-600'} hover:text-[#FF3B1D]`}>
                  More <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full -left-4 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-2 p-1 z-50">
                  <Link href="/jpg-to-pdf" className={`block px-4 py-2 text-sm rounded-xl font-bold ${isActive('/jpg-to-pdf') ? 'bg-orange-50 text-[#FF3B1D]' : 'text-slate-600 hover:bg-orange-50'}`}>JPG to PDF</Link>
                  <Link href="/pdf-to-jpg" className={`block px-4 py-2 text-sm rounded-xl font-bold ${isActive('/pdf-to-jpg') ? 'bg-orange-50 text-[#FF3B1D]' : 'text-slate-600 hover:bg-orange-50'}`}>PDF to JPG</Link>
                  <Link href="/protect-pdf" className={`block px-4 py-2 text-sm rounded-xl font-bold ${isActive('/protect-pdf') ? 'bg-orange-50 text-[#FF3B1D]' : 'text-slate-600 hover:bg-orange-50'}`}>Protect PDF</Link>
                  <Link href="/unlock-pdf" className={`block px-4 py-2 text-sm rounded-xl font-bold ${isActive('/unlock-pdf') ? 'bg-orange-50 text-[#FF3B1D]' : 'text-slate-600 hover:bg-orange-50'}`}>Unlock PDF</Link>
                  <Link href="/word-to-pdf" className={`block px-4 py-2 text-sm rounded-xl font-bold ${isActive('/word-to-pdf') ? 'bg-orange-50 text-[#FF3B1D]' : 'text-slate-600 hover:bg-orange-50'}`}>Word to PDF</Link>
                </div>
              </div>
            </nav>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowShareModal(true)}
                className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 md:w-4.5 md:h-4.5" />
              </button>

              <Link href="/contact" className="hidden sm:block bg-[#FF3B1D] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-orange-600 shadow-md">
               Help & Feedback
              </Link>
              
              <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-1.5 text-slate-800 hover:bg-slate-50 rounded-lg">
                {isOpen ? <X className="w-5 h-5 text-[#FF3B1D]" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden fixed inset-0 top-14 bg-white w-full h-screen z-[90] transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <nav className="flex flex-col p-4 gap-1 text-[16px] font-bold h-full overflow-y-auto bg-white">
              <Link href="/merge-pdf" onClick={closeMenu} className={`py-4 px-4 rounded-xl border-b border-slate-50 ${isActive('/merge-pdf') ? 'text-[#FF3B1D] bg-orange-50' : 'text-slate-700'}`}>Merge PDF</Link>
              <Link href="/split-pdf" onClick={closeMenu} className={`py-4 px-4 rounded-xl border-b border-slate-50 ${isActive('/split-pdf') ? 'text-[#FF3B1D] bg-orange-50' : 'text-slate-700'}`}>Split PDF</Link>
              <Link href="/compress-pdf" onClick={closeMenu} className={`py-4 px-4 rounded-xl border-b border-slate-50 ${isActive('/compress-pdf') ? 'text-[#FF3B1D] bg-orange-50' : 'text-slate-700'}`}>Compress PDF</Link>
              <Link href="/sign-pdf" onClick={closeMenu} className={`py-4 px-4 rounded-xl border-b border-slate-50 ${isActive('/sign-pdf') ? 'text-[#FF3B1D] bg-orange-50' : 'text-slate-700'}`}>Sign PDF</Link>
              
              <div className="flex flex-col">
                <button 
                  onClick={() => setIsMoreOpen(!isMoreOpen)} 
                  className={`flex items-center justify-between py-4 px-4 font-black ${isActive('/jpg-to-pdf') || isActive('/pdf-to-jpg') ? 'text-[#FF3B1D]' : 'text-slate-700'}`}
                >
                  OTHER TOOLS <ChevronDown className={`w-4 h-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMoreOpen && (
                  <div className="flex flex-col gap-1 mx-2 bg-slate-50 rounded-2xl p-2">
                    <Link href="/jpg-to-pdf" onClick={closeMenu} className={`py-3 px-4 rounded-xl ${isActive('/jpg-to-pdf') ? 'text-[#FF3B1D] bg-white' : 'text-slate-500'}`}>JPG to PDF</Link>
                    <Link href="/pdf-to-jpg" onClick={closeMenu} className={`py-3 px-4 rounded-xl ${isActive('/pdf-to-jpg') ? 'text-[#FF3B1D] bg-white' : 'text-slate-500'}`}>PDF to JPG</Link>
                    <Link href="/protect-pdf" onClick={closeMenu} className={`py-3 px-4 rounded-xl ${isActive('/protect-pdf') ? 'text-[#FF3B1D] bg-white' : 'text-slate-500'}`}>Protect PDF</Link>
                    <Link href="/unlock-pdf" onClick={closeMenu} className={`py-3 px-4 rounded-xl ${isActive('/unlock-pdf') ? 'text-[#FF3B1D] bg-white' : 'text-slate-500'}`}>Unlock PDF</Link>
                    <Link href="/word-to-pdf" onClick={closeMenu} className={`py-3 px-4 rounded-xl ${isActive('/word-to-pdf') ? 'text-[#FF3B1D] bg-white' : 'text-slate-500'}`}>Word to PDF</Link>
                  </div>
                )}
              </div>
              
              <div className="mt-10 px-4">
                 <Link href="/contact" onClick={closeMenu} className="block w-full bg-[#FF3B1D] text-white py-4 rounded-2xl text-center font-black shadow-lg shadow-orange-500/20">
                    HELP & FEEDBACK
                 </Link>
              </div>
            </nav>
          </div>
        </header>

        {showShareModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowShareModal(false)}></div>
            <div className="bg-white  max-sm rounded-[2rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
               <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="font-black text-slate-900 uppercase tracking-tighter text-lg">Share Tool</h3>
                  <button onClick={() => setShowShareModal(false)} className="p-2 rounded-full text-slate-400"><X className="w-5 h-5"/></button>
               </div>
               <div className="p-6 grid grid-cols-3 gap-4">
                  <a href={socialLinks.facebook} target="_blank" className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Facebook className="w-6 h-6"/></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Facebook</span>
                  </a>
                  <a href={socialLinks.linkedin} target="_blank" className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Linkedin className="w-6 h-6"/></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">LinkedIn</span>
                  </a>
                  <a href={socialLinks.email} className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF3B1D] flex items-center justify-center group-hover:scale-110 transition-transform"><Mail className="w-6 h-6"/></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Email</span>
                  </a>
               </div>
               <div className="p-6 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl">
                    <input readOnly value={shareUrl} className="flex-1 bg-transparent text-xs font-bold text-slate-500 px-2 outline-none"/>
                    <button onClick={copyToClipboard} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1">
                      {copied ? <CheckCircle2 className="w-3 h-3"/> : <Copy className="w-3 h-3"/>}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
               </div>
            </div>
          </div>
        )}

        <main className="items-center relative z-10 w-full pt-14 md:pt-20">
           {children}
        </main>

        <footer className="border-t border-gray-100 py-10 bg-white mt-auto w-full">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-6">
            <div className="flex items-center gap-4">
               <a target="_blank" href={socialLinks.facebook} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#FF3B1D] hover:bg-orange-50 transition-all"><Facebook className="w-5 h-5"/></a>
               <a target="_blank" href={socialLinks.linkedin} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#FF3B1D] hover:bg-orange-50 transition-all"><Linkedin className="w-5 h-5"/></a>
               <a href={socialLinks.email} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#FF3B1D] hover:bg-orange-50 transition-all"><Mail className="w-5 h-5"/></a>
            </div>

            <p className="text-slate-400 text-[12px] md:text-sm font-bold uppercase tracking-widest text-center">
              © 2026 PDF Machine. Built for privacy & speed.
            </p>
            
            {/* ✅ UPDATED FOOTER LINKS WITH ACTIVE STATE */}
            <div className="flex justify-center gap-8">
              <Link 
                href="/privacy-policy" 
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive('/privacy-policy') ? 'text-[#FF3B1D]' : 'text-slate-500 hover:text-[#FF3B1D]'}`}
              >
                Privacy Policy
              </Link>
              
              <Link 
                href="/contact" 
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive('/contact') ? 'text-[#FF3B1D]' : 'text-slate-500 hover:text-[#FF3B1D]'}`}
              >
                Contact
              </Link>
              
              <Link 
                href="/blog" 
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive('/blog') ? 'text-[#FF3B1D]' : 'text-slate-500 hover:text-[#FF3B1D]'}`}
              >
                Blog
              </Link>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}