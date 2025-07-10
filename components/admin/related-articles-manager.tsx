import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useDisclosure } from "@heroui/use-disclosure";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { motion } from "framer-motion";
import {
  LinkIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  coverImage?: string;
  category: {
    name: string;
    color: string;
  };
  author: {
    name: string;
  };
  publishedAt: string | null;
  relationType: string;
  relationId: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category: {
    name: string;
    color: string;
  };
}

interface RelatedArticlesManagerProps {
  postSlug: string;
  postTitle: string;
}

export default function RelatedArticlesManager({
  postSlug,
  postTitle,
}: RelatedArticlesManagerProps) {
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [availablePosts, setAvailablePosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch related articles
  const fetchRelatedArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/posts/${postSlug}/related`);
      if (response.ok) {
        const data = await response.json();
        setRelatedArticles(data);
      }
    } catch (error) {
      console.error("Error fetching related articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available posts for linking
  const fetchAvailablePosts = async () => {
    try {
      const response = await fetch("/api/blog/posts?limit=100");
      if (response.ok) {
        const data = await response.json();
        // Filter out current post and already related posts
        const currentRelatedIds = relatedArticles.map((article) => article.id);
        const filtered = data.posts.filter(
          (post: BlogPost) =>
            post.slug !== postSlug && !currentRelatedIds.includes(post.id),
        );
        setAvailablePosts(filtered);
      }
    } catch (error) {
      console.error("Error fetching available posts:", error);
    }
  };

  // Add related article
  const addRelatedArticle = async (targetPostId: string) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/blog/posts/${postSlug}/related`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetPostId,
          relationType: "related",
        }),
      });

      if (response.ok) {
        await fetchRelatedArticles();
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add related article");
      }
    } catch (error) {
      console.error("Error adding related article:", error);
      alert("Failed to add related article");
    } finally {
      setSaving(false);
    }
  };

  // Remove related article
  const removeRelatedArticle = async (relationId: string) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/blog/posts/${postSlug}/related`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ relationId }),
      });

      if (response.ok) {
        await fetchRelatedArticles();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to remove related article");
      }
    } catch (error) {
      console.error("Error removing related article:", error);
      alert("Failed to remove related article");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (postSlug) {
      fetchRelatedArticles();
    }
  }, [postSlug]);

  useEffect(() => {
    if (isOpen) {
      fetchAvailablePosts();
    }
  }, [isOpen, relatedArticles]);

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Related Articles
          </h2>
          <Button
            color="primary"
            variant="flat"
            size="sm"
            startContent={<PlusIcon className="w-4 h-4" />}
            onPress={onOpen}
            isDisabled={loading}
          >
            Add Related
          </Button>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : relatedArticles.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No related articles yet.</p>
              <p className="text-sm">
                Add related articles to help readers discover more content.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {relatedArticles.map((article) => (
                <motion.div
                  key={article.relationId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          {article.status === "DRAFT" ? (
                            <Chip
                              size="sm"
                              variant="flat"
                              color="warning"
                              startContent={
                                <EyeSlashIcon className="w-3 h-3" />
                              }
                            >
                              Draft
                            </Chip>
                          ) : (
                            <Chip
                              size="sm"
                              variant="flat"
                              color="success"
                              startContent={<EyeIcon className="w-3 h-3" />}
                            >
                              Published
                            </Chip>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Chip
                          size="sm"
                          variant="flat"
                          style={{
                            backgroundColor: `${article.category.color}20`,
                            color: article.category.color,
                          }}
                        >
                          {article.category.name}
                        </Chip>
                        <span>by {article.author.name}</span>
                        {article.publishedAt && (
                          <span>
                            •{" "}
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => removeRelatedArticle(article.relationId)}
                      isDisabled={saving}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add Related Article Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>Add Related Article</ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-600 mb-4">
              Select articles to link to "{postTitle}". Related articles will be
              displayed to readers to help them discover more content.
            </p>
            {availablePosts.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No articles available for linking.</p>
                <p className="text-sm">
                  All other articles are already related or this is the only
                  article.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {availablePosts.map((post) => (
                  <div
                    key={post.id}
                    className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{post.title}</h4>
                          {post.status === "DRAFT" ? (
                            <Chip
                              size="sm"
                              variant="flat"
                              color="warning"
                              startContent={
                                <EyeSlashIcon className="w-3 h-3" />
                              }
                            >
                              Draft
                            </Chip>
                          ) : (
                            <Chip
                              size="sm"
                              variant="flat"
                              color="success"
                              startContent={<EyeIcon className="w-3 h-3" />}
                            >
                              Published
                            </Chip>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Chip
                            size="sm"
                            variant="flat"
                            style={{
                              backgroundColor: `${post.category.color}20`,
                              color: post.category.color,
                            }}
                          >
                            {post.category.name}
                          </Chip>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={() => addRelatedArticle(post.id)}
                        isDisabled={saving}
                        isLoading={saving}
                      >
                        Link
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
