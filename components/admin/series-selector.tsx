"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Card, CardBody } from "@heroui/card";
import {
  CheckIcon,
  PlusIcon,
  BookOpenIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface Series {
  id: string;
  title: string;
  slug: string;
  description?: string;
  icon: string;
  color: string;
  difficulty?: string;
  _count: { blog_posts: number };
}

interface SeriesSelectorProps {
  value: string;
  onChange: (seriesId: string) => void;
  series: Series[];
  onCreateSeries: (series: Omit<Series, "id" | "_count">) => Promise<Series>;
}

export default function SeriesSelector({
  value,
  onChange,
  series,
  onCreateSeries,
}: SeriesSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newSeries, setNewSeries] = useState({
    title: "",
    description: "",
    icon: "📚",
    color: "#8B5CF6",
    difficulty: "Beginner",
  });

  const selectedSeries = series.find((s) => s.id === value);

  const handleSelect = (seriesId: string) => {
    onChange(seriesId);
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onChange("");
    setIsOpen(false);
  };

  const handleCreate = async () => {
    if (!newSeries.title.trim()) return;

    setIsCreating(true);
    try {
      const slug = newSeries.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const seriesData = await onCreateSeries({
        ...newSeries,
        slug,
        description: newSeries.description || `${newSeries.title} series`,
      });

      onChange(seriesData.id);
      setIsOpen(false);
      setNewSeries({
        title: "",
        description: "",
        icon: "📚",
        color: "#8B5CF6",
        difficulty: "Beginner",
      });
    } catch (error) {
      console.error("Failed to create series:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const iconOptions = [
    "📚",
    "🎓",
    "🚀",
    "⚡",
    "🎯",
    "🔧",
    "💡",
    "🌟",
    "🎨",
    "📖",
  ];
  const colorOptions = [
    "#8B5CF6",
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ];
  const difficultyOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];

  return (
    <>
      <Card
        isPressable
        className="cursor-pointer hover:bg-default-50 transition-all duration-200 border-2 border-default-200 hover:border-default-300 shadow-sm hover:shadow-md"
        onPress={() => setIsOpen(true)}
      >
        <CardBody className="p-4">
          {selectedSeries ? (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border"
                style={{
                  backgroundColor: selectedSeries.color + "20",
                  borderColor: selectedSeries.color + "40",
                }}
              >
                <span className="text-lg">{selectedSeries.icon}</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-default-800">
                  {selectedSeries.title}
                </div>
                <div className="text-sm text-default-600">
                  {selectedSeries._count.blog_posts} posts
                  {selectedSeries.difficulty &&
                    ` • ${selectedSeries.difficulty}`}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-default-600">
              <div className="w-10 h-10 rounded-full bg-default-100 flex items-center justify-center border border-default-200">
                <BookOpenIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-default-700">
                  Add to Series (Optional)
                </div>
                <div className="text-sm text-default-500">
                  Organize related content together
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        size="4xl"
        onClose={() => setIsOpen(false)}
      >
        <ModalContent className="max-h-[90vh] mx-4">
          <ModalHeader className="flex flex-col gap-1 pb-4 border-b border-default-200">
            <h2 className="text-xl font-semibold">Select Series</h2>
            <p className="text-sm text-default-500 font-normal">
              Add this post to an existing series or create a new one
            </p>
          </ModalHeader>
          <ModalBody className="px-6 pb-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Existing Series */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b border-default-200 pb-2">
                  Existing Series
                </h4>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {/* Clear Selection Option */}
                  <Card
                    isPressable
                    className={`cursor-pointer transition-all duration-200 border-2 ${
                      !value
                        ? "border-primary bg-primary-50 shadow-md"
                        : "border-default-200 hover:border-default-300 hover:shadow-sm hover:bg-default-50"
                    }`}
                    onPress={handleClearSelection}
                  >
                    <CardBody className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-default-100 flex items-center justify-center border border-default-200">
                          <span className="text-lg text-default-600">—</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-default-800">
                            No Series
                          </div>
                          <div className="text-sm text-default-500">
                            Don't add to any series
                          </div>
                        </div>
                        {!value && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <CheckIcon className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>

                  {series.map((seriesItem) => (
                    <Card
                      key={seriesItem.id}
                      isPressable
                      className={`cursor-pointer transition-all duration-200 border-2 ${
                        value === seriesItem.id
                          ? "border-primary bg-primary-50 shadow-md"
                          : "border-default-200 hover:border-default-300 hover:shadow-sm hover:bg-default-50"
                      }`}
                      onPress={() => handleSelect(seriesItem.id)}
                    >
                      <CardBody className="p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-lg border"
                            style={{
                              backgroundColor: seriesItem.color + "20",
                              borderColor: seriesItem.color + "40",
                            }}
                          >
                            <span>{seriesItem.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-default-800 truncate">
                              {seriesItem.title}
                            </div>
                            <div className="text-sm text-default-600 flex items-center gap-2">
                              <span>{seriesItem._count.blog_posts} posts</span>
                              {seriesItem.difficulty && (
                                <>
                                  <span>•</span>
                                  <span className="font-medium">
                                    {seriesItem.difficulty}
                                  </span>
                                </>
                              )}
                            </div>
                            {seriesItem.description && (
                              <div className="text-xs text-default-500 mt-1 line-clamp-2">
                                {seriesItem.description}
                              </div>
                            )}
                          </div>
                          {value === seriesItem.id && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <CheckIcon className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Create New Series */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b border-default-200 pb-2 flex items-center gap-2">
                  <PlusIcon className="w-5 h-5 text-primary" />
                  Create New Series
                </h4>

                <div className="space-y-5 bg-default-50 p-5 rounded-lg border border-default-200">
                  <Input
                    classNames={{
                      input: "bg-white",
                      inputWrapper:
                        "border-2 border-default-200 hover:border-default-300 focus-within:border-primary",
                    }}
                    label="Series Title"
                    placeholder="e.g., React Fundamentals"
                    value={newSeries.title}
                    variant="bordered"
                    onChange={(e) =>
                      setNewSeries((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-default-700">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-default-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none bg-white hover:border-default-300 transition-colors"
                      placeholder="Brief description of this series..."
                      rows={3}
                      value={newSeries.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setNewSeries((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-default-700">
                        Icon
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {iconOptions.map((icon) => (
                          <Button
                            key={icon}
                            isIconOnly
                            className="min-w-10 h-10"
                            color={
                              newSeries.icon === icon ? "primary" : "default"
                            }
                            size="sm"
                            variant={
                              newSeries.icon === icon ? "solid" : "bordered"
                            }
                            onPress={() =>
                              setNewSeries((prev) => ({ ...prev, icon }))
                            }
                          >
                            {icon}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-default-700">
                        Color
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <Button
                            key={color}
                            isIconOnly
                            className={`border-2 min-w-10 h-10 ${
                              newSeries.color === color
                                ? "border-black shadow-md"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            size="sm"
                            style={{ backgroundColor: color }}
                            variant="bordered"
                            onPress={() =>
                              setNewSeries((prev) => ({ ...prev, color }))
                            }
                          >
                            {newSeries.color === color && (
                              <CheckIcon className="w-4 h-4 text-white drop-shadow-sm" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-default-700">
                      Difficulty Level
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-3 py-2 border-2 border-default-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-white hover:border-default-300 transition-colors"
                        value={newSeries.difficulty}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setNewSeries((prev) => ({
                            ...prev,
                            difficulty: e.target.value,
                          }))
                        }
                      >
                        {difficultyOptions.map((difficulty) => (
                          <option key={difficulty} value={difficulty}>
                            {difficulty}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-default-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="px-6 py-4 bg-default-50 border-t border-default-200">
            <Button
              className="font-medium"
              variant="light"
              onPress={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="font-semibold"
              color="primary"
              isDisabled={!newSeries.title.trim()}
              isLoading={isCreating}
              onPress={handleCreate}
            >
              Create Series
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
