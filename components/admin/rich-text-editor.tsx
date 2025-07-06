"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { motion } from "framer-motion";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  LinkIcon,
  PhotoIcon,
  CodeBracketIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  ChatBubbleLeftIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { title } from "@/components/primitives";
import ReactMarkdown from "react-markdown";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing your post...",
  minHeight = "400px",
}: RichTextEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertText = (
    before: string,
    after: string = "",
    placeholder: string = "",
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = before + (selectedText || placeholder) + after;

    const newValue =
      value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos =
        start + before.length + (selectedText || placeholder).length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    onChange(newValue);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + text.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleImageUpload = async (file: File) => {
    setImageUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const imageMarkdown = `![${file.name}](${data.url})`;
        insertAtCursor(imageMarkdown);
      } else {
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toolbarButtons = [
    {
      icon: BoldIcon,
      title: "Bold",
      action: () => insertText("**", "**", "bold text"),
    },
    {
      icon: ItalicIcon,
      title: "Italic",
      action: () => insertText("*", "*", "italic text"),
    },
    {
      icon: UnderlineIcon,
      title: "Underline",
      action: () => insertText("<u>", "</u>", "underlined text"),
    },
    { divider: true },
    {
      icon: H1Icon,
      title: "Heading 1",
      action: () => insertText("# ", "", "Heading 1"),
    },
    {
      icon: H2Icon,
      title: "Heading 2",
      action: () => insertText("## ", "", "Heading 2"),
    },
    {
      icon: H3Icon,
      title: "Heading 3",
      action: () => insertText("### ", "", "Heading 3"),
    },
    { divider: true },
    {
      icon: ListBulletIcon,
      title: "Bullet List",
      action: () => insertText("- ", "", "List item"),
    },
    {
      icon: ChatBubbleLeftIcon,
      title: "Quote",
      action: () => insertText("> ", "", "Quote"),
    },
    {
      icon: CodeBracketIcon,
      title: "Code Block",
      action: () => insertText("```\n", "\n```", "code here"),
    },
    { divider: true },
    {
      icon: LinkIcon,
      title: "Link",
      action: () => insertText("[", "](url)", "link text"),
    },
    {
      icon: PhotoIcon,
      title: "Image",
      action: () => fileInputRef.current?.click(),
      loading: imageUploadLoading,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Content Editor</h3>
            {imageUploadLoading && (
              <Chip size="sm" color="primary" variant="flat">
                Uploading...
              </Chip>
            )}
          </div>
          <Button
            variant="bordered"
            size="sm"
            startContent={
              isPreviewMode ? (
                <EyeSlashIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )
            }
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? "Edit" : "Preview"}
          </Button>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        {/* Toolbar */}
        <div className="border-b border-default-200 p-3">
          <div className="flex flex-wrap items-center gap-1">
            {toolbarButtons.map((button, index) => {
              if (button.divider) {
                return (
                  <div key={index} className="w-px h-6 bg-default-300 mx-1" />
                );
              }
              return (
                <Button
                  key={index}
                  size="sm"
                  variant="light"
                  isIconOnly
                  onClick={button.action}
                  title={button.title}
                  disabled={button.loading}
                  className="min-w-8 h-8"
                >
                  {button.icon && <button.icon className="w-4 h-4" />}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Editor/Preview Area */}
        <div className="relative">
          {isPreviewMode ? (
            <div className="p-6" style={{ minHeight }}>
              {value.trim() ? (
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }: any) => (
                        <h1 className="text-3xl font-bold mb-4 text-foreground">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }: any) => (
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }: any) => (
                        <h3 className="text-xl font-semibold mb-3 text-foreground">
                          {children}
                        </h3>
                      ),
                      p: ({ children }: any) => (
                        <p className="mb-4 text-foreground/90 leading-relaxed">
                          {children}
                        </p>
                      ),
                      ul: ({ children }: any) => (
                        <ul className="list-disc list-inside mb-4 text-foreground/90">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }: any) => (
                        <ol className="list-decimal list-inside mb-4 text-foreground/90">
                          {children}
                        </ol>
                      ),
                      code: ({ children }: any) => (
                        <code className="bg-default-100 px-2 py-1 rounded text-sm font-mono">
                          {children}
                        </code>
                      ),
                      pre: ({ children }: any) => (
                        <pre className="bg-default-100 p-4 rounded-lg overflow-x-auto mb-4">
                          {children}
                        </pre>
                      ),
                      blockquote: ({ children }: any) => (
                        <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/80 mb-4">
                          {children}
                        </blockquote>
                      ),
                      img: ({ src, alt }: any) => (
                        <img
                          src={src}
                          alt={alt}
                          className="max-w-full h-auto rounded-lg shadow-md mb-4"
                        />
                      ),
                      a: ({ href, children }: any) => (
                        <a
                          href={href}
                          className="text-primary hover:text-primary/80 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {value}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center text-default-500 py-20">
                  <p>
                    Nothing to preview yet. Start writing to see the preview.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-6 border-none outline-none resize-none bg-transparent text-foreground font-mono text-sm leading-relaxed"
              style={{ minHeight }}
            />
          )}
        </div>

        {/* Status Bar */}
        <div className="border-t border-default-200 p-3 bg-default-50">
          <div className="flex items-center justify-between text-sm text-default-600">
            <div className="flex items-center gap-4">
              <span>{value.length} characters</span>
              <span>{value.split(/\s+/).filter(Boolean).length} words</span>
              <span>
                {Math.ceil(value.split(/\s+/).filter(Boolean).length / 200)} min
                read
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs">Markdown supported</span>
              <Chip size="sm" variant="flat" color="success">
                Auto-save
              </Chip>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
