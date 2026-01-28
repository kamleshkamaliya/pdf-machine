"use client";

import { useState } from 'react';
import { Send, MessageSquare, Loader2, CheckCircle, AlertCircle, Mail, User, Bug, Lightbulb, Heart } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'suggestion', // Default: Suggestion
    message: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message) return;

    setStatus('loading');

    // Simulate API Call (Baad mein real API laga sakte hain)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', type: 'suggestion', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <>
      <title>Contact Us - Send Feedback & Feature Requests | PDF MACHINE</title>
      <meta name="description" content="Have a suggestion or found a bug? Let us know! We are constantly improving PDF Machine based on your feedback." />

      <div className="pt-13 md:pt-15 pb-20 px-4 md:px-6 relative w-full min-h-screen flex flex-col items-center bg-slate-50/50">
        
        {/* Background Blobs */}
        <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-orange-200/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob -z-10"></div>
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-red-200/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 -z-10"></div>

        <div className="w-full max-w-2xl z-10">
          
          {/* HEADER */}
          <div className="text-center mb-10">
             <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6 text-[#FF3B1D]">
                <MessageSquare className="w-8 h-8" />
             </div>
             <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
               Let's <span className="text-[#FF3B1D]">Talk.</span>
             </h1>
             <p className="text-slate-500 text-lg font-medium max-w-lg mx-auto leading-relaxed">
               Found a bug? Want a new feature? or just want to say hi? We read every single message.
             </p>
          </div>

          {/* MAIN FORM CARD */}
          <div className="w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-orange-500/10 ring-1 ring-white/60 border border-white/40">
            
            {status === 'success' ? (
              <div className="text-center py-16 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Message Sent!</h2>
                <p className="text-slate-500 mb-8">Thanks for your feedback. We'll look into it ASAP.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">What is this about?</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: 'bug', icon: Bug, label: 'Report Bug' },
                      { id: 'feature', icon: Lightbulb, label: 'New Feature' },
                      { id: 'suggestion', icon: MessageSquare, label: 'Suggestion' },
                      { id: 'other', icon: Heart, label: 'Other' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTypeChange(item.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                          formData.type === item.id 
                            ? 'border-[#FF3B1D] bg-orange-50 text-[#FF3B1D]' 
                            : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-bold uppercase">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Your Name (Optional)</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:border-[#FF3B1D] focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:border-[#FF3B1D] focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Message */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Your Message</label>
                  <textarea 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell us details about the bug or your feature idea..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:border-[#FF3B1D] focus:ring-4 focus:ring-orange-500/10 transition-all outline-none resize-none"
                  ></textarea>
                </div>

                {status === 'error' && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Something went wrong. Please try again.
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full py-4 bg-[#FF3B1D] hover:bg-orange-600 text-white font-bold text-lg rounded-xl shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <> <Loader2 className="animate-spin w-5 h-5"/> Sending... </>
                  ) : (
                    <> Send Message <Send className="w-5 h-5" /> </>
                  )}
                </button>

              </form>
            )}

          </div>

       

        </div>
      </div>
    </>
  );
}