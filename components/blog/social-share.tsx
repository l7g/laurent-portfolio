"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { motion } from "framer-motion";
import {
  ShareIcon,
  DocumentDuplicateIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface SocialShareProps {
  title: string;
  excerpt: string;
  url: string;
  tags?: string[];
}

export default function SocialShare({
  title,
  excerpt,
  url,
  tags = [],
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : url;
  const encodedTitle = encodeURIComponent(title);
  const encodedExcerpt = encodeURIComponent(excerpt);
  const encodedUrl = encodeURIComponent(shareUrl);
  const hashtags = tags.length > 0 ? encodeURIComponent(tags.join(",")) : "";

  const shareLinks = [
    {
      name: "Twitter",
      icon: "𝕏",
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}${hashtags ? `&hashtags=${hashtags}` : ""}`,
      color: "#1DA1F2",
    },
    {
      name: "Facebook",
      icon: "f",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "#1877F2",
    },
    {
      name: "LinkedIn",
      icon: "in",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "#0A66C2",
    },
    {
      name: "Reddit",
      icon: "r",
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: "#FF4500",
    },
    {
      name: "WhatsApp",
      icon: "📱",
      url: `https://wa.me/?text=${encodedTitle} ${encodedUrl}`,
      color: "#25D366",
    },
    {
      name: "Telegram",
      icon: "✈️",
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: "#0088CC",
    },
    {
      name: "Email",
      icon: "📧",
      url: `mailto:?subject=${encodedTitle}&body=${encodedExcerpt}%0A%0A${encodedUrl}`,
      color: "#EA4335",
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative">
      <Button
        className="gap-2"
        startContent={<ShareIcon className="w-4 h-4" />}
        variant="bordered"
        onClick={handleNativeShare}
      >
        Share
      </Button>

      {/* Share Options */}
      {isOpen && (
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute top-full left-0 mt-2 z-50"
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="min-w-80">
            <CardBody className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Share this post</h4>
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => setIsOpen(false)}
                  >
                    ✕
                  </Button>
                </div>

                {/* Social Media Links */}
                <div className="grid grid-cols-2 gap-2">
                  {shareLinks.map((link) => (
                    <Button
                      key={link.name}
                      className="justify-start gap-2"
                      size="sm"
                      variant="flat"
                      onClick={() => {
                        window.open(link.url, "_blank", "noopener,noreferrer");
                        setIsOpen(false);
                      }}
                    >
                      <span className="text-base">{link.icon}</span>
                      {link.name}
                    </Button>
                  ))}
                </div>

                {/* Copy Link */}
                <div className="border-t pt-3">
                  <Button
                    className="w-full justify-start gap-2"
                    size="sm"
                    startContent={
                      copied ? (
                        <CheckIcon className="w-4 h-4 text-success" />
                      ) : (
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      )
                    }
                    variant="flat"
                    onClick={handleCopyLink}
                  >
                    {copied ? "Copied!" : "Copy link"}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
