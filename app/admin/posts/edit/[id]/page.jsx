"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminPostForm from "../../../components/AdminPostForm"; // Path check kar lena

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await fetch(`/api/admin/posts/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Post not found");
        
        const data = await res.json();
        
        // ✅ CRITICAL FIX: Data unwrap karna (data.post)
        // Agar API { post: {...} } bhej rahi hai, toh humein data.post set karna hai
        setInitialValues(data.post || data); 
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Error loading post");
        router.push("/admin/posts");
      }
    }

    load();
  }, [id, router]);

  async function onSubmit(payload) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      // Success
      window.location.href = "/admin/posts";
    } catch (err) {
      alert("Update failed: " + err.message);
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 font-bold animate-pulse">Loading Post Data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <AdminPostForm
          mode="edit"
          busy={busy}
          initialValues={initialValues} // ✅ Ab isme sahi data jayega
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}