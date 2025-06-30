"use client";

import { useState, useEffect, useRef } from "react";
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
  CloudArrowUpIcon,
  EyeIcon,
  CheckCircleIcon,
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
    label: "CV/Resume File",
    description: "Upload your CV/Resume file",
    type: "file",
    fileType: "document",
    isPublic: true,
    category: "Personal",
    icon: DocumentIcon,
    placeholder: "Upload your CV/Resume (PDF recommended)",
    defaultValue: "/Laurent_Cv.pdf",
  },
  {
    key: "linkedin_url",
    label: "LinkedIn Profile",
    description: "Your LinkedIn profile URL",
    type: "url",
    isPublic: true,
    category: "Social",
    icon: LinkIcon,
    placeholder: "https://linkedin.com/in/your-profile",
    defaultValue: "https://linkedin.com/in/laurent-gagne",
  },
  {
    key: "github_url",
    label: "GitHub Profile",
    description: "Your GitHub profile URL",
    type: "url",
    isPublic: true,
    category: "Social",
    icon: LinkIcon,
    placeholder: "https://github.com/your-username",
    defaultValue: "https://github.com/yourusername",
  },
  {
    key: "profile_image_url",
    label: "Profile Image",
    description: "Upload or link to your profile image",
    type: "file",
    fileType: "image",
    isPublic: true,
    category: "Personal",
    icon: PhotoIcon,
    placeholder: "Upload your profile image",
    defaultValue: "/profile-placeholder.jpg",
  },
  {
    key: "site_title",
    label: "Site Title",
    description: "Main title of your portfolio",
    type: "text",
    isPublic: true,
    category: "Site",
    icon: InformationCircleIcon,
    placeholder: "Your Name - Job Title",
    defaultValue: "Laurent Gagne - Full Stack Developer",
  },
  {
    key: "site_description",
    label: "Site Description",
    description: "Brief description of your portfolio/services",
    type: "textarea",
    isPublic: true,
    category: "Site",
    icon: InformationCircleIcon,
    placeholder: "Passionate developer creating innovative solutions...",
    defaultValue:
      "Passionate full-stack developer with expertise in modern web technologies.",
  },
  {
    key: "contact_phone",
    label: "Contact Phone",
    description: "Your contact phone number",
    type: "tel",
    isPublic: true,
    category: "Contact",
    icon: InformationCircleIcon,
    placeholder: "+1 (555) 123-4567",
    defaultValue: "",
  },
  {
    key: "location",
    label: "Location",
    description: "Your current location/city",
    type: "text",
    isPublic: true,
    category: "Personal",
    icon: InformationCircleIcon,
    placeholder: "City, Country",
    defaultValue: "Montreal, Canada",
  },
  {
    key: "years_experience",
    label: "Years of Experience",
    description: "Your years of professional experience",
    type: "number",
    isPublic: true,
    category: "Personal",
    icon: InformationCircleIcon,
    placeholder: "5",
    defaultValue: "5",
  },
];

export default function SettingsManager() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    type: "text",
    description: "",
    isPublic: false,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [editFormData, setEditFormData] = useState({
    value: "",
    description: "",
    isPublic: false,
  });
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ITEMS_PER_PAGE = 9; // 3x3 grid layout

  const api = useApi();

  useEffect(() => {
    loadSettings();
  }, []);
  const loadSettings = async () => {
    try {
      const response = await api.settings.getAll();

      // Handle the double-wrapped response structure
      let settingsData = response.data;
      if (
        settingsData &&
        typeof settingsData === "object" &&
        "data" in settingsData
      ) {
        // The useApi hook wraps the response, so we need the inner data
        settingsData = (settingsData as any).data;
      }

      if (settingsData) {
        const settingsArray = Array.isArray(settingsData) ? settingsData : [];
        setSettings(settingsArray);
      } else {
        setSettings([]);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      setSettings([]);
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
      openEditModal(existingSetting, predefinedSetting);
      return;
    }

    // Create new setting with default value
    const defaultValue = predefinedSetting.defaultValue || "";
    const response = await api.settings.upsert({
      key: predefinedSetting.key,
      value: defaultValue,
      type: predefinedSetting.type,
      description: predefinedSetting.description,
      isPublic: predefinedSetting.isPublic,
    });

    if (response.data) {
      await loadSettings();
      // Use the response data directly since it contains the newly created setting
      openEditModal(response.data, predefinedSetting);
    }
  };

  const openEditModal = (
    setting: Setting,
    predefinedInfo?: (typeof PREDEFINED_SETTINGS)[0],
  ) => {
    setEditingSetting(setting);
    setEditFormData({
      value: setting.value,
      description: setting.description || "",
      isPublic: setting.isPublic,
    });
    setEditModalOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    if (!editingSetting) return;

    setUploadingFile(true);
    try {
      const predefinedInfo = getPredefinedInfo(editingSetting.key);
      const isImage = predefinedInfo?.fileType === "image";

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", isImage ? "profile" : "documents");
      formData.append("type", isImage ? "image" : "document");

      // Upload to file storage service
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();

      // Update the form data with the uploaded file URL
      setEditFormData((prev) => ({
        ...prev,
        value: result.url,
      }));
    } catch (error) {
      console.error("File upload error:", error);
      alert(
        `Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setUploadingFile(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const getPredefinedInfo = (key: string) => {
    return PREDEFINED_SETTINGS.find((p) => p.key === key);
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

  const initializeAllSettings = async () => {
    // Check if settings are empty or if there are missing predefined settings
    const isEmpty = !Array.isArray(settings) || settings.length === 0;
    const missingSettings = PREDEFINED_SETTINGS.filter(
      (predefined) =>
        !settings.find((existing) => existing.key === predefined.key),
    );

    let message: string;
    let actionText: string;

    if (isEmpty) {
      message =
        "No settings found. This will create all predefined portfolio settings with default values. Continue?";
      actionText = "Initialize Portfolio";
    } else if (missingSettings.length > 0) {
      message = `Found ${settings.length} existing settings. This will create ${missingSettings.length} missing predefined settings:\n\n${missingSettings.map((s) => `• ${s.label}`).join("\n")}\n\nExisting settings will not be modified. Continue?`;
      actionText = "Add Missing Settings";
    } else {
      alert("All predefined settings already exist! No action needed.");
      return;
    }

    if (!confirm(message)) {
      return;
    }

    let createdCount = 0;
    const settingsToCreate = isEmpty ? PREDEFINED_SETTINGS : missingSettings;

    for (const predefinedSetting of settingsToCreate) {
      const existingSetting = settings.find(
        (s) => s.key === predefinedSetting.key,
      );

      if (!existingSetting) {
        const defaultValue = predefinedSetting.defaultValue || "";

        try {
          const response = await api.settings.upsert({
            key: predefinedSetting.key,
            value: defaultValue,
            type: predefinedSetting.type,
            description: predefinedSetting.description,
            isPublic: predefinedSetting.isPublic,
          });

          if (response.data) {
            createdCount++;
          }
        } catch (error) {
          console.error(
            `Failed to create setting: ${predefinedSetting.key}`,
            error,
          );
        }
      }
    }

    await loadSettings();

    if (createdCount > 0) {
      alert(
        `✅ Successfully created ${createdCount} new setting${createdCount === 1 ? "" : "s"}!`,
      );
    } else {
      alert("⚠️ No new settings were created. Please check for errors.");
    }
  };

  // Helper function to get button state and text
  const getInitializeButtonState = () => {
    const isEmpty = !Array.isArray(settings) || settings.length === 0;
    const missingSettings = PREDEFINED_SETTINGS.filter(
      (predefined) =>
        !settings.find((existing) => existing.key === predefined.key),
    );

    if (isEmpty) {
      return {
        text: "Initialize Portfolio Settings",
        color: "success" as const,
        variant: "solid" as const,
        className: "animate-pulse",
        icon: PlusIcon,
        disabled: false,
      };
    } else if (missingSettings.length > 0) {
      return {
        text: `Add ${missingSettings.length} Missing Setting${missingSettings.length === 1 ? "" : "s"}`,
        color: "warning" as const,
        variant: "solid" as const,
        className: "",
        icon: PlusIcon,
        disabled: false,
      };
    } else {
      return {
        text: "All Settings Initialized ✓",
        color: "default" as const,
        variant: "bordered" as const,
        className: "",
        icon: CheckCircleIcon,
        disabled: true,
      };
    }
  };

  const existingKeys = Array.isArray(settings)
    ? settings.map((s) => s.key)
    : [];

  const buttonState = getInitializeButtonState();

  const categories = [
    "All",
    ...Array.from(new Set(PREDEFINED_SETTINGS.map((s) => s.category))),
    "Custom",
  ];

  // Create a comprehensive list of all settings (predefined + custom)
  const getAllSettingsForDisplay = (): Array<{
    key: string;
    label: string;
    description: string;
    type: string;
    category: string;
    icon: any;
    exists: boolean;
    existingSetting?: Setting;
    isCustom: boolean;
    placeholder?: string;
    defaultValue?: string;
    fileType?: string;
  }> => {
    const allSettingsData: Array<{
      key: string;
      label: string;
      description: string;
      type: string;
      category: string;
      icon: any;
      exists: boolean;
      existingSetting?: Setting;
      isCustom: boolean;
      placeholder?: string;
      defaultValue?: string;
      fileType?: string;
    }> = [];

    // Add predefined settings (merge with existing data if available)
    PREDEFINED_SETTINGS.forEach((predefined) => {
      const existingSetting = settings.find((s) => s.key === predefined.key);
      allSettingsData.push({
        ...predefined,
        exists: !!existingSetting,
        existingSetting,
        isCustom: false,
      });
    });

    // Add only custom settings that are NOT content settings
    // Content settings are those used for page content (hero, about, contact, etc.)
    // Portfolio settings are those used for site configuration, social links, etc.
    const contentPrefixes = [
      "hero_",
      "about_",
      "contact_",
      "projects_",
      "skills_",
      "footer_",
      "blog_",
      "services_",
      "testimonials_",
      "experience_",
    ];

    settings.forEach((setting) => {
      const isPredefined = PREDEFINED_SETTINGS.some(
        (p) => p.key === setting.key,
      );
      const isContentSetting = contentPrefixes.some((prefix) =>
        setting.key.startsWith(prefix),
      );

      // Only include portfolio settings, not content settings
      if (!isPredefined && !isContentSetting) {
        allSettingsData.push({
          key: setting.key,
          label: setting.key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          description: setting.description || "Custom portfolio setting",
          type: setting.type,
          category: "Custom",
          icon: InformationCircleIcon,
          exists: true,
          existingSetting: setting,
          isCustom: true,
        });
      }
    });

    return allSettingsData;
  };

  const allSettings = getAllSettingsForDisplay();

  // Filter settings based on category and search
  const filteredSettings = allSettings.filter((setting) => {
    const matchesCategory =
      selectedCategory === "All" || setting.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      setting.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (setting.description &&
        setting.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSettings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSettings = filteredSettings.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

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
            color={buttonState.color}
            variant={buttonState.variant}
            onPress={initializeAllSettings}
            size="sm"
            startContent={<buttonState.icon className="w-4 h-4" />}
            className={buttonState.className}
            isDisabled={buttonState.disabled}
          >
            {buttonState.text}
          </Button>
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

      {/* Empty state message */}
      {Array.isArray(settings) && settings.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Settings Found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by initializing your portfolio settings with default
            values. This will create all the essential settings you need to
            customize your portfolio.
          </p>
          <Button
            color={buttonState.color}
            size="lg"
            onPress={initializeAllSettings}
            startContent={<buttonState.icon className="w-5 h-5" />}
            isDisabled={buttonState.disabled}
            className={buttonState.className}
          >
            {buttonState.text}
          </Button>
        </div>
      )}

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

      {/* Search and Filters */}
      {Array.isArray(settings) && settings.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search portfolio settings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={
                  <InformationCircleIcon className="w-4 h-4 text-gray-400" />
                }
                endContent={
                  searchTerm && (
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchTerm("")}
                    >
                      ✕
                    </button>
                  )
                }
                classNames={{
                  input: "text-sm",
                  inputWrapper: "h-10",
                }}
              />
            </div>
            <div className="flex gap-2">
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
          </div>

          {/* Settings Grid */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Settings ({filteredSettings.length})
              </h3>
              {totalPages > 1 && (
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
              {/* 3x3 grid on large screens, responsive on smaller screens */}
              {paginatedSettings.map((setting) => {
                const IconComponent = setting.icon;
                const hasValue =
                  setting.existingSetting?.value &&
                  setting.existingSetting.value.trim() !== "";

                return (
                  <Card
                    key={setting.key}
                    className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] h-full border-2 ${
                      setting.exists
                        ? hasValue
                          ? "border-success-300 bg-success-50/50 hover:border-success-400"
                          : "border-warning-300 bg-warning-50/50 hover:border-warning-400"
                        : "border-gray-200 hover:border-primary-400 bg-white"
                    }`}
                    isPressable
                    onPress={() => {
                      if (setting.exists && setting.existingSetting) {
                        openEditModal(setting.existingSetting);
                      } else {
                        // Create the setting first
                        const predefinedSetting = PREDEFINED_SETTINGS.find(
                          (p) => p.key === setting.key,
                        );
                        if (predefinedSetting) {
                          handleQuickSetup(predefinedSetting);
                        }
                      }
                    }}
                  >
                    <CardBody className="p-4 h-full flex flex-col">
                      <div className="flex items-start gap-3 h-full">
                        <div
                          className={`p-2 rounded-lg flex-shrink-0 ${
                            setting.exists
                              ? hasValue
                                ? "bg-success-100 text-success-600"
                                : "bg-warning-100 text-warning-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col h-full">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-medium text-sm leading-tight line-clamp-2 flex-1">
                              {setting.label}
                            </h4>
                            <div className="flex flex-col gap-1 flex-shrink-0">
                              {setting.exists && (
                                <Chip
                                  size="sm"
                                  color={hasValue ? "success" : "warning"}
                                  variant="flat"
                                  className="text-xs"
                                >
                                  {hasValue ? "Set" : "Empty"}
                                </Chip>
                              )}
                              {setting.isCustom && (
                                <Chip
                                  size="sm"
                                  color="secondary"
                                  variant="flat"
                                  className="text-xs"
                                >
                                  Custom
                                </Chip>
                              )}
                            </div>
                          </div>

                          <p className="text-gray-600 text-xs line-clamp-3 mb-3 flex-1">
                            {setting.description}
                          </p>

                          {setting.exists &&
                            setting.existingSetting &&
                            hasValue && (
                              <div className="mb-3 flex-shrink-0">
                                <div className="bg-gray-50 rounded-md p-2 border">
                                  <p className="text-gray-700 text-xs font-mono truncate">
                                    {setting.type === "file" ||
                                    setting.type === "url"
                                      ? setting.existingSetting.value
                                      : setting.existingSetting.value.length >
                                          40
                                        ? `${setting.existingSetting.value.substring(0, 40)}...`
                                        : setting.existingSetting.value}
                                  </p>
                                </div>
                              </div>
                            )}

                          <div className="flex items-center gap-2 mt-auto flex-shrink-0">
                            <Chip
                              size="sm"
                              variant="bordered"
                              className="text-xs font-medium"
                            >
                              {setting.type}
                            </Chip>
                            <Chip
                              size="sm"
                              variant="bordered"
                              className="text-xs font-medium"
                              color="secondary"
                            >
                              {setting.category}
                            </Chip>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mt-8">
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredSettings.length,
                  )}{" "}
                  of {filteredSettings.length} settings
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="bordered"
                    onPress={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="font-medium"
                  >
                    ← Previous
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber =
                        currentPage <= 3
                          ? i + 1
                          : currentPage >= totalPages - 2
                            ? totalPages - 4 + i
                            : currentPage - 2 + i;

                      if (pageNumber < 1 || pageNumber > totalPages)
                        return null;

                      return (
                        <Button
                          key={pageNumber}
                          size="sm"
                          variant={
                            currentPage === pageNumber ? "solid" : "bordered"
                          }
                          color={
                            currentPage === pageNumber ? "primary" : "default"
                          }
                          onPress={() => setCurrentPage(pageNumber)}
                          className={`min-w-[40px] font-medium ${
                            currentPage === pageNumber
                              ? "shadow-lg"
                              : "hover:shadow-md hover:border-primary-300"
                          }`}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    size="sm"
                    variant="bordered"
                    onPress={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="font-medium"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {editingSetting && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {(() => {
                  const predefinedInfo = getPredefinedInfo(editingSetting.key);
                  const IconComponent =
                    predefinedInfo?.icon || InformationCircleIcon;
                  return (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {predefinedInfo?.label || editingSetting.key}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {predefinedInfo?.description ||
                            editingSetting.description}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </ModalHeader>
              <ModalBody className="space-y-6">
                {(() => {
                  const predefinedInfo = getPredefinedInfo(editingSetting.key);
                  const inputType = predefinedInfo?.type || editingSetting.type;

                  // File upload interface
                  if (inputType === "file") {
                    return (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            {predefinedInfo?.fileType === "image"
                              ? "Image File"
                              : "Document File"}
                          </label>

                          {/* Current file preview */}
                          {editFormData.value && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                  <div>
                                    <p className="text-sm font-medium">
                                      Current file:
                                    </p>
                                    <p className="text-xs text-gray-600 font-mono break-all">
                                      {editFormData.value}
                                    </p>
                                  </div>
                                </div>
                                {(predefinedInfo?.fileType === "image" ||
                                  editFormData.value.match(
                                    /\.(jpg|jpeg|png|gif|webp)$/i,
                                  )) && (
                                  <Button
                                    size="sm"
                                    variant="light"
                                    startContent={
                                      <EyeIcon className="w-4 h-4" />
                                    }
                                    onPress={() =>
                                      window.open(editFormData.value, "_blank")
                                    }
                                  >
                                    Preview
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Upload interface */}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                            <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-sm text-gray-600 mb-4">
                              {predefinedInfo?.placeholder || "Upload a file"}
                            </p>
                            <Button
                              color="primary"
                              variant="bordered"
                              onPress={triggerFileUpload}
                              isLoading={uploadingFile}
                              startContent={
                                !uploadingFile && (
                                  <CloudArrowUpIcon className="w-4 h-4" />
                                )
                              }
                            >
                              {uploadingFile ? "Uploading..." : "Choose File"}
                            </Button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="hidden"
                              accept={
                                predefinedInfo?.fileType === "image"
                                  ? "image/*"
                                  : ".pdf,.doc,.docx"
                              }
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file);
                              }}
                            />
                          </div>

                          {/* Manual URL input */}
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Or enter URL manually:
                            </label>
                            <Input
                              value={editFormData.value}
                              onChange={(e) =>
                                setEditFormData((prev) => ({
                                  ...prev,
                                  value: e.target.value,
                                }))
                              }
                              placeholder={
                                predefinedInfo?.placeholder || "https://..."
                              }
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // URL input interface
                  if (inputType === "url") {
                    return (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL
                          </label>
                          <Input
                            value={editFormData.value}
                            onChange={(e) =>
                              setEditFormData((prev) => ({
                                ...prev,
                                value: e.target.value,
                              }))
                            }
                            placeholder={
                              predefinedInfo?.placeholder || "https://..."
                            }
                            startContent={
                              <LinkIcon className="w-4 h-4 text-gray-400" />
                            }
                          />
                          {editFormData.value && (
                            <div className="mt-2">
                              <Button
                                size="sm"
                                variant="light"
                                startContent={<EyeIcon className="w-4 h-4" />}
                                onPress={() =>
                                  window.open(editFormData.value, "_blank")
                                }
                              >
                                Test Link
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Phone number input
                  if (inputType === "tel") {
                    return (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <Input
                            value={editFormData.value}
                            onChange={(e) =>
                              setEditFormData((prev) => ({
                                ...prev,
                                value: e.target.value,
                              }))
                            }
                            placeholder={
                              predefinedInfo?.placeholder || "+1 (555) 123-4567"
                            }
                            type="tel"
                          />
                        </div>
                      </div>
                    );
                  }

                  // Textarea interface
                  if (inputType === "textarea") {
                    return (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content
                          </label>
                          <Textarea
                            value={editFormData.value}
                            onChange={(e) =>
                              setEditFormData((prev) => ({
                                ...prev,
                                value: e.target.value,
                              }))
                            }
                            placeholder={
                              predefinedInfo?.placeholder ||
                              "Enter your content..."
                            }
                            rows={6}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Character count: {editFormData.value.length}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  // Boolean/Switch interface
                  if (inputType === "boolean") {
                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">Setting Status</h4>
                            <p className="text-sm text-gray-600">
                              {predefinedInfo?.placeholder ||
                                "Toggle this setting on or off"}
                            </p>
                          </div>
                          <Switch
                            isSelected={editFormData.value === "true"}
                            onValueChange={(isSelected) =>
                              setEditFormData((prev) => ({
                                ...prev,
                                value: isSelected.toString(),
                              }))
                            }
                            size="lg"
                          >
                            {editFormData.value === "true"
                              ? "Enabled"
                              : "Disabled"}
                          </Switch>
                        </div>
                      </div>
                    );
                  }

                  // Number input interface
                  if (inputType === "number") {
                    return (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Value
                          </label>
                          <Input
                            value={editFormData.value}
                            onChange={(e) =>
                              setEditFormData((prev) => ({
                                ...prev,
                                value: e.target.value,
                              }))
                            }
                            placeholder={predefinedInfo?.placeholder || "0"}
                            type="number"
                          />
                        </div>
                      </div>
                    );
                  }

                  // Default text input interface
                  return (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Value
                        </label>
                        <Input
                          value={editFormData.value}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              value: e.target.value,
                            }))
                          }
                          placeholder={
                            predefinedInfo?.placeholder || "Enter value..."
                          }
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Description field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <Textarea
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Add a custom description for this setting..."
                    rows={2}
                  />
                </div>

                {/* Public setting toggle */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Visibility</h4>
                      <p className="text-sm text-gray-600">
                        Public settings can be accessed by frontend components
                      </p>
                    </div>
                    <Switch
                      isSelected={editFormData.isPublic}
                      onValueChange={(isPublic) =>
                        setEditFormData((prev) => ({ ...prev, isPublic }))
                      }
                    >
                      {editFormData.isPublic ? "Public" : "Private"}
                    </Switch>
                  </div>
                </div>

                {/* Setting metadata */}
                <div className="bg-gray-50 p-4 rounded-lg border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Setting Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div>
                      <p>
                        <span className="font-medium">Key:</span>{" "}
                        {editingSetting.key}
                      </p>
                      <p>
                        <span className="font-medium">Type:</span>{" "}
                        {editingSetting.type}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">Created:</span>{" "}
                        {new Date(
                          editingSetting.createdAt,
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Updated:</span>{" "}
                        {new Date(
                          editingSetting.updatedAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={closeEditModal}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSaveSetting}
                  isLoading={uploadingFile}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
