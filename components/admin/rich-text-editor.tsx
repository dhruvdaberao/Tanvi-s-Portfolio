"use client";

import { useEffect, useMemo, useRef, type ChangeEvent } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Link2, ImagePlus, Minus } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onUploadImage: (file: File) => Promise<string>;
}

const baseBtn =
  "inline-flex h-9 items-center gap-1 rounded-md border px-3 text-sm transition-colors hover:bg-muted/80";

export function RichTextEditor({ value, onChange, onUploadImage }: RichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const extensions = useMemo(
    () => [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Placeholder.configure({ placeholder: "Start writing your article..." }),
    ],
    [],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: value,
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] rounded-b-xl border border-t-0 border-border bg-background px-5 py-4 font-sans leading-8 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  const pickLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const next = window.prompt("Enter link URL", prev || "https://");
    if (next === null) return;
    if (!next.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: next.trim() }).run();
  };

  const pickImage = () => imageInputRef.current?.click();

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await onUploadImage(file);
      if (imageUrl) editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();
    } catch {
      alert("Failed to upload image");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-t-xl border border-border bg-card p-3">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${baseBtn} ${editor.isActive("bold") ? "bg-primary text-primary-foreground" : ""}`}>
          <Bold className="h-4 w-4" /> Bold
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${baseBtn} ${editor.isActive("italic") ? "bg-primary text-primary-foreground" : ""}`}>
          <Italic className="h-4 w-4" /> Italic
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${baseBtn} ${editor.isActive("heading", { level: 1 }) ? "bg-primary text-primary-foreground" : ""}`}>
          <Heading1 className="h-4 w-4" /> Heading 1
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${baseBtn} ${editor.isActive("heading", { level: 2 }) ? "bg-primary text-primary-foreground" : ""}`}>
          <Heading2 className="h-4 w-4" /> Heading 2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${baseBtn} ${editor.isActive("heading", { level: 3 }) ? "bg-primary text-primary-foreground" : ""}`}>
          <Heading3 className="h-4 w-4" /> Heading 3
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${baseBtn} ${editor.isActive("bulletList") ? "bg-primary text-primary-foreground" : ""}`}>
          <List className="h-4 w-4" /> Bullet List
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${baseBtn} ${editor.isActive("orderedList") ? "bg-primary text-primary-foreground" : ""}`}>
          <ListOrdered className="h-4 w-4" /> Number List
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${baseBtn} ${editor.isActive("blockquote") ? "bg-primary text-primary-foreground" : ""}`}>
          <Quote className="h-4 w-4" /> Quote
        </button>
        <button type="button" onClick={pickLink} className={`${baseBtn} ${editor.isActive("link") ? "bg-primary text-primary-foreground" : ""}`}>
          <Link2 className="h-4 w-4" /> Insert Link
        </button>
        <button type="button" onClick={pickImage} className={baseBtn}>
          <ImagePlus className="h-4 w-4" /> Insert Image
        </button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={baseBtn}>
          <Minus className="h-4 w-4" /> Rule
        </button>
      </div>
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      <EditorContent editor={editor} />
    </div>
  );
}
