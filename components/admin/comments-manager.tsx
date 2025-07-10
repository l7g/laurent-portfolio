"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { CheckIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Comment {
  id: string;
  content: string;
  author: string;
  email: string;
  website?: string;
  isApproved: boolean;
  createdAt: string;
  blog_posts: {
    id: string;
    title: string;
    slug: string;
  };
}

interface CommentSummary {
  total: number;
  approved: number;
  pending: number;
}

export default function AdminCommentsManager() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [summary, setSummary] = useState<CommentSummary>({
    total: 0,
    approved: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") {
        params.append("status", filter);
      }

      const response = await fetch(`/api/admin/comments?${params}`);
      const data = await response.json();

      if (response.ok) {
        setComments(data.comments);
        setSummary(data.summary);
      } else {
        console.error("Failed to fetch comments:", data.error);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAction = async (
    commentId: string,
    action: "approve" | "reject" | "delete",
  ) => {
    try {
      setActionLoading(commentId);

      const response = await fetch("/api/admin/comments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
          action,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh comments list
        await fetchComments();
      } else {
        console.error("Failed to update comment:", data.error);
        alert(`Failed to ${action} comment: ${data.error}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing comment:`, error);
      alert(`Error ${action}ing comment. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [filter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (isApproved: boolean) => {
    return isApproved ? "success" : "warning";
  };

  const getStatusText = (isApproved: boolean) => {
    return isApproved ? "Approved" : "Pending";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {summary.total}
            </div>
            <div className="text-sm text-default-500">Total Comments</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {summary.approved}
            </div>
            <div className="text-sm text-default-500">Approved</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {summary.pending}
            </div>
            <div className="text-sm text-default-500">Pending Review</div>
          </CardBody>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <label htmlFor="filter" className="text-sm font-medium">
            Filter:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Comments</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        <Button
          color="primary"
          variant="ghost"
          onClick={fetchComments}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card>
            <CardBody className="text-center py-8">
              <p className="text-default-500">
                {filter === "all"
                  ? "No comments found."
                  : `No ${filter} comments found.`}
              </p>
            </CardBody>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="w-full">
              <CardHeader className="flex justify-between items-start">
                <div className="flex flex-col space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{comment.author}</span>
                    <span className="text-sm text-default-500">
                      ({comment.email})
                    </span>
                    {comment.website && (
                      <a
                        href={comment.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        🌐
                      </a>
                    )}
                  </div>
                  <div className="text-sm text-default-500">
                    On: <strong>{comment.blog_posts.title}</strong>
                  </div>
                  <div className="text-xs text-default-400">
                    {formatDate(comment.createdAt)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Chip
                    color={getStatusColor(comment.isApproved)}
                    variant="flat"
                    size="sm"
                  >
                    {getStatusText(comment.isApproved)}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody>
                <div className="mb-4">
                  <p className="text-default-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <a
                    href={`/blog/${comment.blog_posts.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    View Post →
                  </a>

                  <div className="flex space-x-2">
                    {!comment.isApproved && (
                      <Button
                        color="success"
                        variant="flat"
                        size="sm"
                        startContent={<CheckIcon className="w-4 h-4" />}
                        onClick={() =>
                          handleCommentAction(comment.id, "approve")
                        }
                        disabled={actionLoading === comment.id}
                      >
                        {actionLoading === comment.id ? "..." : "Approve"}
                      </Button>
                    )}

                    {comment.isApproved && (
                      <Button
                        color="warning"
                        variant="flat"
                        size="sm"
                        startContent={<XMarkIcon className="w-4 h-4" />}
                        onClick={() =>
                          handleCommentAction(comment.id, "reject")
                        }
                        disabled={actionLoading === comment.id}
                      >
                        {actionLoading === comment.id ? "..." : "Reject"}
                      </Button>
                    )}

                    <Button
                      color="danger"
                      variant="flat"
                      size="sm"
                      startContent={<TrashIcon className="w-4 h-4" />}
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this comment? This action cannot be undone.",
                          )
                        ) {
                          handleCommentAction(comment.id, "delete");
                        }
                      }}
                      disabled={actionLoading === comment.id}
                    >
                      {actionLoading === comment.id ? "..." : "Delete"}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
