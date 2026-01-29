"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Button } from "./button";
import { Input } from "./input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
}

export default function TiptapEditor({
  value,
  onChange,
  placeholder = "Enter text...",
  className,
  minHeight = "100px",
  maxHeight = "200px",
}: TiptapEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary-600 underline hover:text-primary-700",
        },
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "focus:outline-none px-3 py-2",
          "prose prose-sm max-w-none",
          "[&_p]:mb-2 [&_p:last-child]:mb-0 [&_p]:wrap-break-words",
          "[&_strong]:font-semibold [&_em]:italic",
          "[&_ul]:list-disc [&_ul]:ml-4 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:my-2",
          "[&_li]:mb-1 [&_li]:wrap-break-words",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:mt-2 [&_h1]:wrap-break-words",
          "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-2 [&_h2]:wrap-break-words",
          "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-2 [&_h3]:wrap-break-words",
          "[&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_code]:wrap-break-words",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2 [&_blockquote]:wrap-break-words",
          "[&_a]:text-primary-600 [&_a]:cursor-pointer [&_a]:underline [&_a]:hover:text-primary-700 [&_a]:wrap-break-words",
        ),
      },
    },
  });

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn("border border-black rounded-md relative", className)}
      style={{ minHeight, maxHeight }}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
        {/* Text Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            "h-7 w-7",
            editor.isActive("bold") && "bg-primary-100 text-primary-600",
          )}
          aria-label="Bold"
        >
          <Icon icon="mdi:format-bold" className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            "h-7 w-7",
            editor.isActive("italic") && "bg-primary-100 text-primary-600",
          )}
          aria-label="Italic"
        >
          <Icon icon="mdi:format-italic" className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={cn(
            "h-7 w-7",
            editor.isActive("strike") && "bg-primary-100 text-primary-600",
          )}
          aria-label="Strikethrough"
        >
          <Icon icon="mdi:format-strikethrough" className="w-4 h-4" />
        </Button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={cn(
            "h-7 w-7",
            editor.isActive("heading", { level: 1 }) &&
              "bg-primary-100 text-primary-600",
          )}
          aria-label="Heading 1"
        >
          <Icon icon="mdi:format-header-1" className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            "h-7 w-7",
            editor.isActive("heading", { level: 2 }) &&
              "bg-primary-100 text-primary-600",
          )}
          aria-label="Heading 2"
        >
          <Icon icon="mdi:format-header-2" className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={cn(
            "h-7 w-7",
            editor.isActive("heading", { level: 3 }) &&
              "bg-primary-100 text-primary-600",
          )}
          aria-label="Heading 3"
        >
          <Icon icon="mdi:format-header-3" className="w-4 h-4" />
        </Button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-7 w-7",
            editor.isActive("bulletList") && "bg-primary-100 text-primary-600",
          )}
          aria-label="Bullet List"
        >
          <Icon icon="mdi:format-list-bulleted" className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-7 w-7",
            editor.isActive("orderedList") && "bg-primary-100 text-primary-600",
          )}
          aria-label="Numbered List"
        >
          <Icon icon="mdi:format-list-numbered" className="w-4 h-4" />
        </Button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Code & Blockquote */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={cn(
            "h-7 w-7",
            editor.isActive("code") && "bg-primary-100 text-primary-600",
          )}
          aria-label="Code"
        >
          <Icon icon="mdi:code-tags" className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "h-7 w-7",
            editor.isActive("blockquote") && "bg-primary-100 text-primary-600",
          )}
          aria-label="Blockquote"
        >
          <Icon icon="mdi:format-quote-close" className="w-4 h-4" />
        </Button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Link */}
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                const { from, to } = editor.state.selection;
                const selectedText = editor.state.doc.textBetween(from, to);
                setLinkText(selectedText || "");
                const linkAttributes = editor.getAttributes("link");
                setLinkUrl(linkAttributes.href || "");
              }}
              className={cn(
                "h-7 w-7",
                editor.isActive("link") && "bg-primary-100 text-primary-600",
              )}
              aria-label="Insert Link"
            >
              <Icon icon="mdi:link" className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editor.isActive("link") ? "Edit Link" : "Insert Link"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Link Text</label>
                <Input
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">URL</label>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsLinkDialogOpen(false);
                    setLinkUrl("");
                    setLinkText("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (linkUrl) {
                      if (editor.isActive("link")) {
                        // Update existing link
                        editor
                          .chain()
                          .focus()
                          .extendMarkRange("link")
                          .setLink({ href: linkUrl })
                          .run();
                      } else {
                        // Insert new link
                        if (linkText) {
                          editor
                            .chain()
                            .focus()
                            .insertContent(
                              `<a href="${linkUrl}">${linkText}</a>`,
                            )
                            .run();
                        } else {
                          editor
                            .chain()
                            .focus()
                            .setLink({ href: linkUrl })
                            .run();
                        }
                      }
                    }
                    setIsLinkDialogOpen(false);
                    setLinkUrl("");
                    setLinkText("");
                  }}
                  disabled={!linkUrl}
                >
                  {editor.isActive("link") ? "Update" : "Insert"}
                </Button>
                {editor.isActive("link") && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      editor.chain().focus().unsetLink().run();
                      setIsLinkDialogOpen(false);
                      setLinkUrl("");
                      setLinkText("");
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Editor Content */}
      <div
        className="relative overflow-y-auto"
        style={{ maxHeight: `calc(${maxHeight} - 45px)`, minHeight: "55px" }}
      >
        <div className={cn("px-3 py-2 wrap-break-words")}>
          <EditorContent editor={editor} />
        </div>
        {!editor.getText() && (
          <div className="absolute top-5 left-6 pointer-events-none text-gray-400 text-sm">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
