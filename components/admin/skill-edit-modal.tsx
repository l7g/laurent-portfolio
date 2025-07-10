"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";

interface SkillEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: any;
  onSave: (skillId: string, updates: any) => Promise<void>;
}

export default function SkillEditModal({
  isOpen,
  onClose,
  skill,
  onSave,
}: SkillEditModalProps) {
  const [formData, setFormData] = useState({
    name: skill?.name || "",
    category: skill?.category || "",
    level: skill?.level || 50,
    isActive: skill?.isActive || true,
    description: skill?.description || "",
    yearsOfExperience: skill?.yearsOfExperience || 0,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(skill.id, formData);
      onClose();
    } catch (error) {
      console.error("Error updating skill:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Frontend Development",
    "Backend Development",
    "Database",
    "DevOps",
    "Mobile Development",
    "Cloud Services",
    "Programming Languages",
    "Frameworks",
    "Tools & Technologies",
    "Other",
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <h3 className="text-lg font-semibold">Edit Skill</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Skill Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Proficiency Level: {formData.level}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      level: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              <Input
                label="Years of Experience"
                type="number"
                value={formData.yearsOfExperience?.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    yearsOfExperience: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                max="50"
              />

              <Input
                label="Description (optional)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <Switch
                isSelected={formData.isActive}
                onValueChange={(value) =>
                  setFormData({ ...formData, isActive: value })
                }
              >
                Active (visible on portfolio)
              </Switch>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="primary" isLoading={loading}>
              Save Changes
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
