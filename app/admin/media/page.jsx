"use client";

import { useState, useEffect } from "react";
import { Trash2, Copy, Image as ImageIcon, CheckCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function MediaManager() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [copied, setCopied] = useState(null);

  // 🔄 Fetch Images
  async function loadImages() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadImages();
  }, []);

  // 📋 Copy URL
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  // 🗑️ Delete Image
  const deleteImage = async (filename) => {
    if (!confirm("Are you sure you want to delete this image? It will be removed from posts too.")) return;

    setDeleting(filename);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });

      if (res.ok) {
        setFiles(files.filter((f) => f.name !== filename));
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      alert("Error deleting file");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Media Library</h1>
            <p className="text-slate-500 text-sm font-bold">Manage uploaded images ({files.length})</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={loadImages} 
                className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-all"
                title="Refresh"
             >
                <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
             </button>
             <Link href="/admin/posts" className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
                Back to Posts
             </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>
                ))}
            </div>
        )}

        {/* Empty State */}
        {!loading && files.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-600">No images found</h3>
                <p className="text-slate-400 text-sm">Uploaded images will appear here.</p>
            </div>
        )}

        {/* 🖼️ Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {files.map((file) => (
            <div key={file.name} className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden">
              
              {/* Image Thumbnail */}
              <div className="aspect-square bg-slate-100 relative overflow-hidden">
                <img 
                  src={file.url} 
                  alt={file.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                        onClick={() => copyToClipboard(file.url)}
                        className="p-2 bg-white rounded-full text-slate-700 hover:text-blue-600 hover:scale-110 transition-transform shadow-lg"
                        title="Copy URL"
                    >
                        {copied === file.url ? <CheckCircle className="w-4 h-4 text-green-600"/> : <Copy className="w-4 h-4"/>}
                    </button>
                    <button 
                        onClick={() => deleteImage(file.name)}
                        className="p-2 bg-white rounded-full text-slate-700 hover:text-red-600 hover:scale-110 transition-transform shadow-lg"
                        title="Delete Image"
                    >
                        {deleting === file.name ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"/> : <Trash2 className="w-4 h-4"/>}
                    </button>
                </div>
              </div>

              {/* File Info */}
              <div className="p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase truncate mb-1">{file.name}</p>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded">{file.size}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}