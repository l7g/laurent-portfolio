"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

interface SectionContentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: {
    name: string;
    displayName: string;
  } | null;
  onUpdate: () => void;
}

interface SectionContent {
  [key: string]: string;
}

const sectionFieldMappings = {
  hero: [
    {
      key: "hero_greeting",
      label: "Greeting",
      type: "input",
      placeholder: "Hi, I'm Laurent",
    },
    {
      key: "hero_description",
      label: "Description",
      type: "textarea",
      placeholder: "Aspiring Full-Stack Developer...",
    },
    {
      key: "hero_cta_primary",
      label: "Primary Button Text",
      type: "input",
      placeholder: "View My Work",
    },
    {
      key: "hero_cta_secondary",
      label: "Secondary Button Text",
      type: "input",
      placeholder: "View CV",
    },
  ],
  about: [
    {
      key: "about_title",
      label: "Section Title",
      type: "input",
      placeholder: "About Me",
    },
    {
      key: "about_description",
      label: "Main Description",
      type: "textarea",
      placeholder: "I'm a passionate full-stack developer...",
    },
    {
      key: "about_journey_title",
      label: "Journey Section Title",
      type: "input",
      placeholder: "My Journey",
    },
    {
      key: "about_journey_description",
      label: "Journey Description",
      type: "textarea",
      placeholder: "My passion for technology began early...",
    },
    {
      key: "about_stats_title",
      label: "Stats Section Title",
      type: "input",
      placeholder: "Quick Facts",
    },
  ],
  projects: [
    {
      key: "projects_title",
      label: "Section Title",
      type: "input",
      placeholder: "Featured Projects",
    },
    {
      key: "projects_description",
      label: "Section Description",
      type: "textarea",
      placeholder: "Comprehensive full-stack applications...",
    },
  ],
  contact: [
    {
      key: "contact_title",
      label: "Section Title",
      type: "input",
      placeholder: "Let's Connect",
    },
    {
      key: "contact_description",
      label: "Main Description",
      type: "textarea",
      placeholder: "I'm enthusiastic about starting my professional journey...",
    },
    {
      key: "contact_journey_title",
      label: "Journey Card Title",
      type: "input",
      placeholder: "My Journey",
    },
    {
      key: "contact_tab_general",
      label: "General Contact Tab",
      type: "input",
      placeholder: "General Contact",
    },
    {
      key: "contact_tab_work",
      label: "Work Inquiry Tab",
      type: "input",
      placeholder: "Work Inquiry",
    },
    {
      key: "contact_success_message",
      label: "Success Message",
      type: "textarea",
      placeholder: "Message sent successfully!",
    },
    {
      key: "contact_error_message",
      label: "Error Message",
      type: "textarea",
      placeholder: "Failed to send message...",
    },
    {
      key: "contact_general_placeholder",
      label: "General Form Placeholder",
      type: "textarea",
      placeholder: "Tell me about opportunities...",
    },
    {
      key: "contact_work_placeholder",
      label: "Work Form Placeholder",
      type: "textarea",
      placeholder: "Tell me about the role...",
    },
  ],
};

export default function SectionContentEditModal({
  isOpen,
  onClose,
  section,
  onUpdate,
}: SectionContentEditModalProps) {
  const [content, setContent] = useState<SectionContent>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && section) {
      fetchSectionContent();
    }
  }, [isOpen, section]);

  const fetchSectionContent = async () => {
    if (!section) return;

    setLoading(true);
    try {
      const response = await fetch("/api/site-settings");
      if (response.ok) {
        const settings = await response.json();

        // Get only the fields relevant to this section
        const fields =
          sectionFieldMappings[
            section.name as keyof typeof sectionFieldMappings
          ] || [];
        const sectionContent: SectionContent = {};

        fields.forEach((field) => {
          sectionContent[field.key] = settings[field.key] || "";
        });

        setContent(sectionContent);
      }
    } catch (error) {
      console.error("Failed to fetch section content:", error);
      // toast.error("Failed to load section content");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!section) return;

    setSaving(true);
    try {
      // Update each setting individually
      const updates = Object.entries(content).map(([key, value]) =>
        fetch("/api/site-settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key,
            value,
            type: "text",
            isPublic: true,
            description: `${section.displayName} content`,
          }),
        }),
      );

      const results = await Promise.all(updates);
      const allSuccessful = results.every((r) => r.ok);

      if (allSuccessful) {
        console.log(`${section.displayName} content updated successfully!`);
        // toast.success(`${section.displayName} content updated successfully!`);
        onUpdate();
        onClose();
      } else {
        console.error("Some updates failed. Please try again.");
        // toast.error("Some updates failed. Please try again.");
      }
    } catch (error) {
      console.error("Failed to update section content:", error);
      // toast.error("Failed to update section content");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!section) return null;

  const fields =
    sectionFieldMappings[section.name as keyof typeof sectionFieldMappings] ||
    [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "py-6",
      }}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">Edit {section.displayName}</h2>
              <p className="text-sm text-default-600">
                Update the text content that visitors see in this section
              </p>
            </ModalHeader>
            <ModalBody>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium mb-2">
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <Textarea
                          placeholder={field.placeholder}
                          value={content[field.key] || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChange(field.key, e.target.value)
                          }
                          minRows={3}
                          maxRows={6}
                        />
                      ) : (
                        <Input
                          placeholder={field.placeholder}
                          value={content[field.key] || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChange(field.key, e.target.value)
                          }
                        />
                      )}
                    </div>
                  ))}

                  {fields.length === 0 && (
                    <div className="text-center py-8 text-default-600">
                      <p>
                        No editable content fields defined for this section yet.
                      </p>
                      <p className="text-sm mt-2">
                        Contact the developer to add content fields for the{" "}
                        {section.displayName}.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onCloseModal}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSave}
                isLoading={saving}
                isDisabled={loading || fields.length === 0}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
