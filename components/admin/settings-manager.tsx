"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Switch } from "@heroui/switch";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {
  PlusIcon,
  TrashIcon,
  DocumentIcon,
  LinkIcon,
  PhotoIcon,
  InformationCircleIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useApi } from "@/lib/use-api";

interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

const PREDEFINED_SETTINGS = [
  {
    key: "cv_url",
    label: "CV/Resume URL",
    description: "Link to your CV/Resume file",
    type: "text",
    isPublic: true,
    category: "Personal",
    icon: DocumentIcon,
  },
  {
    key: "linkedin_url",
    label: "LinkedIn Profile",
    description: "Your LinkedIn profile URL",
    type: "text",
    isPublic: true,
    category: "Social",
    icon: LinkIcon,
  },
  {
    key: "github_url",
    label: "GitHub Profile",
    description: "Your GitHub profile URL",
    type: "text",
    isPublic: true,
    category: "Social",
    icon: LinkIcon,
  },
  {
    key: "profile_image_url",
    label: "Profile Image",
    description: "URL to your profile image",
    type: "text",
    isPublic: true,
    category: "Personal",
    icon: PhotoIcon,
  },
  {
    key: "site_title",
    label: "Site Title",
    description: "Main title of your portfolio",
    type: "text",
    isPublic: true,
    category: "Site",
    icon: InformationCircleIcon,
  },
  {
    key: "site_description",
    label: "Site Description",
    description: "Brief description of your portfolio/services",
    type: "text",
    isPublic: true,
    category: "Site",
    icon: InformationCircleIcon,
  },
  {
    key: "hero_subtitle",
    label: "Hero Subtitle",
    description: "Subtitle text in the hero section",
    type: "text",
    isPublic: true,
    category: "Content",
    icon: InformationCircleIcon,
  },
  {
    key: "contact_phone",
    label: "Contact Phone",
    description: "Your contact phone number",
    type: "text",
    isPublic: true,
    category: "Contact",
    icon: InformationCircleIcon,
  },
  {
    key: "location",
    label: "Location",
    description: "Your current location/city",
    type: "text",
    isPublic: true,
    category: "Personal",
    icon: InformationCircleIcon,
  },
  {
    key: "years_experience",
    label: "Years of Experience",
    description: "Your years of professional experience",
    type: "number",
    isPublic: true,
    category: "Personal",
    icon: InformationCircleIcon,
  },
];

export default function SettingsManager() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    type: "text",
    description: "",
    isPublic: false,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [editFormData, setEditFormData] = useState({
    value: "",
    description: "",
    isPublic: false,
  });

  const api = useApi();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const response = await api.settings.getAll();
    if (response.data) {
      // Ensure we have an array
      const settingsArray = Array.isArray(response.data) ? response.data : [];
      setSettings(settingsArray);
    }
  };

  const handleQuickSetup = async (
    predefinedSetting: (typeof PREDEFINED_SETTINGS)[0],
  ) => {
    const existingSetting = settings.find(
      (s) => s.key === predefinedSetting.key,
    );

    if (existingSetting) {
      // Open edit modal for existing setting
      openEditModal(existingSetting);
      return;
    }

    // Create new setting and open edit modal
    const response = await api.settings.upsert({
      key: predefinedSetting.key,
      value: "",
      type: predefinedSetting.type,
      description: predefinedSetting.description,
      isPublic: predefinedSetting.isPublic,
    });

    if (response.data) {
      await loadSettings();
      // Use the response data directly since it contains the newly created setting
      openEditModal(response.data);
    }
  };

  const openEditModal = (setting: Setting) => {
    setEditingSetting(setting);
    setEditFormData({
      value: setting.value,
      description: setting.description || "",
      isPublic: setting.isPublic,
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingSetting(null);
    setEditFormData({
      value: "",
      description: "",
      isPublic: false,
    });
  };

  const handleSaveSetting = async () => {
    if (!editingSetting) return;

    const response = await api.settings.update(editingSetting.key, {
      value: editFormData.value,
      type: editingSetting.type,
      description: editFormData.description,
      isPublic: editFormData.isPublic,
    });

    if (response.data) {
      await loadSettings();
      closeEditModal();
    }
  };

  const handleDeleteSetting = async (key: string) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;

    const response = await api.settings.delete(key);
    if (response.data || !response.error) {
      await loadSettings();
    }
  };

  const handleAddCustomSetting = async () => {
    if (!newSetting.key || !newSetting.value) return;

    const response = await api.settings.upsert(newSetting);
    if (response.data) {
      await loadSettings();
      setNewSetting({
        key: "",
        value: "",
        type: "text",
        description: "",
        isPublic: false,
      });
      setShowAddForm(false);
    }
  };

  const categories = [
    "All",
    ...Array.from(new Set(PREDEFINED_SETTINGS.map((s) => s.category))),
  ];
  const filteredPredefined =
    selectedCategory === "All"
      ? PREDEFINED_SETTINGS
      : PREDEFINED_SETTINGS.filter((s) => s.category === selectedCategory);

  const existingKeys = Array.isArray(settings)
    ? settings.map((s) => s.key)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Site Settings</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage your portfolio content and configuration
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            color="primary"
            variant="light"
            onPress={() => setShowAddForm(!showAddForm)}
            startContent={<PlusIcon className="w-4 h-4" />}
          >
            Add Custom Setting
          </Button>
          <Button color="primary" onPress={loadSettings}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Chip
            key={category}
            variant={selectedCategory === category ? "solid" : "bordered"}
            color={selectedCategory === category ? "primary" : "default"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Chip>
        ))}
      </div>

      {/* Add Custom Setting Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Add Custom Setting</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Setting Key"
                placeholder="e.g., custom_link"
                value={newSetting.key}
                onChange={(e) =>
                  setNewSetting((prev) => ({ ...prev, key: e.target.value }))
                }
              />
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newSetting.type}
                onChange={(e) =>
                  setNewSetting((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="json">JSON</option>
              </select>
            </div>
            <Input
              label="Value"
              placeholder="Setting value"
              value={newSetting.value}
              onChange={(e) =>
                setNewSetting((prev) => ({ ...prev, value: e.target.value }))
              }
            />
            <Textarea
              label="Description"
              placeholder="What is this setting for?"
              value={newSetting.description}
              onChange={(e) =>
                setNewSetting((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={2}
            />
            <Switch
              isSelected={newSetting.isPublic}
              onValueChange={(isPublic) =>
                setNewSetting((prev) => ({ ...prev, isPublic }))
              }
            >
              Make this setting publicly accessible
            </Switch>
            <div className="flex gap-2">
              <Button color="primary" onPress={handleAddCustomSetting}>
                Add Setting
              </Button>
              <Button variant="light" onPress={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Quick Setup */}
      <div>
        <h3 className="text-lg font-medium mb-4">Quick Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPredefined.map((setting) => {
            const exists = existingKeys.includes(setting.key);
            const existingSetting = settings.find((s) => s.key === setting.key);
            const IconComponent = setting.icon;

            return (
              <Card
                key={setting.key}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  exists ? "border-success" : "border-default-200"
                }`}
                isPressable
                onPress={() => handleQuickSetup(setting)}
              >
                <CardBody className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        exists
                          ? "bg-success-100 text-success-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{setting.label}</h4>
                        {exists && (
                          <Chip size="sm" color="success">
                            Set
                          </Chip>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs mt-1">
                        {setting.description}
                      </p>
                      {exists && existingSetting && (
                        <p className="text-gray-500 text-xs mt-2 truncate">
                          Current: {existingSetting.value || "(empty)"}
                        </p>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Existing Settings */}
      {Array.isArray(settings) && settings.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Current Settings</h3>
          <div className="space-y-4">
            {settings.map((setting) => {
              const predefined = PREDEFINED_SETTINGS.find(
                (p) => p.key === setting.key,
              );

              return (
                <Card key={setting.key}>
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              {predefined?.label || setting.key}
                            </h4>
                            <Chip
                              size="sm"
                              variant="flat"
                              color={setting.isPublic ? "success" : "default"}
                            >
                              {setting.isPublic ? "Public" : "Private"}
                            </Chip>
                            <Chip size="sm" variant="flat">
                              {setting.type}
                            </Chip>
                          </div>
                        </div>

                        {setting.description && (
                          <p className="text-gray-600 text-sm">
                            {setting.description}
                          </p>
                        )}

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-mono break-all">
                            {setting.value || (
                              <span className="text-gray-400">
                                No value set
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="light"
                          color="primary"
                          onPress={() => openEditModal(setting)}
                          startContent={<PencilIcon className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => handleDeleteSetting(setting.key)}
                          startContent={<TrashIcon className="w-4 h-4" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold">
              Edit Setting: {editingSetting?.key}
            </h3>
            {editingSetting &&
              PREDEFINED_SETTINGS.find((p) => p.key === editingSetting.key) && (
                <p className="text-sm text-gray-600">
                  {
                    PREDEFINED_SETTINGS.find(
                      (p) => p.key === editingSetting.key,
                    )?.label
                  }
                </p>
              )}
          </ModalHeader>
          <ModalBody className="space-y-4">
            {editingSetting && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value
                  </label>
                  {editingSetting.type === "text" ? (
                    <Textarea
                      value={editFormData.value}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          value: e.target.value,
                        }))
                      }
                      placeholder="Enter the setting value..."
                      rows={4}
                    />
                  ) : editingSetting.type === "boolean" ? (
                    <Switch
                      isSelected={editFormData.value === "true"}
                      onValueChange={(isSelected) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          value: isSelected.toString(),
                        }))
                      }
                    >
                      {editFormData.value === "true" ? "Enabled" : "Disabled"}
                    </Switch>
                  ) : (
                    <Input
                      value={editFormData.value}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          value: e.target.value,
                        }))
                      }
                      placeholder="Enter the setting value..."
                      type={
                        editingSetting.type === "number" ? "number" : "text"
                      }
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe what this setting is for..."
                    rows={2}
                  />
                </div>

                <div>
                  <Switch
                    isSelected={editFormData.isPublic}
                    onValueChange={(isPublic) =>
                      setEditFormData((prev) => ({ ...prev, isPublic }))
                    }
                  >
                    Make this setting publicly accessible
                  </Switch>
                  <p className="text-xs text-gray-500 mt-1">
                    Public settings can be accessed by frontend components
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Setting Details
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Key:</span>{" "}
                      {editingSetting.key}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {editingSetting.type}
                    </p>
                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(editingSetting.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Updated:</span>{" "}
                      {new Date(editingSetting.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={closeEditModal}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSaveSetting}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
