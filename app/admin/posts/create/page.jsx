"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ✅ FIXED IMPORT PATH (Direct Address)
// Agar aapne file 'app/admin/components/AdminPostForm.jsx' mein banayi hai to ye chalega:
import AdminPostForm from "@/app/admin/components/AdminPostForm"; 

export default function CreatePostPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleCreate(data) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      // Success
      alert("✅ Post Created Successfully!");
      router.push("/admin/posts");
      router.refresh(); 
      
    } catch (error) {
      console.error("Create Error:", error);
      alert("❌ Error: " + error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-8">Create New Post</h1>
        
        {/* Form Load */}
        <AdminPostForm 
            mode="create" 
            busy={busy} 
            onSubmit={handleCreate} 
        />
        
      </div>
    </div>
  );
}