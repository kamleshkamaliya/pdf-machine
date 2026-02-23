"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, Edit, Trash2, Search, FileText, 
  CheckCircle, XCircle, Copy, Loader2 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cloningId, setCloningId] = useState(null); // Cloning loading state
  const router = useRouter();

  // Fetch Posts
  useEffect(() => {
    fetch("/api/admin/posts", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // ✅ Clone Handler
  async function handleClone(post) {
    if (!confirm(`Duplicate post "${post.title}"?`)) return;
    
    setCloningId(post.id);
    try {
      const res = await fetch("/api/admin/posts/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id }),
      });

      if (!res.ok) throw new Error("Failed to clone");
      
      const data = await res.json();
      
      // List refresh karein aur user ko bata dein
      alert("Post cloned successfully as Draft!");
      window.location.reload(); // Page refresh taaki nayi post dikhe
      
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setCloningId(null);
    }
  }

  // Delete Handler
  async function handleDelete(id) {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      alert("Delete failed");
    }
  }

  // Filter Search
  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center text-slate-500 font-bold animate-pulse">Loading Posts...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">All Posts</h1>
            <p className="text-slate-500 text-sm font-bold">Manage your blog content</p>
          </div>
          <Link 
            href="/admin/posts/create" 
            className="flex items-center gap-2 bg-[#ff3b1d] text-white px-5 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30"
          >
            <Plus className="w-5 h-5" /> Create New
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search posts..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent font-bold text-slate-700 outline-none placeholder:font-medium"
          />
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-400 font-bold tracking-wider">
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-slate-800 text-sm line-clamp-1">{post.title}</p>
                      <span className="text-[10px] font-mono text-slate-400">/{post.slug}</span>
                    </td>
                    <td className="p-4">
                      {post.status === "PUBLISHED" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-600 text-[10px] font-bold border border-green-100">
                          <CheckCircle className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200">
                          <FileText className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-500">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* 🟧 Clone Button */}
                        <button 
                          onClick={() => handleClone(post)}
                          disabled={cloningId === post.id}
                          title="Clone Post"
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                        >
                          {cloningId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                        </button>

                        <Link 
                          href={`/admin/posts/edit/${post.id}`} 
                          className="p-2 rounded-lg text-slate-400 hover:text-[#ff3b1d] hover:bg-orange-50 transition-all border border-transparent hover:border-orange-100"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400 font-bold">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}