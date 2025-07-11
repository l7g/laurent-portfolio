"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftIcon,
  HeartIcon,
  FlagIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

interface Comment {
  id: string;
  content: string;
  author: string;
  email: string;
  website?: string;
  isApproved: boolean;
  createdAt: string;
  likes: number;
  replies: Comment[];
}

interface CommentsSystemProps {
  postId: string;
  postTitle: string;
  initialComments?: Comment[];
}

export default function CommentsSystem({
  postId,
  postTitle,
  initialComments = [],
}: CommentsSystemProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState({
    content: "",
    author: "",
    email: "",
    website: "",
  });

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newComment.content.trim() ||
      !newComment.author.trim() ||
      !newComment.email.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/blog/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([data, ...comments]);
        setNewComment({
          content: "",
          author: "",
          email: "",
          website: "",
        });
      } else {
        const error = await response.json();
        alert(error.error || "Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/blog/comments/${commentId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, likes: data.likes }
              : comment,
          ),
        );
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleReportComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/blog/comments/${commentId}/report`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Comment reported successfully");
      }
    } catch (error) {
      console.error("Error reporting comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <ChatBubbleLeftIcon className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-xl font-semibold">
                  Comments ({comments.length})
                </h3>
                <p className="text-default-600 text-sm">
                  Join the conversation about "{postTitle}"
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Comment Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <h4 className="text-lg font-semibold">Leave a Comment</h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  placeholder="Your name"
                  value={newComment.author}
                  onChange={(e) =>
                    setNewComment((prev) => ({
                      ...prev,
                      author: e.target.value,
                    }))
                  }
                  startContent={<UserIcon className="w-4 h-4" />}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={newComment.email}
                  onChange={(e) =>
                    setNewComment((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  startContent={<EnvelopeIcon className="w-4 h-4" />}
                  description="Will not be published"
                  required
                />
              </div>
              <Input
                label="Website (optional)"
                placeholder="https://yourwebsite.com"
                value={newComment.website}
                onChange={(e) =>
                  setNewComment((prev) => ({
                    ...prev,
                    website: e.target.value,
                  }))
                }
              />
              <textarea
                placeholder="Share your thoughts..."
                value={newComment.content}
                onChange={(e) =>
                  setNewComment((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                rows={4}
                className="w-full p-3 border border-default-200 rounded-lg resize-none"
                required
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-default-600">
                  Comments are reviewed for quality. Most appear immediately.
                </p>
                <Button
                  type="submit"
                  color="primary"
                  disabled={submitting}
                  startContent={<ChatBubbleLeftIcon className="w-4 h-4" />}
                >
                  {submitting ? "Submitting..." : "Post Comment"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </motion.div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardBody className="p-4">
                  <div className="animate-pulse">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-default-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-default-300 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-default-300 rounded w-1/3"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-default-300 rounded"></div>
                      <div className="h-4 bg-default-300 rounded w-3/4"></div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardBody>
                <div className="text-center py-8">
                  <ChatBubbleLeftIcon className="w-12 h-12 mx-auto mb-4 text-default-400" />
                  <h4 className="text-lg font-semibold mb-2">
                    No comments yet
                  </h4>
                  <p className="text-default-600">
                    Be the first to share your thoughts about this post!
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card>
                <CardBody className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar
                      name={comment.author}
                      size="sm"
                      className="flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold">{comment.author}</h5>
                        {!comment.isApproved && (
                          <Chip size="sm" color="warning" variant="flat">
                            Pending approval
                          </Chip>
                        )}
                        <div className="flex items-center gap-1 text-sm text-default-500">
                          <ClockIcon className="w-3 h-3" />
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                      <p className="text-foreground/90 mb-3 leading-relaxed">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-4">
                        <Button
                          size="sm"
                          variant="light"
                          startContent={<HeartIcon className="w-4 h-4" />}
                          onClick={() => handleLikeComment(comment.id)}
                          className="text-default-600 hover:text-danger"
                        >
                          {comment.likes || 0}
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          startContent={<FlagIcon className="w-4 h-4" />}
                          onClick={() => handleReportComment(comment.id)}
                          className="text-default-600 hover:text-warning"
                        >
                          Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
