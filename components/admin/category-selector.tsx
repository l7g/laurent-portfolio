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
import { CheckIcon, PlusIcon, TagIcon } from "@heroicons/react/24/outline";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description?: string;
}

interface CategorySelectorProps {
  value: string;
  onChange: (categoryId: string) => void;
  categories: Category[];
  onCreateCategory: (category: Omit<Category, "id">) => Promise<Category>;
}

export default function CategorySelector({
  value,
  onChange,
  categories,
  onCreateCategory,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "📁",
    color: "#3B82F6",
    description: "",
  });

  const selectedCategory = categories.find((cat) => cat.id === value);

  const handleSelect = (categoryId: string) => {
    onChange(categoryId);
    setIsOpen(false);
  };

  const handleCreate = async () => {
    if (!newCategory.name.trim()) return;

    setIsCreating(true);
    try {
      const slug = newCategory.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const category = await onCreateCategory({
        ...newCategory,
        slug,
        description: newCategory.description || `${newCategory.name} category`,
      });

      onChange(category.id);
      setIsOpen(false);
      setNewCategory({
        name: "",
        icon: "📁",
        color: "#3B82F6",
        description: "",
      });
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const iconOptions = [
    "📁",
    "💼",
    "🚀",
    "⚡",
    "🎯",
    "🔧",
    "📚",
    "🌟",
    "🎨",
    "💡",
  ];
  const colorOptions = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ];

  return (
    <>
      <Card
        className="cursor-pointer hover:bg-default-50 transition-all duration-200 border-2 border-default-200 hover:border-default-300 shadow-sm hover:shadow-md"
        isPressable
        onPress={() => setIsOpen(true)}
      >
        <CardBody className="p-4">
          {selectedCategory ? (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border"
                style={{
                  backgroundColor: selectedCategory.color + "20",
                  borderColor: selectedCategory.color + "40",
                }}
              >
                <span className="text-lg">{selectedCategory.icon}</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-default-800">
                  {selectedCategory.name}
                </div>
                <div className="text-sm text-default-600">
                  {selectedCategory.description}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-default-600">
              <div className="w-10 h-10 rounded-full bg-default-100 flex items-center justify-center border border-default-200">
                <TagIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-default-700">
                  Select Category
                </div>
                <div className="text-sm text-default-500">
                  Choose from existing or create new
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="lg"
        backdrop="blur"
      >
        <ModalContent className="mx-4">
          <ModalHeader className="flex flex-col gap-1 pb-4 border-b border-default-200">
            <h2 className="text-xl font-semibold">Select Category</h2>
            <p className="text-sm text-default-500 font-normal">
              Choose an existing category or create a new one
            </p>
          </ModalHeader>
          <ModalBody className="px-6 py-6">
            {/* Existing Categories */}
            <div className="space-y-4">
              <h4 className="font-semibold text-base text-default-800">
                Existing Categories
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className={`cursor-pointer transition-all duration-200 border-2 ${
                      value === category.id
                        ? "border-primary bg-primary-50 shadow-md"
                        : "border-default-200 hover:border-default-300 hover:bg-default-50 hover:shadow-sm"
                    }`}
                    isPressable
                    onPress={() => handleSelect(category.id)}
                  >
                    <CardBody className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg border"
                          style={{
                            backgroundColor: category.color + "20",
                            borderColor: category.color + "40",
                          }}
                        >
                          <span>{category.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-default-800 truncate">
                            {category.name}
                          </div>
                          {category.description && (
                            <div className="text-sm text-default-600 line-clamp-2">
                              {category.description}
                            </div>
                          )}
                        </div>
                        {value === category.id && (
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

            {/* Create New Category */}
            <div className="border-t border-default-200 pt-6 space-y-4">
              <h4 className="font-semibold text-base flex items-center gap-2 text-default-800">
                <PlusIcon className="w-5 h-5 text-primary" />
                Create New Category
              </h4>

              <div className="bg-default-50 p-5 rounded-lg border border-default-200 space-y-4">
                <Input
                  label="Category Name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g., Web Development"
                  variant="bordered"
                  classNames={{
                    input: "bg-white",
                    inputWrapper:
                      "border-2 border-default-200 hover:border-default-300 focus-within:border-primary",
                  }}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-default-700">
                      Icon
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {iconOptions.map((icon) => (
                        <Button
                          key={icon}
                          variant={
                            newCategory.icon === icon ? "solid" : "bordered"
                          }
                          color={
                            newCategory.icon === icon ? "primary" : "default"
                          }
                          size="sm"
                          isIconOnly
                          className="min-w-10 h-10"
                          onPress={() =>
                            setNewCategory((prev) => ({ ...prev, icon }))
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
                          variant="bordered"
                          size="sm"
                          isIconOnly
                          className={`border-2 min-w-10 h-10 ${
                            newCategory.color === color
                              ? "border-black shadow-md"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          style={{ backgroundColor: color }}
                          onPress={() =>
                            setNewCategory((prev) => ({ ...prev, color }))
                          }
                        >
                          {newCategory.color === color && (
                            <CheckIcon className="w-4 h-4 text-white drop-shadow-sm" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <Input
                  label="Description (Optional)"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of this category"
                  variant="bordered"
                  classNames={{
                    input: "bg-white",
                    inputWrapper:
                      "border-2 border-default-200 hover:border-default-300 focus-within:border-primary",
                  }}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="px-6 py-4 bg-default-50 border-t border-default-200">
            <Button
              variant="light"
              onPress={() => setIsOpen(false)}
              className="font-medium"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleCreate}
              isLoading={isCreating}
              isDisabled={!newCategory.name.trim()}
              className="font-semibold"
            >
              Create Category
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
