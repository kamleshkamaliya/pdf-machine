"use client";

import { useState } from "react";
import { 
  FileText, Loader2, AlertTriangle, 
  TrendingUp, BrainCircuit, UploadCloud, 
  BarChart3, ScanSearch, CheckCircle2, ShieldCheck, Zap 
} from "lucide-react";

export default function ResumeScorerClient() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
      setResult(null);
    } else {
      setError("Please upload a valid PDF resume.");
    }
  };

  const handleAnalyze = async () => {
    if (!file) return setError("Please upload a resume first.");
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to analyze resume.");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function for Progress Bars
  const ScoreBar = ({ label, score, colorClass }) => (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-bold text-slate-600 capitalize">{label}</span>
        <span className="text-sm font-bold text-slate-900">{score}/100</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full transition-all duration-1000 ${colorClass}`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-2xl mb-6 shadow-sm">
              <BrainCircuit size={32} />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 md:text-6xl tracking-tight mb-6">
              Smart AI Resume Check
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              Is your resume invisible to recruiters? Get a free <strong>AI SEO Audit</strong> and ATS score in seconds.
            </p>
            
            {/* MAIN TOOL CARD */}
            <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden relative z-10">
              <div className="p-8 md:p-12">
                {!result ? (
                  // UPLOAD STATE
                  <div className="transition-all duration-500 ease-in-out">
                    {!file ? (
                      <label className="group relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50 hover:bg-white hover:border-red-500 transition-all cursor-pointer">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                              <UploadCloud className="text-red-500" size={40} />
                          </div>
                          <p className="text-xl text-slate-700 font-bold mb-2">Upload Resume PDF</p>
                          <p className="text-sm text-slate-400 font-medium">Free ATS Scan (Max 5MB)</p>
                        </div>
                        <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                      </label>
                    ) : (
                      <div className="space-y-8 max-w-lg mx-auto text-center">
                        <div className="flex items-center justify-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                          <FileText className="text-red-600" size={32} />
                          <div className="text-left">
                            <p className="font-bold text-slate-800 text-lg truncate max-w-[200px]">{file.name}</p>
                            <p className="text-sm text-slate-500">Ready for scan</p>
                          </div>
                          <button onClick={() => setFile(null)} className="ml-auto text-sm font-bold text-red-500 hover:text-red-700 px-3 py-1 bg-red-50 rounded-lg">Change</button>
                        </div>
                        <button
                          onClick={handleAnalyze}
                          disabled={loading}
                          className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xl rounded-2xl shadow-lg shadow-slate-900/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                        >
                          {loading ? <Loader2 className="animate-spin" /> : <BrainCircuit />}
                          {loading ? "Scanning Keywords..." : "Analyze Resume Now"}
                        </button>
                      </div>
                    )}
                    {error && (
                      <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 font-medium animate-pulse">
                        <AlertTriangle size={20} /> {error}
                      </div>
                    )}
                  </div>
                ) : (
                  // RESULTS DASHBOARD
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-10 text-left">
                    {/* Score Card */}
                    <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                      <div className="relative shrink-0 text-center">
                        <div className={`w-32 h-32 rounded-full border-[6px] flex items-center justify-center text-5xl font-black shadow-lg
                          ${result.overall_score >= 75 ? 'border-green-400 text-green-400' : 'border-orange-500 text-orange-500'}`}>
                          {result.overall_score}
                        </div>
                      </div>
                      <div className="flex-1 text-center md:text-left z-10">
                        <h3 className="text-xl font-bold text-slate-200 mb-2">AI Verdict</h3>
                        <p className="text-lg font-medium leading-relaxed text-slate-300">"{result.score_reason}"</p>
                      </div>
                    </div>

                    {/* Breakdown Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <ScoreBar label="Impact" score={result.breakdown?.impact || 0} colorClass="bg-blue-500" />
                        <ScoreBar label="Keywords" score={result.breakdown?.keywords || 0} colorClass="bg-purple-500" />
                        <ScoreBar label="Format" score={result.breakdown?.formatting || 0} colorClass="bg-pink-500" />
                        <ScoreBar label="Brevity" score={result.breakdown?.brevity || 0} colorClass="bg-orange-500" />
                    </div>

                    {/* Critical Issues (SEO Audit) */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                        <h4 className="font-bold text-red-700 mb-4 flex items-center gap-2"><ScanSearch size={20} /> Missing Keywords</h4>
                        <ul className="space-y-2">
                          {result.critical_missing_skills?.map((skill, i) => (
                            <li key={i} className="bg-white px-3 py-2 rounded-lg text-sm text-slate-700 border border-red-100 shadow-sm flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                         <h4 className="font-bold text-green-700 mb-4 flex items-center gap-2"><TrendingUp size={20} /> How to Improve</h4>
                         <ul className="space-y-2">
                          {result.action_plan?.map((step, i) => (
                            <li key={i} className="text-sm text-slate-700 leading-snug flex gap-2">
                              <span className="font-bold text-green-600">{i+1}.</span> {step}
                            </li>
                          ))}
                         </ul>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => { setFile(null); setResult(null); }}
                      className="w-full py-4 bg-white border-2 border-slate-200 hover:border-slate-800 text-slate-600 font-bold rounded-2xl transition-all"
                    >
                      Scan Another Resume
                    </button>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>

      {/* --- SEO SECTION 1: HOW IT WORKS --- */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">How Our AI Resume Checker Works</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We use advanced NLP (Natural Language Processing) to simulate how a corporate recruiter's ATS (Applicant Tracking System) reads your file.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <UploadCloud size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Upload PDF</h3>
              <p className="text-slate-500 leading-relaxed">Simply drag and drop your resume. We process the file securely in RAM and delete it immediately after analysis.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">2. AI Scan</h3>
              <p className="text-slate-500 leading-relaxed">Our AI scans for "Hard Skills," readability, and formatting errors that confuse standard ATS software.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Get Scored</h3>
              <p className="text-slate-500 leading-relaxed">Receive an actionable score (0-100) and a list of missing keywords to fix before you apply.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEO SECTION 2: WHY ATS MATTERS --- */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
             <div className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full font-bold text-sm mb-6">
                The Hidden Barrier
             </div>
             <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
               Why 75% of Resumes Are Rejected by Robots
             </h2>
             <p className="text-slate-500 text-lg leading-relaxed mb-6">
               Most companies use <strong>Applicant Tracking Systems (ATS)</strong> to filter candidates before a human ever sees them. If your resume lacks specific SEO keywords or has complex formatting, you get auto-rejected.
             </p>
             <ul className="space-y-4">
               <li className="flex items-center gap-3 font-medium text-slate-700">
                 <CheckCircle2 className="text-green-500" /> Parsability Check (Can robots read it?)
               </li>
               <li className="flex items-center gap-3 font-medium text-slate-700">
                 <CheckCircle2 className="text-green-500" /> Keyword Density Analysis
               </li>
               <li className="flex items-center gap-3 font-medium text-slate-700">
                 <CheckCircle2 className="text-green-500" /> Measurable Impact Scoring
               </li>
             </ul>
          </div>
          <div className="md:w-1/2 bg-slate-50 p-8 rounded-[3rem] border border-slate-200">
            {/* Visual representation of 'Good vs Bad' resume elements */}
            <div className="space-y-4">
               <div className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 items-center">
                  <div className="p-3 bg-red-100 text-red-500 rounded-xl"><AlertTriangle size={20}/></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Avoid Graphics</h4>
                    <p className="text-xs text-slate-500">Charts & columns confuse the parser.</p>
                  </div>
               </div>
               <div className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 items-center">
                  <div className="p-3 bg-green-100 text-green-500 rounded-xl"><CheckCircle2 size={20}/></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Use Standard Headings</h4>
                    <p className="text-xs text-slate-500">Stick to "Experience" and "Skills".</p>
                  </div>
               </div>
               <div className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 items-center">
                  <div className="p-3 bg-purple-100 text-purple-500 rounded-xl"><Zap size={20}/></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Quantify Results</h4>
                    <p className="text-xs text-slate-500">Use numbers (e.g., "Increased sales by 20%").</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEO SECTION 3: FAQ (Rich Snippet Target) --- */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <details className="group bg-white p-6 rounded-2xl border border-slate-200 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between gap-1.5 font-bold text-slate-900 text-lg">
                Is this AI Resume Checker free?
                <span className="shrink-0 rounded-full bg-slate-50 p-1.5 text-slate-900 sm:p-3 group-open:bg-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-slate-600">Yes, our resume scorer is completely free to use. We believe everyone deserves a fair chance at landing their dream job without paying for basic analysis.</p>
            </details>

            <details className="group bg-white p-6 rounded-2xl border border-slate-200 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between gap-1.5 font-bold text-slate-900 text-lg">
                What is a good ATS score?
                <span className="shrink-0 rounded-full bg-slate-50 p-1.5 text-slate-900 sm:p-3 group-open:bg-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-slate-600">A score above <strong>80/100</strong> is considered excellent and indicates your resume is highly readable by bots. A score below 60 usually means you have formatting issues or missing keywords.</p>
            </details>

            <details className="group bg-white p-6 rounded-2xl border border-slate-200 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between gap-1.5 font-bold text-slate-900 text-lg">
                Do you store my resume data?
                <span className="shrink-0 rounded-full bg-slate-50 p-1.5 text-slate-900 sm:p-3 group-open:bg-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-slate-600">No. We prioritize your privacy. Your file is processed in real-time and is not stored on our servers after the session ends.</p>
            </details>
          </div>
        </div>
      </section>

    </div>
  );
}