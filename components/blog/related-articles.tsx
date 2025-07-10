import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { motion } from "framer-motion";
import Link from "next/link";
import { LinkIcon, CalendarIcon } from "@heroicons/react/24/outline";

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: {
    name: string;
    color: string;
  };
  author: {
    name: string;
  };
  publishedAt: string | null;
}

interface RelatedArticlesProps {
  postSlug: string;
  className?: string;
}

export default function RelatedArticles({
  postSlug,
  className = "",
}: RelatedArticlesProps) {
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        const response = await fetch(`/api/blog/posts/${postSlug}/related`);
        if (response.ok) {
          const data = await response.json();
          // Only show published articles to public users
          const publishedArticles = data.filter(
            (article: RelatedArticle) => article.publishedAt,
          );
          setRelatedArticles(publishedArticles);
        }
      } catch (error) {
        console.error("Error fetching related articles:", error);
      } finally {
        setLoading(false);
      }
    };

    if (postSlug) {
      fetchRelatedArticles();
    }
  }, [postSlug]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <Card className="w-full">
        <CardHeader>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-primary" />
            Related Articles
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
            {relatedArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blog/${article.slug}`}>
                  <Card
                    isPressable
                    className="hover:scale-[1.02] transition-transform duration-200"
                  >
                    <CardBody className="p-4">
                      {article.coverImage && (
                        <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
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
                          </div>
                          {article.publishedAt && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <CalendarIcon className="w-3 h-3" />
                              {new Date(
                                article.publishedAt,
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          by {article.author.name}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
