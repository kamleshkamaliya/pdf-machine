"use client";

import { useState } from "react";
import { Lock, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Invalid credentials");
      }

      window.location.href = "/admin/posts";
    } catch (e) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <title>Admin Login | PDF MACHINE</title>
      <meta name="robots" content="noindex,nofollow" />

      <div className="pt-15 pb-15 px-4 md:px-6 relative w-full min-h-screen flex flex-col items-center bg-slate-50/50">
        {/* background blobs (same style as Protect PDF) */}
        <div className="fixed top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full mix-blend-multiply filter blur-[100px] animate-blob -z-10 transition-colors duration-700 bg-blue-200/30"></div>
        <div className="fixed bottom-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 -z-10 transition-colors duration-700 bg-cyan-200/30"></div>

        <div className="w-full max-w-xl z-10">
          {/* header */}
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Admin <span className="text-blue-600">Login</span>
            </h1>
            <p className="text-slate-500 mt-3 text-base md:text-lg font-medium max-w-2xl mx-auto">
              Secure access for managing blog posts.
            </p>
          </div>

          {/* card */}
          <div className="w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-12 md:pt-6 shadow-2xl ring-1 border border-white/40 transition-colors duration-500 shadow-blue-500/10 ring-white/60">
            {/* info box */}
            {!loading && (
              <div className="mb-6 p-4 rounded-2xl flex items-start gap-4 border transition-colors duration-300 bg-blue-50 border-blue-100">
                <div className="p-2 rounded-lg bg-white/50 text-blue-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider mb-1 text-blue-700">
                    Protected Area
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Use your admin credentials to access the dashboard.
                  </p>
                </div>
              </div>
            )}

            {/* form */}
            <form onSubmit={handleLogin} className="px-2">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                    Email
                  </label>
                  <div className="mt-2 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@pdfmachine.com"
                      className="w-full outline-none text-slate-800 font-semibold bg-transparent"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                    Password
                  </label>
                  <div className="mt-2 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-3">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full outline-none text-slate-800 font-semibold bg-transparent"
                      autoComplete="current-password"
                    />
                  </div>
                </div>
              </div>

              {/* error */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium flex gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* actions */}
              <div className="flex gap-4 pt-6 border-t border-slate-100 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("");
                    setPassword("");
                    setError("");
                  }}
                  disabled={loading}
                  className="px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50 text-sm cursor-pointer"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 text-white font-bold text-lg rounded-xl shadow-xl transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2 cursor-pointer active:scale-95 bg-blue-600 shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" /> Processing...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 mt-6 font-medium">
                Tip: keep your credentials secure. Passwords can’t be recovered.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
