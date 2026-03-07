"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown"; 
import { 
  FileText, Loader2, AlertTriangle, 
  UploadCloud, Send, Bot, User, MessageSquare, Trash2,
  Zap, ShieldCheck, FileSearch, CheckCircle2
} from "lucide-react";

export default function ChatPDFClient() {
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");

  const chatContainerRef = useRef(null);
  const brandColor = "#ff3b1d"; 

  // Scroll Fix: Sirf chat container scroll hoga, pura page jump nahi karega
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== "application/pdf") {
      return setError("Please upload a valid PDF document.");
    }

    setFile(selectedFile);
    setError("");
    setIsUploading(true);
    setMessages([]);
    setFileId(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/chat-pdf/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to process the PDF.");
      const data = await res.json();
      
      setFileId(data.fileId); 
      setMessages([
        { role: "assistant", content: `I've successfully read **${selectedFile.name}**. What would you like to know about it?` }
      ]);
      
    } catch (err) {
      setError(err.message);
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !fileId) return;

    const userMessage = input.trim();
    setInput("");
    setError("");
    
    const updatedMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat-pdf/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Chat history send kar rahe hain context ke liye
        body: JSON.stringify({ 
          fileId, 
          question: userMessage,
          history: messages.slice(-4) 
        }),
      });

      if (!res.ok) throw new Error("Failed to get an answer.");
      const data = await res.json();

      setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileId(null);
    setMessages([]);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-sm" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
              <MessageSquare size={32} />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 md:text-5xl tracking-tight mb-4">
              Chat with any PDF Document
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              Stop reading long documents. Upload your PDF and instantly ask questions, extract summaries, and find exact data points using our free AI assistant.
            </p>
            
            {/* MAIN TOOL CARD */}
            <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden relative z-10 flex flex-col min-h-[300px]">
              
              {!fileId && !isUploading ? (
                // --- UPLOAD SCREEN (Extra Padding & Margin Added) ---
                <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center bg-slate-50/50">
                  <label 
                    className="group relative flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-8 md:py-16 border-2 border-dashed border-slate-300 rounded-[2.5rem] bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                    style={{ '--hover-border-color': brandColor }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = brandColor}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                  >
                    <div className="flex flex-col items-center justify-center text-center px-6">
                      <div className="p-5 bg-slate-50 rounded-full shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                          <UploadCloud size={56} style={{ color: brandColor }} />
                      </div>
                      <p className="text-2xl text-slate-800 font-bold mb-3">Upload PDF to Chat</p>
                      <p className="text-base text-slate-500 font-medium">Free AI Analysis (Max 10MB)</p>
                    </div>
                    <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                  </label>
                  
                  {error && (
                    <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 font-medium animate-pulse">
                      <AlertTriangle size={20} /> {error}
                    </div>
                  )}
                </div>
              ) : isUploading ? (
                // --- UPLOADING STATE ---
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                  <Loader2 className="animate-spin mb-6" size={48} style={{ color: brandColor }} />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Reading your document...</h3>
                  <p className="text-slate-500">Extracting text and preparing the AI model.</p>
                </div>
              ) : (
                // --- CHAT INTERFACE ---
                <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
                  <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-sm z-10 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}><FileText size={20} /></div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm truncate max-w-[200px] sm:max-w-xs">{file?.name}</p>
                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span> AI Ready
                        </p>
                      </div>
                    </div>
                    <button onClick={handleReset} className="text-slate-400 hover:text-red-500 transition-colors p-2" title="Close File">
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Chat Area - Left Aligned */}
                  <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth"
                  >
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm text-white`}
                          style={{ backgroundColor: msg.role === "assistant" ? brandColor : '#1e293b' }}
                        >
                          {msg.role === "assistant" ? <Bot size={20} /> : <User size={20} />}
                        </div>
                        
                        <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm text-left
                          ${msg.role === "assistant" 
                            ? "bg-white border border-slate-200 text-slate-800 rounded-tl-none w-full" 
                            : "bg-slate-900 text-white rounded-tr-none inline-block"}`}>
                          
                          {msg.role === "assistant" ? (
                             <div className="prose prose-slate prose-p:leading-relaxed prose-pre:bg-slate-100 prose-pre:text-slate-800 prose-ul:pl-4 max-w-none w-full text-left">
                               <ReactMarkdown>
                                 {msg.content}
                               </ReactMarkdown>
                             </div>
                          ) : (
                            msg.content
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full text-white flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: brandColor }}>
                          <Bot size={20} />
                        </div>
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                           <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                           <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                           <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="px-6 py-2 shrink-0">
                      <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center text-left">
                        {error}
                      </div>
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about this document..."
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 transition-all shadow-inner focus:bg-white"
                        style={{ outlineColor: brandColor }}
                        onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${brandColor}40`}
                        onBlur={(e) => e.target.style.boxShadow = 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'}
                        disabled={isTyping}
                      />
                      <button 
                        type="submit" 
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 p-3 text-white rounded-xl disabled:opacity-50 transition-all shadow-md"
                        style={{ backgroundColor: brandColor }}
                      >
                        <Send size={18} />
                      </button>
                    </form>
                  </div>
                  
                </div>
              )}
            </div>
        </div>
      </div>

      {/* --- SEO SECTION 1: HOW IT WORKS --- */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">How Our AI Chatbot Analyzes PDFs</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We use advanced Natural Language Processing to make your static documents conversational in seconds.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                <UploadCloud size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Upload Document</h3>
              <p className="text-slate-500 leading-relaxed">Simply drop your PDF (contracts, resumes, or essays). Our system extracts the text with high accuracy.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                <Bot size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Ask Anything</h3>
              <p className="text-slate-500 leading-relaxed">Type your question. The AI scans the entire document to find the exact paragraph containing your answer.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Instant Insights</h3>
              <p className="text-slate-500 leading-relaxed">Get simplified summaries, bullet points, and actionable checklists derived strictly from your file.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEO SECTION 2: USE CASES --- */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
             <div className="inline-block px-4 py-2 rounded-full font-bold text-sm mb-6" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                Save Hours of Reading
             </div>
             <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
               Why Professionals Talk to Their Documents
             </h2>
             <p className="text-slate-500 text-lg leading-relaxed mb-6">
               Whether you are a student facing a 100-page research paper or a lawyer reviewing a dense contract, scrolling to find one specific clause is a waste of time.
             </p>
             <ul className="space-y-4">
               <li className="flex items-center gap-3 font-medium text-slate-700">
                 <CheckCircle2 style={{ color: brandColor }} /> <strong>Students:</strong> Summarize textbooks and study guides.
               </li>
               <li className="flex items-center gap-3 font-medium text-slate-700">
                 <CheckCircle2 style={{ color: brandColor }} /> <strong>HR Teams:</strong> Extract skills and experience from Resumes.
               </li>
               <li className="flex items-center gap-3 font-medium text-slate-700">
                 <CheckCircle2 style={{ color: brandColor }} /> <strong>Researchers:</strong> Find data points in scientific journals.
               </li>
             </ul>
          </div>
          <div className="md:w-1/2 bg-slate-50 p-8 rounded-[3rem] border border-slate-200">
             <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
                <FileSearch size={48} style={{ color: brandColor }} className="mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">100% Accurate Retrieval</h3>
                <p className="text-slate-500">Our AI is strictly instructed to only answer based on the text provided in your PDF. No guessing, no hallucinations. Just facts.</p>
             </div>
          </div>
        </div>
      </section>

      {/* --- SEO SECTION 3: PRIVACY --- */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <ShieldCheck size={64} className="mx-auto mb-6 text-green-400" />
          <h2 className="text-3xl font-extrabold mb-6">Enterprise-Grade Security & Privacy</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            Your documents contain sensitive information. When you use PDF Machine to chat with your files, the PDF is processed securely in RAM. Once your session ends, the text is completely wiped from our temporary servers. We never store, read, or train models on your private data.
          </p>
        </div>
      </section>

      {/* --- SEO SECTION 4: FAQ (Rich Snippet Target) --- */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-12 text-slate-900">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <details className="group bg-white p-6 rounded-2xl border border-slate-200 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between gap-1.5 font-bold text-slate-900 text-lg">
                Is the AI PDF Chatbot completely free?
                <span className="shrink-0 rounded-full bg-slate-50 p-1.5 text-slate-900 sm:p-3 group-open:bg-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-slate-600">Yes, you can upload your PDFs and ask questions entirely for free. There is a file size limit (usually 10MB) to ensure our servers remain fast for everyone.</p>
            </details>

            <details className="group bg-white p-6 rounded-2xl border border-slate-200 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between gap-1.5 font-bold text-slate-900 text-lg">
                Can the AI read scanned images or handwriting?
                <span className="shrink-0 rounded-full bg-slate-50 p-1.5 text-slate-900 sm:p-3 group-open:bg-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-slate-600">Currently, our tool works best with text-based PDFs (like Word documents converted to PDF). If your PDF is a flat scanned image, the AI may not be able to extract the text without OCR technology.</p>
            </details>

            <details className="group bg-white p-6 rounded-2xl border border-slate-200 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between gap-1.5 font-bold text-slate-900 text-lg">
                Will the AI make up answers?
                <span className="shrink-0 rounded-full bg-slate-50 p-1.5 text-slate-900 sm:p-3 group-open:bg-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-slate-600">No. We use a strict prompt architecture that forces the AI to answer *only* based on the text provided in your document. If the answer is not in the PDF, the AI will clearly tell you it cannot find it.</p>
            </details>
          </div>
        </div>
      </section>

    </div>
  );
}