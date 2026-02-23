"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

import {
  Bold, Italic, Underline as UnderIcon,
  List, ListOrdered, Link as LinkIcon,
  AlignLeft, AlignCenter, AlignRight,
  Image as ImageIcon
} from "lucide-react";

export default function RichEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Write your post..." }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || "") !== current) editor.commands.setContent(value || "", false);
  }, [value, editor]);

  if (!editor) return null;

  const Btn = ({ onClick, active, children, title }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-2 rounded-lg border ${
        active ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200"
      } hover:bg-slate-50`}
    >
      {children}
    </button>
  );

  const addLink = () => {
    const prev = editor.getAttributes("link").href || "";
    const url = prompt("Paste link URL", prev);
    if (url === null) return;
    if (!url) return editor.chain().focus().unsetLink().run();
    editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = prompt("Paste image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border-b border-slate-200">
        <Btn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="w-4 h-4" />
        </Btn>
        <Btn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="w-4 h-4" />
        </Btn>
        <Btn title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderIcon className="w-4 h-4" />
        </Btn>

        <Btn title="Bullet List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="w-4 h-4" />
        </Btn>
        <Btn title="Ordered List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="w-4 h-4" />
        </Btn>

        <Btn title="Link" active={editor.isActive("link")} onClick={addLink}>
          <LinkIcon className="w-4 h-4" />
        </Btn>

        <Btn title="Image" onClick={addImage}>
          <ImageIcon className="w-4 h-4" />
        </Btn>

        <div className="w-px bg-slate-200 mx-1" />

        <Btn title="Align Left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft className="w-4 h-4" />
        </Btn>
        <Btn title="Align Center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter className="w-4 h-4" />
        </Btn>
        <Btn title="Align Right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight className="w-4 h-4" />
        </Btn>
      </div>

      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[260px] focus:outline-none"
      />
    </div>
  );
}