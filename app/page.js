import Link from "next/link";
import { Lock, Shield } from "lucide-react";

// 👇 PATH FIXED HERE ( ./ lagaya hai )
import HomeFaq from "./components/HomeFaq"; 

// ✅ SEO METADATA
export const metadata = {
  title: "PDF Machine | Free Online PDF Tools: Merge, Split, Sign & Compress",
  description: "Fast, secure, and 100% free online PDF tools. Merge, split, compress, sign, and convert PDFs instantly.",
  alternates: {
    canonical: "https://pdfmachine.pro",
  },
};

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
      title: "Word to PDF",
      desc: "Convert your DOC and DOCX files to PDF instantly while preserving original formatting and layout.",
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          // Default color brand hai, group-hover pe white ho jayega
          className="w-6 h-6 text-[#ff3b1d] group-hover:text-white transition-colors duration-300"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
          <path d="M8 13h8"/>
          <path d="M8 17h8"/>
          <path d="M10 9H8"/>
        </svg>
      ),
      link: "/word-to-pdf",
      comingSoon: false,
      badge: "New", 
    },
   {
      title: "Smart AI Resume Checker", // High volume keyword: "Resume Checker"
      desc: "Get a detailed ATS score, AI SEO audit, and find out exactly why your resume is rejected. Includes step-by-step action plan to fix it.", // Keywords: ATS Score, AI SEO, Rejected, Action Plan
      icon: (
        // Icon: Resume (File) + AI (Brain/Sparkle)
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-6 h-6 text-[#ff3b1d] group-hover:text-white transition-colors duration-300"
        >
          {/* Resume Outline */}
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7l-5-5z"/>
          {/* Text Lines (Resume Content) */}
          <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
          <path d="M10 9H8"/>
          <path d="M16 13H8"/>
          <path d="M16 17H8"/>
          {/* AI/Brain Sparkle Effect (Top Right) */}
          <path d="M21 7l-2-2"/> 
          <path d="M22 4l-3 3"/>
        </svg>
      ),
      link: "/resume-scorer", // Aapka naya page route
      comingSoon: false,
      badge: "AI Powered", // "New" se behtar "AI Powered" hai kyunki ye value dikhata hai
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
      title: "JPG to PDF",
      desc: "Combine JPG, PNG, and WebP images into a single professional PDF document. Fast, secure, and 100% free.",
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" />
        </svg>
      ),
      link: "/pdf-to-jpg",
    },
    {
      title: "Compress PDF",
      desc: "Reduce file size while maintaining the best quality.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
      ),
      link: "/compress-pdf",
    },
    {
      title: "Sign PDF",
      desc: "Add digital signatures to your documents securely.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
      ),
      link: "/sign-pdf", 
    
    },
    {
      title: "Protect PDF",
      desc: "Add AES-256 password protection to your PDF instantly. Secure, fast, and free encryption.",
      icon: <Shield className="w-6 h-6" />,
      link: "/protect-pdf",
      comingSoon: false,
      badge: "Secure",
     
    },
        {
      title: "Unlock PDF",
      desc: "Remove password protection and security restrictions from your PDF files instantly. 100% free and secure.",
      icon: <Lock className="w-6 h-6" />, // ✅ LockOpen icon with red color for 'Unlock' vibe
      link: "/unlock-pdf",
      comingSoon: false,
      badge: "Popular", 
    },
 {
      title: "PDF to Word",
      desc: "Convert PDF files to editable Word (DOCX) documents. Powered by AI for high accuracy.",
      // Custom Word Icon (Blue & Clean)
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-6 h-6  group-hover:text-white transition-colors duration-300"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
          <path d="M12 18v-6"/>
          <path d="M9 15l3 3 3-3"/>
        </svg>
      ),
      link: "/pdf-to-word",
      comingSoon: false,
      badge: "Hot", // Ye tool sabse zyada demand mein rehta hai
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
            tool.comingSoon ? (
              <div key={index} className="relative block h-full select-none">
                <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-start opacity-70">
                   <span className="absolute top-6 right-8 bg-slate-800 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Coming Soon
                  </span>
                  <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400 mb-6 grayscale">
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-400 mb-3 uppercase tracking-tight">
                    {tool.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-semibold">
                    {tool.desc}
                  </p>
                </div>
              </div>
            ) : (
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
            )
          ))}
        </div>
      </section>

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
        </div>
      </section>

      <section className="w-full py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 uppercase tracking-tighter">
              Got Questions? <span className="text-[#FF3B1D]">Answers Inside.</span>
            </h2>
        </div>
        
        {/* ✅ FAQ Component Loaded */}
        <HomeFaq />
        
      </section>
    </div>
  );
}