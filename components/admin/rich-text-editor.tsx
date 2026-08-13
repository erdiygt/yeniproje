"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  folder?: string;
}

async function uploadImage(file: File, folder?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  if (folder) {
    formData.append("folder", folder);
  }

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as {
    url?: string;
    secure_url?: string;
    error?: string;
  };

  const imageUrl = data.secure_url || data.url;

  if (!response.ok || !imageUrl) {
    throw new Error(data.error || "Görsel yüklenemedi");
  }

  return imageUrl;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md text-[#374151] transition-colors hover:bg-[#FFF1EB] hover:text-[#FE4203] disabled:cursor-not-allowed disabled:opacity-40",
        active && "bg-[#FFF1EB] text-[#FE4203]"
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-[#E5E7EB]" />;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Yazınızı buraya girin...",
  folder,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#FE4203] underline underline-offset-2",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl max-w-full h-auto my-6",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "tiptap-editor min-h-[420px] px-4 py-4 font-text text-[15px] leading-[1.75] text-[#374151] focus:outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChangeRef.current(currentEditor.getHTML());
    },
    onBlur: ({ editor: currentEditor }) => {
      onChangeRef.current(currentEditor.getHTML());
    },
  });

  const insertImage = useCallback(
    async (file: File) => {
      if (!editor) return;

      setIsUploading(true);
      setUploadError(null);

      try {
        const url = await uploadImage(file, folder);
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Görsel yüklenemedi"
        );
      } finally {
        setIsUploading(false);
      }
    },
    [editor, folder]
  );

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const setLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Bağlantı URL'si", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!editor) {
    return (
      <div className="h-[480px] animate-pulse rounded-xl border border-input bg-muted/30" />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-input bg-white">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[#E5E7EB] bg-[#F9FAFB] px-2 py-2">
        <ToolbarButton
          title="Geri al"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Yinele"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Başlık 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Başlık 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Başlık 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Kalın"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="İtalik"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Altı çizili"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Üstü çizili"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Vurgula"
          active={editor.isActive("highlight")}
          onClick={() => editor.chain().focus().toggleHighlight({ color: "#FEF08A" }).run()}
        >
          <Highlighter className="h-4 w-4" />
        </ToolbarButton>

        <label title="Metin rengi" className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-[#FFF1EB]">
          <span className="text-xs font-bold text-[#FE4203]">A</span>
          <input
            type="color"
            className="absolute inset-0 cursor-pointer opacity-0"
            value={(editor.getAttributes("textStyle").color as string) || "#101214"}
            onChange={(event) =>
              editor.chain().focus().setColor(event.target.value).run()
            }
          />
        </label>

        <ToolbarDivider />

        <ToolbarButton
          title="Sola hizala"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Ortala"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Sağa hizala"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Madde işaretli liste"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Numaralı liste"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Alıntı"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Bağlantı ekle"
          active={editor.isActive("link")}
          onClick={setLink}
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Görsel ekle"
          disabled={isUploading}
          onClick={handleImageSelect}
        >
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void insertImage(file);
            event.target.value = "";
          }}
        />
      </div>

      {isUploading && (
        <div className="border-b border-[#E5E7EB] bg-[#FFF1EB] px-4 py-2 font-text text-xs text-[#FE4203]">
          Görsel yükleniyor...
        </div>
      )}

      {uploadError && (
        <div className="border-b border-[#FECACA] bg-[#FEF2F2] px-4 py-2 font-text text-xs text-[#DC2626]">
          {uploadError}
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
