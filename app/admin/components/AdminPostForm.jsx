"use client";

import { useMemo, useState, useEffect } from "react";
import RichTextEditor from "./RichTextEditor";
import { UploadCloud, Image as ImageIcon, Loader2, Calendar } from "lucide-react"; 

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ✅ Helper: ISO Date ko Input format (YYYY-MM-DDTHH:mm) mein badalne ke liye
const formatDateForInput = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  // Timezone offset adjust karna zaroori hai taaki local time dikhe
  const localIso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
  return localIso;
};

export default function AdminPostForm({ mode = "create", initialValues, onSubmit, busy }) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [seoTitle, setSeoTitle] = useState(initialValues?.seoTitle || "");
  const [slug, setSlug] = useState(initialValues?.slug || "");
  const [authorName, setAuthorName] = useState(initialValues?.authorName || "");
  
  // ✅ New State for Custom Publish Date
  const [publishedAt, setPublishedAt] = useState(initialValues?.publishedAt || new Date().toISOString());

  const [tags, setTags] = useState(initialValues?.tags || ""); 
  const [featuredImageUrl, setFeaturedImageUrl] = useState(initialValues?.featuredImageUrl || "");
  const [featuredImageAlt, setFeaturedImageAlt] = useState(initialValues?.featuredImageAlt || "");
  const [metaDescription, setMetaDescription] = useState(initialValues?.metaDescription || "");
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt || "");
  const [content, setContent] = useState(initialValues?.content || "");
  const [status, setStatus] = useState(initialValues?.status || "DRAFT");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false); 

  // ✅ Effect to update state when initialValues change (Edit Mode fix)
  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || "");
      setSeoTitle(initialValues.seoTitle || "");
      setSlug(initialValues.slug || "");
      setAuthorName(initialValues.authorName || "");
      setTags(initialValues.tags || "");
      setFeaturedImageUrl(initialValues.featuredImageUrl || "");
      setFeaturedImageAlt(initialValues.featuredImageAlt || "");
      setMetaDescription(initialValues.metaDescription || "");
      setExcerpt(initialValues.excerpt || "");
      setContent(initialValues.content || "");
      setStatus(initialValues.status || "DRAFT");
      // Agar date hai to set karo, nahi to abhi ka time
      setPublishedAt(initialValues.publishedAt || new Date().toISOString());
    }
  }, [initialValues]);

  const urlPreview = useMemo(() => {
    const s = slugify(slug || title);
    return `/blog/${s}`;
  }, [slug, title]);

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/upload", { 
        method: "POST", 
        body: fd 
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setFeaturedImageUrl(data.url); 
    } catch (err) {
      alert("Error uploading image: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  // ✅ Handle Date Change
  const handleDateChange = (e) => {
    const dateValue = new Date(e.target.value).toISOString();
    setPublishedAt(dateValue);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const finalSlug = slugify(slug || title);
    if (!title.trim()) return setError("Title is required.");
    if (!finalSlug) return setError("Slug is required.");

    const payload = {
      title: title.trim(),
      seoTitle: seoTitle.trim() || null,
      slug: finalSlug,
      authorName: authorName.trim() || null,
      tags: tags.trim(), 
      featuredImageUrl: featuredImageUrl.trim() || null,
      featuredImageAlt: featuredImageAlt.trim() || null,
      metaDescription: metaDescription.trim() || null,
      excerpt: excerpt.trim() || null,
      content: content || "",
      status,
      // ✅ Custom Date Payload mein bhejna
      publishedAt: publishedAt,
    };

    await onSubmit(payload).catch((err) => setError(err?.message || "Failed"));
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {mode === "edit" ? "Edit Post" : "Create Post"}
          </h1>
          <p className="text-slate-500 mt-1">
            URL Preview: <span className="font-mono text-slate-700">{urlPreview}</span>
          </p>
        </div>

        <div className="flex gap-2">
           <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`border rounded-xl px-3 py-2 font-bold ${status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-semibold">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Blog Title */}
        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Blog Title</label>
          <input
            className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 font-semibold focus:ring-2 focus:ring-blue-100 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How to Compress PDF Under 1MB"
          />
        </div>

        {/* SEO Title */}
        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">SEO Title</label>
          <input
            className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 font-semibold focus:ring-2 focus:ring-blue-100 outline-none"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="e.g. Compress PDF Online (Free & Secure) | PDF Machine"
          />
          <p className="text-xs text-slate-400 mt-1">Best: 50–60 chars</p>
        </div>

        {/* Slug */}
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Post URL (Slug)</label>
          <input
            className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 font-semibold focus:ring-2 focus:ring-blue-100 outline-none"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. compress-pdf-under-1mb"
          />
        </div>

        {/* Author */}
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Author</label>
          <input
            className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 font-semibold focus:ring-2 focus:ring-blue-100 outline-none"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="e.g. Kamlesh"
          />
        </div>

        {/* ✅ CUSTOM PUBLISH DATE PICKER */}
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Publish Date
          </label>
          <input
            type="datetime-local"
            className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 font-semibold cursor-pointer focus:ring-2 focus:ring-blue-100 outline-none"
            value={formatDateForInput(publishedAt)}
            onChange={handleDateChange}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tags (comma separated)</label>
          <input
            className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 font-semibold focus:ring-2 focus:ring-blue-100 outline-none"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. pdf, compression"
          />
        </div>

        {/* Featured Image */}
        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Featured Image
          </label>
          <div className="mt-2 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                className="w-full border border-slate-200 rounded-xl px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="https://... or auto-filled after upload"
                value={featuredImageUrl || ""}
                onChange={(e) => setFeaturedImageUrl(e.target.value)}
              />
            </div>
            
            <label className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700 transition active:scale-95 shadow-md shadow-blue-500/20">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {uploading ? "Uploading..." : "Upload Image"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {featuredImageUrl && (
            <div className="mt-4 rounded-xl border border-slate-100 overflow-hidden max-w-xs shadow-sm bg-slate-50 p-1">
               <div className="text-[10px] uppercase font-black text-slate-400 px-2 py-1 flex items-center gap-1">
                 <ImageIcon className="w-3 h-3"/> Preview
               </div>
               <img src={featuredImageUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
            </div>
          )}
        </div>

        {/* Alt Text */}
        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Featured Image Alt Text</label>
          <input
            className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 font-semibold focus:ring-2 focus:ring-blue-100 outline-none"
            value={featuredImageAlt}
            onChange={(e) => setFeaturedImageAlt(e.target.value)}
            placeholder="Describe the image for SEO & accessibility"
          />
        </div>

        {/* Meta Description */}
        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Meta Description</label>
          <textarea
            className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 font-semibold min-h-[90px] focus:ring-2 focus:ring-blue-100 outline-none"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="155–160 chars summary for Google"
          />
        </div>

        {/* Excerpt */}
        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Short Excerpt</label>
          <textarea
            className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 font-semibold min-h-[90px] focus:ring-2 focus:ring-blue-100 outline-none"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Small summary shown in blog listing"
          />
        </div>

        {/* Content */}
        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Post Body</label>
          <div className="mt-2">
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="submit"
          disabled={busy || uploading}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-extrabold shadow-sm hover:bg-blue-700 disabled:opacity-70 cursor-pointer transition-all active:scale-95"
        >
          {busy ? "Saving..." : "Save Post"}
        </button>
        <button
          type="button"
          onClick={() => (window.location.href = "/admin/posts")}
          className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-extrabold hover:bg-slate-200 cursor-pointer transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}