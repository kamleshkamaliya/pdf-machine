"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0 transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 md:py-6 flex items-center justify-between text-left cursor-pointer group"
      >
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

export default function HomeFaq() {
  return (
    <div className="bg-white rounded-[2.5rem] p-4 md:p-10 shadow-[0_10px_50px_rgba(0,0,0,0.03)] border border-slate-50">
      <FaqItem question="1. Is PDF Machine completely free to use?" answer="Yes, all professional tools on PDF Machine are 100% free with no hidden subscriptions or limits." />
      <FaqItem question="2. Will my file quality decrease after compression or conversion?" answer="Our advanced algorithms are designed to maintain high quality while optimizing file size." />
      <FaqItem question="3. Do I need to create an account to sign or merge PDFs?" answer="No account or signup is required. You can start using our tools instantly." />
      <FaqItem question="4. Can I use PDF Machine on my mobile device?" answer="Absolutely! Our platform is fully responsive and works perfectly on iPhone, Android, and tablets." />
      <FaqItem question="5. What file formats are supported for conversion?" answer="We support JPG, PNG, WebP, and standard PDF documents for various conversions." />
      <FaqItem question="6. Is PDF Machine safe for my sensitive data?" answer="Privacy is our top priority. Files are processed locally or through encrypted tunnels and are automatically deleted after 60 minutes." />
    </div>
  );
}