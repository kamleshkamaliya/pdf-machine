"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

// --- 🛠️ FAQ ITEM COMPONENT (TOGGLE LOGIC) ---
function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0 transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 md:py-6 flex items-center justify-between text-left cursor-pointer group"
      >
        {/* Font Weight updated to Bold (700) */}
        <span className={`text-[14px] md:text-[16px] font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-[#FF3B1D]' : 'text-slate-800 group-hover:text-slate-900'}`}>
          {question}
        </span>
        
        <div className={`p-1.5 rounded-full transition-all duration-300 ${isOpen ? 'bg-orange-50 text-[#FF3B1D] rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
           <ChevronDown className="w-4 h-4" />
        </div>
      </button>
      
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-slate-500 font-medium leading-relaxed text-[13px] md:text-[15px] max-w-[90%]">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const tools = [
    {
      title: "Merge PDF",
      desc: "Combine multiple PDF files into one single document.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
      ),
      link: "/merge-pdf",
      badge: "Popular",
    },
    {
      title: "Split PDF",
      desc: "Extract pages from your PDF or save each page as separate file.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm8.486-8.486a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243z"></path></svg>
      ),
      link: "/split-pdf",
    },
    {
      title: "Compress PDF",
      desc: "Reduce file size while maintaining the best quality.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
      ),
      link: "/compress-pdf",
      badge: "New",
    },
    {
      title: "JPG to PDF",
      desc: "Combine multiple images into a single searchable PDF document.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      link: "/jpg-to-pdf",
    },
    {
      title: "PDF to JPG",
      desc: "Convert PDF pages into high-quality JPG images.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      link: "/pdf-to-jpg",
    },
    
  ];

  return (
    <div className="w-full flex flex-col items-center bg-[#F8FAFC] min-h-screen">
      
      {/* 🟢 HERO SECTION */}
      <section className="pt-18 pb-15 px-6 text-center space-y-6 max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900 leading-tight">
          Master Your Documents with <br className="hidden md:block"/>
          <span className="text-[#FF3B1D]">PDF MACHINE.</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-1xl max-w-3xl mx-auto font-medium leading-relaxed">
          Fast, secure, and free tools to manage your PDFs. Merge, split, compress, and convert in seconds without any signup.
        </p>
        
      </section>

      {/* 🟡 TOOLS GRID */}
      <section id="tools" className="w-full max-w-[1180px] px-6 mb-24 scroll-mt-24 md:scroll-mt-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Link href={tool.link} key={index} className="group relative block cursor-pointer">
              <div className="h-full bg-white border border-slate-200 rounded-[2rem] p-8 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2">
                {tool.badge && (
                  <span className="absolute top-6 right-8 bg-[#FF3B1D] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                    {tool.badge}
                  </span>
                )}
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF3B1D] mb-6 group-hover:bg-[#FF3B1D] group-hover:text-white transition-all duration-300">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#FF3B1D] transition-colors uppercase tracking-tight">
                  {tool.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                  {tool.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🟠 WHY CHOOSE US */}
      <section className="w-full bg-white py-20 px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
                <div className="text-[#FF3B1D] font-bold text-4xl">01.</div>
                <h4 className="text-xl font-bold text-slate-900 uppercase">Privacy First</h4>
                <p className="text-slate-500 font-medium">Your files are processed locally and deleted automatically after 1 hour. We never store your data.</p>
            </div>
            <div className="space-y-4">
                <div className="text-[#FF3B1D] font-bold text-4xl">02.</div>
                <h4 className="text-xl font-bold text-slate-900 uppercase">Lightning Fast</h4>
                <p className="text-slate-500 font-medium">Optimized servers ensure your PDFs are processed in milliseconds, no matter the file size.</p>
            </div>
            <div className="space-y-4">
                <div className="text-[#FF3B1D] font-bold text-4xl">03.</div>
                <h4 className="text-xl font-bold text-slate-900 uppercase">100% Free</h4>
                <p className="text-slate-500 font-medium">Access all professional PDF tools for free. No hidden costs, no subscriptions, no limits.</p>
            </div>
        </div>
      </section>

      {/* 🔒 SECURITY & PRIVACY SECTION */}
      <section className="w-full py-20 px-6 bg-orange-50/50">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-orange-100 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">End-to-End Encrypted</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 uppercase tracking-tighter">Your Security is our <span className="text-[#FF3B1D]">Priority.</span></h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-3xl mx-auto">
            We understand how important your documents are. PDF Machine uses military-grade encryption to ensure that your files never fall into the wrong hands.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-12 px-2">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div>
                      <h6 className="font-bold text-slate-800 uppercase text-sm mb-1">Auto-Delete</h6>
                      <p className="text-xs text-slate-500 font-bold">All files are wiped from our servers within 60 minutes.</p>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </div>
                  <div>
                      <h6 className="font-bold text-slate-800 uppercase text-sm mb-1">No Storage</h6>
                      <p className="text-xs text-slate-500 font-bold">We do not store, read, or share your content with third parties.</p>
                  </div>
              </div>
          </div>
        </div>
      </section>

      {/* 🔴 ACCORDION FAQ SECTION */}
      <section className="w-full py-24 px-6 max-w-4xl mx-auto">
    <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 uppercase tracking-tighter">
          Got Questions? <span className="text-[#FF3B1D]">Answers Inside.</span>
        </h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Everything you need to know about PDF Machine</p>
    </div>

    <div className="bg-white rounded-[2.5rem] p-4 md:p-10 shadow-[0_10px_50px_rgba(0,0,0,0.03)] border border-slate-50">
        <FaqItem 
          question="1. Is PDF Machine completely free to use?" 
          answer="Yes, it is 100% free! We do not have any hidden charges, and you don't need to create an account to use our professional PDF tools." 
        />
        <FaqItem 
          question="2. Will my file quality decrease after compression?" 
          answer="Not at all. Our advanced algorithm is designed to reduce file size while perfectly balancing document clarity and image quality." 
        />
        <FaqItem 
          question="3. How many files can I merge at once?" 
          answer="You can merge unlimited PDF files. Our batch processing system is optimized to handle large documents smoothly and efficiently." 
        />
        <FaqItem 
          question="4. Is it possible to convert PDFs on mobile devices?" 
          answer="Absolutely! PDF Machine is fully responsive. You can upload and convert files directly from your iPhone or Android browser without any issues."
        />
        <FaqItem 
          question="5. Will the converted Word file be editable?" 
          answer="Yes, we provide the standard Microsoft Word (.docx) format, allowing you to easily edit and modify the content in any word processor." 
        />
        <FaqItem 
          question="6. Is PDF Machine safe and secure for my data?" 
          answer="Privacy is our top priority. All files are encrypted during transfer and are automatically deleted from our servers after 60 minutes."
        />
    </div>
</section>



      {/* 🔵 FOOTER CTA */}

    </div>
  );
}