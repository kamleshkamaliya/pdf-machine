"use client";

import { ShieldCheck, Lock, EyeOff, Trash2, Clock, Globe } from "lucide-react";
// Hum Head component use karenge SEO ke liye
import Head from 'next/head';

export default function PrivacyPolicy() {
  const policies = [
    {
      icon: <EyeOff className="w-6 h-6 text-[#FF3B1D]" />,
      title: "No Data Logging",
      desc: "We do not read the content of your files or collect any personal data. All processing is strictly private and anonymous."
    },
    {
      icon: <Trash2 className="w-6 h-6 text-[#FF3B1D]" />,
      title: "Auto-Delete Policy",
      desc: "All files are permanently deleted from our servers exactly 60 minutes after processing. We do not keep any backups."
    },
    {
      icon: <Lock className="w-6 h-6 text-[#FF3B1D]" />,
      title: "End-to-End Encryption",
      desc: "Your files are transferred via secure SSL encryption to ensure your data remains 100% safe during upload and download."
    }
  ];

  return (
    <>
      {/* 🌐 SEO META TAGS */}
      <title>Privacy Policy | PDF Machine - Your Data Security is Our Priority</title>
      <meta name="description" content="Learn how PDF Machine protects your documents. We offer secure, encrypted processing with a 60-minute automatic file deletion policy." />

      <div className="w-full flex flex-col items-center bg-[#F8FAFC] min-h-screen pt-32 pb-20 px-6">
        
        {/* 🛡️ HEADER SECTION */}
        <div className="max-w-4xl w-full text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-100 mb-4">
              <ShieldCheck className="w-5 h-5 text-[#FF3B1D]" />
              <span className="text-xs font-bold text-[#FF3B1D] uppercase tracking-widest">Privacy Protected</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 uppercase tracking-tighter">
            Privacy <span className="text-[#FF3B1D]">Policy.</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            At PDF Machine, we believe your data belongs only to you. Here is how we protect your digital documents.
          </p>
        </div>

        {/* 🔐 CORE PRINCIPLES */}
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {policies.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="mb-6 bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center">
                  {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 📝 DETAILED CONTENT */}
        <div className="max-w-4xl w-full bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-10">
          
          <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight flex items-center gap-3">
                  <Clock className="w-6 h-6 text-[#FF3B1D]" /> File Processing
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">
                  When you use our tools (Merge, Split, Compress, etc.), your files are uploaded to a secure encrypted server. Once the processing is complete, you can download your result. We store files in temporary storage that is automatically cleared every 60 minutes.
              </p>
          </section>

          <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight flex items-center gap-3">
                  <Globe className="w-6 h-6 text-[#FF3B1D]" /> Cookies & Analytics
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">
                  We use basic analytics to understand how many users are visiting our site. This never includes your file data or any personal details. We only track tool performance to improve the overall user experience for our global community.
              </p>
          </section>

          <section className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <h4 className="font-bold text-slate-900 uppercase mb-2">Questions?</h4>
              <p className="text-sm text-slate-500 font-medium">
                  If you have any concerns regarding your privacy or data security, please contact us. We are committed to maintaining the highest standards of digital safety for all our users.
              </p>
          </section>

        </div>
      </div>
    </>
  );
}