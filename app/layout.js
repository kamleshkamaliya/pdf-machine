"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation"; // Path check karne ke liye logic
import { Menu, X, ChevronDown } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const pathname = usePathname(); // Current URL nikalne ke liye

  const closeMenu = () => {
    setIsOpen(false);
    setIsMoreOpen(false);
  };

  // Helper function: Link active hai ya nahi check karne ke liye
  const isActive = (path) => pathname === path;

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white bg-subtle-grid`}>
        
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

            {/* Desktop Navigation with Active Class */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[14px] font-bold">
              <Link href="/merge-pdf" className={`${isActive('/merge-pdf') ? 'text-[#FF3B1D]' : 'text-slate-600'} hover:text-[#FF3B1D] transition-colors cursor-pointer`}>Merge PDF</Link>
              <Link href="/split-pdf" className={`${isActive('/split-pdf') ? 'text-[#FF3B1D]' : 'text-slate-600'} hover:text-[#FF3B1D] transition-colors cursor-pointer`}>Split PDF</Link>
              <Link href="/compress-pdf" className={`${isActive('/compress-pdf') ? 'text-[#FF3B1D]' : 'text-slate-600'} hover:text-[#FF3B1D] transition-colors cursor-pointer`}>Compress</Link>
              
              <div className="relative group py-2">
                <button className={`flex items-center gap-1 font-bold transition-colors cursor-pointer ${isActive('/jpg-to-pdf') || isActive('/pdf-to-jpg') ? 'text-[#FF3B1D]' : 'text-slate-600'} hover:text-[#FF3B1D]`}>
                  More <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full -left-4 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-2 p-1 z-50">
                  <Link href="/jpg-to-pdf" className={`block px-4 py-2 text-sm rounded-xl font-bold cursor-pointer transition-colors ${isActive('/jpg-to-pdf') ? 'bg-orange-50 text-[#FF3B1D]' : 'text-slate-600 hover:bg-orange-50 hover:text-[#FF3B1D]'}`}>JPG to PDF</Link>
                  <Link href="/pdf-to-jpg" className={`block px-4 py-2 text-sm rounded-xl font-bold cursor-pointer transition-colors ${isActive('/pdf-to-jpg') ? 'bg-orange-50 text-[#FF3B1D]' : 'text-slate-600 hover:bg-orange-50 hover:text-[#FF3B1D]'}`}>PDF to JPG</Link>
                </div>
              </div>
            </nav>

            <div className="flex items-center gap-2">
              <a href="https://2cube.studio/contact" target="_blank" rel="noopener noreferrer" className="hidden sm:block bg-[#FF3B1D] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-orange-600 shadow-md shadow-orange-500/20 cursor-pointer active:scale-95 transition-all">
                Let's Talk
              </a>
              <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-1.5 text-slate-800 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                {isOpen ? <X className="w-5 h-5 text-[#FF3B1D]" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu with Active Class */}
          <div className={`lg:hidden fixed inset-0 top-14 bg-white w-full h-screen z-[90] transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <nav className="flex flex-col p-4 gap-0.5 text-[15px] font-bold h-full overflow-y-auto">
              <Link href="/merge-pdf" onClick={closeMenu} className={`py-2.5 border-b border-slate-50 rounded-lg px-3 transition-colors ${isActive('/merge-pdf') ? 'text-[#FF3B1D] bg-orange-50/50' : 'text-slate-700 active:bg-slate-50'}`}>Merge PDF</Link>
              <Link href="/split-pdf" onClick={closeMenu} className={`py-2.5 border-b border-slate-50 rounded-lg px-3 transition-colors ${isActive('/split-pdf') ? 'text-[#FF3B1D] bg-orange-50/50' : 'text-slate-700 active:bg-slate-50'}`}>Split PDF</Link>
              <Link href="/compress-pdf" onClick={closeMenu} className={`py-2.5 border-b border-slate-50 rounded-lg px-3 transition-colors ${isActive('/compress-pdf') ? 'text-[#FF3B1D] bg-orange-50/50' : 'text-slate-700 active:bg-slate-50'}`}>Compress PDF</Link>
              <Link href="/pdf-to-word" onClick={closeMenu} className={`py-2.5 border-b border-slate-50 rounded-lg px-3 transition-colors ${isActive('/pdf-to-word') ? 'text-[#FF3B1D] bg-orange-50/50' : 'text-slate-700 active:bg-slate-50'}`}>Convert to Word</Link>
              
              <div className="flex flex-col mt-1">
                <button onClick={() => setIsMoreOpen(!isMoreOpen)} className={`flex items-center justify-between py-3 px-3 font-black cursor-pointer text-[14px] ${isActive('/jpg-to-pdf') || isActive('/pdf-to-jpg') ? 'text-[#FF3B1D]' : 'text-slate-700'}`}>
                  OTHER TOOLS <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMoreOpen && (
                  <div className="flex flex-col gap-0.5 mx-2 bg-slate-50 rounded-xl p-1.5">
                    <Link href="/jpg-to-pdf" onClick={closeMenu} className={`py-2 px-3 text-[13px] font-bold border-b border-white last:border-0 ${isActive('/jpg-to-pdf') ? 'text-[#FF3B1D]' : 'text-slate-500'}`}>JPG to PDF</Link>
                    <Link href="/pdf-to-jpg" onClick={closeMenu} className={`py-2 px-3 text-[13px] font-bold ${isActive('/pdf-to-jpg') ? 'text-[#FF3B1D]' : 'text-slate-500'}`}>PDF to JPG</Link>
                  </div>
                )}
              </div>

              <div className="mt-5 mb-20 px-1">
                 <a href="https://2cube.studio/contact" target="_blank" className="block w-full bg-[#FF3B1D] text-white py-3.5 rounded-xl text-center text-sm font-black active:scale-95 transition-transform uppercase">LET'S TALK</a>
              </div>
            </nav>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center relative z-10 w-full pt-14 md:pt-20">
           {children}
        </main>

        <footer className="border-t border-gray-100 py-6 md:py-8 bg-white/50 backdrop-blur-sm mt-auto w-full">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
            <p className="text-slate-400 text-[12px] md:text-sm font-bold uppercase tracking-widest">© 2026 PDF Machine. Secure by 2cube Studio.</p>
            <div className="flex justify-center gap-6">
              <Link href="/privacy-policy" className={`text-xs font-bold uppercase transition-colors ${isActive('/privacy-policy') ? 'text-[#FF3B1D]' : 'text-slate-400 hover:text-[#FF3B1D]'}`}>Privacy Policy</Link>
              <a href="https://2cube.studio/contact" target="_blank" className="text-slate-400 hover:text-[#FF3B1D] text-xs font-bold uppercase transition-colors">Contact Us</a>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}