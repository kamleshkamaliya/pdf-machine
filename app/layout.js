"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useState, useLayoutEffect } from "react"; 
import { usePathname } from "next/navigation";
import { 
  Menu, X, ChevronDown, Share2, Facebook, Linkedin, 
  Mail, Copy, CheckCircle2, FileImage, FileText, Lock, Unlock, 
  BrainCircuit
} from "lucide-react";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
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
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isActive = (path) => pathname === path;

  // Helper for Mega Menu Item Styling (Active State included)
  const MegaMenuItem = ({ href, icon: Icon, title, desc, colorClass, activeColorClass }) => {
    const active = isActive(href);
    return (
      <Link href={href} className={`flex items-center gap-3 p-3 rounded-xl group/item transition-all ${active ? 'bg-orange-50' : 'hover:bg-slate-50'}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${active ? 'bg-[#FF3B1D] text-white' : `${colorClass} group-hover/item:${activeColorClass} group-hover/item:text-white`}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className={`font-bold text-sm ${active ? 'text-[#FF3B1D]' : 'text-slate-700'}`}>{title}</p>
          <p className="text-[11px] text-slate-400 font-medium">{desc}</p>
        </div>
      </Link>
    );
  };

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    email: `mailto:?subject=${shareTitle}&body=Check out this awesome tool: ${shareUrl}`
  };

  // List of all paths under "More Tools" to highlight parent button
  const moreToolsPaths = [
    '/jpg-to-pdf', '/pdf-to-jpg', '/protect-pdf', '/unlock-pdf', 
    '/word-to-pdf', '/pdf-to-word', '/resume-scorer'
  ];

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white bg-subtle-grid`} suppressHydrationWarning={true}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-ELV49B0MW3" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ELV49B0MW3');
          `}
        </Script>

        <header className="fixed top-0 w-full z-[100] bg-white border-b border-gray-100 h-16 md:h-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
            
            <Link href="/" onClick={closeMenu} className="flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-[#FF3B1D] rounded-xl flex items-center justify-center text-white font-bold text-[10px] md:text-xs shadow-lg shadow-orange-500/30">
                PDF
              </div>
              <span className="text-lg md:text-xl font-black tracking-tighter text-slate-900 uppercase">
                PDF MACHINE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[14px] font-bold">
              <Link href="/merge-pdf" className={`${isActive('/merge-pdf') ? 'text-[#FF3B1D]' : 'text-slate-600'} hover:text-[#FF3B1D] transition-colors`}>Merge PDF</Link>
              <Link href="/split-pdf" className={`${isActive('/split-pdf') ? 'text-[#FF3B1D]' : 'text-slate-600'} hover:text-[#FF3B1D] transition-colors`}>Split PDF</Link>
              <Link href="/compress-pdf" className={`${isActive('/compress-pdf') ? 'text-[#FF3B1D]' : 'text-slate-600'} hover:text-[#FF3B1D] transition-colors`}>Compress</Link>
              <Link href="/sign-pdf" className={`${isActive('/sign-pdf') ? 'text-[#FF3B1D]' : 'text-slate-600'} hover:text-[#FF3B1D] transition-colors`}>Sign PDF</Link>
              
              {/* --- MEGA MENU DROPDOWN --- */}
              <div className="relative group h-full flex items-center">
                <button className={`flex items-center gap-1 font-bold transition-colors cursor-pointer py-2 ${moreToolsPaths.some(path => isActive(path)) ? 'text-[#FF3B1D]' : 'text-slate-600'} hover:text-[#FF3B1D]`}>
                  More Tools <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                
                {/* Mega Menu Container */}
                <div className="absolute top-[calc(100%+1px)] right-[-100px] w-[600px] bg-white border border-slate-100 rounded-3xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-2 p-6 z-50 grid grid-cols-2 gap-6">
                  
                  {/* Column 1: Conversion Tools */}
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 px-2">Convert & Create</h4>
                    <div className="space-y-1">
                      <MegaMenuItem 
                        href="/word-to-pdf" 
                        icon={FileText} 
                        title="Word to PDF" 
                        desc="DOCX to PDF instantly" 
                        colorClass="bg-blue-50 text-blue-600" 
                        activeColorClass="bg-blue-600"
                      />
                      {/* ✅ NEW: PDF to Word Added */}
                      <MegaMenuItem 
                        href="/pdf-to-word" 
                        icon={FileText} 
                        title="PDF to Word" 
                        desc="Convert PDF to editable DOC" 
                        colorClass="bg-indigo-50 text-indigo-600" 
                        activeColorClass="bg-indigo-600"
                      />
                      <MegaMenuItem 
                        href="/jpg-to-pdf" 
                        icon={FileImage} 
                        title="JPG to PDF" 
                        desc="Convert images to PDF" 
                        colorClass="bg-yellow-50 text-yellow-600" 
                        activeColorClass="bg-yellow-500"
                      />
                      <MegaMenuItem 
                        href="/pdf-to-jpg" 
                        icon={FileImage} 
                        title="PDF to JPG" 
                        desc="Extract images from PDF" 
                        colorClass="bg-green-50 text-green-600" 
                        activeColorClass="bg-green-600"
                      />
                    </div>
                  </div>

                  {/* Column 2: Security & AI */}
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 px-2">Security & AI</h4>
                    <div className="space-y-1">
                      <MegaMenuItem 
                        href="/protect-pdf" 
                        icon={Lock} 
                        title="Protect PDF" 
                        desc="Encrypt with password" 
                        colorClass="bg-purple-50 text-purple-600" 
                        activeColorClass="bg-purple-600"
                      />
                      <MegaMenuItem 
                        href="/unlock-pdf" 
                        icon={Unlock} 
                        title="Unlock PDF" 
                        desc="Remove passwords" 
                        colorClass="bg-gray-50 text-gray-600" 
                        activeColorClass="bg-gray-600"
                      />
                      
                      <Link href="/resume-scorer" className={`flex items-center gap-3 p-3 rounded-xl border transition-all mt-2 group/item ${isActive('/resume-scorer') ? 'bg-orange-50 border-[#FF3B1D]' : 'bg-orange-50/50 border-orange-100 hover:bg-orange-100'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md shadow-orange-500/20 ${isActive('/resume-scorer') ? 'bg-[#FF3B1D] text-white' : 'bg-[#FF3B1D] text-white'}`}>
                          <BrainCircuit size={18} />
                        </div>
                        <div>
                          <p className={`font-bold text-sm flex items-center gap-2 ${isActive('/resume-scorer') ? 'text-[#FF3B1D]' : 'text-[#FF3B1D]'}`}>
                             AI Resume Check <span className="text-[9px] bg-[#FF3B1D] text-white px-1.5 py-0.5 rounded-full">NEW</span>
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">Get ATS score & fixes</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                  
                </div>
              </div>
            </nav>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowShareModal(true)}
                className="hidden md:flex items-center justify-center w-9 h-9 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <Link href="/contact" className="hidden sm:block bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-transform active:scale-95">
               Help & Feedback
              </Link>
              
              <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-800 hover:bg-slate-50 rounded-xl transition-colors">
                {isOpen ? <X className="w-6 h-6 text-[#FF3B1D]" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu (Updated) */}
          <div className={`lg:hidden fixed inset-0 top-16 bg-white w-full h-[calc(100vh-4rem)] z-[90] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <nav className="flex flex-col p-6 gap-2 text-[16px] font-bold h-full overflow-y-auto pb-20">
              <Link href="/merge-pdf" onClick={closeMenu} className={`py-3 px-4 rounded-xl ${isActive('/merge-pdf') ? 'text-[#FF3B1D] bg-orange-50' : 'text-slate-600 hover:bg-slate-50'}`}>Merge PDF</Link>
              <Link href="/split-pdf" onClick={closeMenu} className={`py-3 px-4 rounded-xl ${isActive('/split-pdf') ? 'text-[#FF3B1D] bg-orange-50' : 'text-slate-600 hover:bg-slate-50'}`}>Split PDF</Link>
              <Link href="/compress-pdf" onClick={closeMenu} className={`py-3 px-4 rounded-xl ${isActive('/compress-pdf') ? 'text-[#FF3B1D] bg-orange-50' : 'text-slate-600 hover:bg-slate-50'}`}>Compress PDF</Link>
              <Link href="/sign-pdf" onClick={closeMenu} className={`py-3 px-4 rounded-xl ${isActive('/sign-pdf') ? 'text-[#FF3B1D] bg-orange-50' : 'text-slate-600 hover:bg-slate-50'}`}>Sign PDF</Link>
              
              <div className="my-2 border-t border-slate-100"></div>
              <p className="text-xs font-black text-slate-400 px-4 py-2 uppercase tracking-wider">Conversion</p>
              
              <Link href="/word-to-pdf" onClick={closeMenu} className={`py-3 px-4 rounded-xl flex items-center gap-3 ${isActive('/word-to-pdf') ? 'text-[#FF3B1D] bg-orange-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                 <FileText size={18}/> Word to PDF
              </Link>
              {/* ✅ NEW: PDF to Word Mobile */}
              <Link href="/pdf-to-word" onClick={closeMenu} className={`py-3 px-4 rounded-xl flex items-center gap-3 ${isActive('/pdf-to-word') ? 'text-[#FF3B1D] bg-orange-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                 <FileText size={18}/> PDF to Word
              </Link>
              <Link href="/jpg-to-pdf" onClick={closeMenu} className={`py-3 px-4 rounded-xl flex items-center gap-3 ${isActive('/jpg-to-pdf') ? 'text-[#FF3B1D] bg-orange-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                 <FileImage size={18}/> JPG to PDF
              </Link>
              <Link href="/pdf-to-jpg" onClick={closeMenu} className={`py-3 px-4 rounded-xl flex items-center gap-3 ${isActive('/pdf-to-jpg') ? 'text-[#FF3B1D] bg-orange-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                 <FileImage size={18}/> PDF to JPG
              </Link>

              <div className="my-2 border-t border-slate-100"></div>
              <p className="text-xs font-black text-slate-400 px-4 py-2 uppercase tracking-wider">Tools & AI</p>

              <Link href="/protect-pdf" onClick={closeMenu} className={`py-3 px-4 rounded-xl flex items-center gap-3 ${isActive('/protect-pdf') ? 'text-[#FF3B1D] bg-orange-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                 <Lock size={18}/> Protect PDF
              </Link>
              <Link href="/unlock-pdf" onClick={closeMenu} className={`py-3 px-4 rounded-xl flex items-center gap-3 ${isActive('/unlock-pdf') ? 'text-[#FF3B1D] bg-orange-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                 <Unlock size={18}/> Unlock PDF
              </Link>
              <Link href="/resume-scorer" onClick={closeMenu} className={`py-3 px-4 rounded-xl flex items-center gap-3 bg-gradient-to-r from-orange-50 to-white border border-orange-100 ${isActive('/resume-scorer') ? 'text-[#FF3B1D]' : 'text-[#FF3B1D]'}`}>
                 <BrainCircuit size={18}/> AI Resume Checker <span className="text-[9px] bg-[#FF3B1D] text-white px-1.5 py-0.5 rounded-full ml-auto">NEW</span>
              </Link>
              
              <div className="mt-8 px-4">
                 <Link href="/contact" onClick={closeMenu} className="block w-full bg-slate-900 text-white py-4 rounded-2xl text-center font-black shadow-lg shadow-slate-900/20">
                    HELP & SUPPORT
                 </Link>
              </div>
            </nav>
          </div>
        </header>

        {showShareModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowShareModal(false)}></div>
            <div className="bg-white rounded-[2rem] shadow-2xl relative z-10 overflow-hidden w-full max-w-sm animate-in zoom-in duration-200">
               <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="font-black text-slate-900 uppercase tracking-tighter text-lg">Share Tool</h3>
                  <button onClick={() => setShowShareModal(false)} className="p-2 rounded-full text-slate-400 hover:bg-slate-50"><X className="w-5 h-5"/></button>
               </div>
               <div className="p-6 grid grid-cols-3 gap-4">
                  <a href={socialLinks.facebook} target="_blank" className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><Facebook className="w-7 h-7"/></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Facebook</span>
                  </a>
                  <a href={socialLinks.linkedin} target="_blank" className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><Linkedin className="w-7 h-7"/></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">LinkedIn</span>
                  </a>
                  <a href={socialLinks.email} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF3B1D] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><Mail className="w-7 h-7"/></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email</span>
                  </a>
               </div>
               <div className="p-6 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl shadow-sm">
                    <input readOnly value={shareUrl} className="flex-1 bg-transparent text-xs font-bold text-slate-500 px-2 outline-none"/>
                    <button onClick={copyToClipboard} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 hover:bg-slate-800 transition-colors">
                      {copied ? <CheckCircle2 className="w-3 h-3"/> : <Copy className="w-3 h-3"/>}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
               </div>
            </div>
          </div>
        )}

        <main className="flex-1 w-full pt-16 md:pt-20">
           {children}
        </main>

        <footer className="border-t border-gray-100 py-12 bg-white mt-auto w-full">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-8">
            <div className="flex items-center gap-4">
               <a target="_blank" href={socialLinks.facebook} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#FF3B1D] hover:bg-orange-50 hover:scale-110 transition-all shadow-sm"><Facebook className="w-5 h-5"/></a>
               <a target="_blank" href={socialLinks.linkedin} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#FF3B1D] hover:bg-orange-50 hover:scale-110 transition-all shadow-sm"><Linkedin className="w-5 h-5"/></a>
               <a href={socialLinks.email} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#FF3B1D] hover:bg-orange-50 hover:scale-110 transition-all shadow-sm"><Mail className="w-5 h-5"/></a>
            </div>

            <p className="text-slate-400 text-[12px] md:text-sm font-bold uppercase tracking-widest text-center">
              © 2026 PDF Machine. Built for privacy & speed.
            </p>
            
            <div className="flex justify-center gap-8 md:gap-12">
              <Link href="/privacy-policy" className={`text-[11px] font-black uppercase tracking-widest transition-colors ${isActive('/privacy-policy') ? 'text-[#FF3B1D]' : 'text-slate-500 hover:text-[#FF3B1D]'}`}>Privacy</Link>
              <Link href="/contact" className={`text-[11px] font-black uppercase tracking-widest transition-colors ${isActive('/contact') ? 'text-[#FF3B1D]' : 'text-slate-500 hover:text-[#FF3B1D]'}`}>Contact</Link>
              <Link href="/blog" className={`text-[11px] font-black uppercase tracking-widest transition-colors ${isActive('/blog') ? 'text-[#FF3B1D]' : 'text-slate-500 hover:text-[#FF3B1D]'}`}>Blog</Link>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}