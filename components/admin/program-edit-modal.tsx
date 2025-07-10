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
import { Textarea } from "@heroui/input";

interface ProgramEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: any;
  onSave: (programId: string, updates: any) => Promise<void>;
}

export default function ProgramEditModal({
  isOpen,
  onClose,
  program,
  onSave,
}: ProgramEditModalProps) {
  const [formData, setFormData] = useState({
    name: program?.name || "",
    degree: program?.degree || "",
    institution: program?.institution || "",
    description: program?.description || "",
    startDate: program?.startDate || "",
    endDate: program?.endDate || "",
    gpa: program?.gpa || "",
    status: program?.status || "ACTIVE",
    location: program?.location || "",
    website: program?.website || "",
    isPublic: program?.isPublic || true,
    featured: program?.featured || false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!program?.id) {
        throw new Error("Program ID is required");
      }
      await onSave(program.id, formData);
      onClose();
    } catch (error) {
      console.error("Error updating program:", error);
    } finally {
      setLoading(false);
    }
  };

  const statuses = ["ACTIVE", "COMPLETED", "TRANSFERRED", "WITHDRAWN"];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <h3 className="text-lg font-semibold">Edit Academic Program</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Program Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Degree"
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                  placeholder="e.g., Bachelor of Science, Master of Arts"
                />
                <Input
                  label="Institution"
                  value={formData.institution}
                  onChange={(e) =>
                    setFormData({ ...formData, institution: e.target.value })
                  }
                  required
                />
              </div>

              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
                <Input
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="GPA"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  value={formData.gpa?.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gpa: parseFloat(e.target.value) || null,
                    })
                  }
                />
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="City, State/Country"
                />
                <Input
                  label="Website"
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </div>

              <div className="space-y-3">
                <Switch
                  isSelected={formData.isPublic}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isPublic: value })
                  }
                >
                  Public (visible on portfolio)
                </Switch>
                <Switch
                  isSelected={formData.featured}
                  onValueChange={(value) =>
                    setFormData({ ...formData, featured: value })
                  }
                >
                  Featured Program
                </Switch>
              </div>
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
