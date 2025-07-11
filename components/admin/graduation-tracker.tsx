"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Chip } from "@heroui/chip";
import {
  AcademicCapIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

interface GraduationData {
  id: string;
  degree: string;
  institution: string;
  expectedEnd: string;
  actualGraduationDate?: string;
  dissertationStarted: boolean;
  dissertationTitle?: string;
  dissertationDeadline?: string;
  dissertationSubmitted: boolean;
  dissertationSubmissionDate?: string;
  status: string;
  graduationStatus: string;
  hasGraduated: boolean;
  isDissertationPhase: boolean;
}

export default function GraduationTracker() {
  const [data, setData] = useState<GraduationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<GraduationData>>({});

  useEffect(() => {
    fetchGraduationData();
  }, []);

  const fetchGraduationData = async () => {
    try {
      const response = await fetch("/api/graduation-tracking");

      if (response.ok) {
        const graduationData = await response.json();

        setData(graduationData);
        setFormData(graduationData);
      }
    } catch (error) {
      console.error("Error fetching graduation data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveGraduationData = async () => {
    try {
      const response = await fetch("/api/graduation-tracking", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchGraduationData();
        setEditing(false);
        alert("Graduation tracking updated successfully!");
      } else {
        alert("Failed to update graduation tracking");
      }
    } catch (error) {
      console.error("Error updating graduation data:", error);
      alert("Error updating graduation tracking");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "graduated":
        return "success";
      case "in_progress":
        return "primary";
      case "overdue":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "graduated":
        return "Graduated";
      case "in_progress":
        return "In Progress";
      case "overdue":
        return "Overdue";
      default:
        return status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse">Loading graduation tracking...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No graduation data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AcademicCapIcon className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-bold">{data.degree}</h2>
              <p className="text-gray-600">{data.institution}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Chip color={getStatusColor(data.graduationStatus)} variant="flat">
              {getStatusText(data.graduationStatus)}
            </Chip>
            <Button
              color="primary"
              size="sm"
              startContent={<PencilIcon className="w-4 h-4" />}
              variant={editing ? "solid" : "flat"}
              onPress={() => setEditing(!editing)}
            >
              {editing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Timeline Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Graduation Timeline</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <p className="font-medium">Expected Graduation</p>
                <p className="text-gray-600">{formatDate(data.expectedEnd)}</p>
              </div>
              <Chip color="warning" size="sm" variant="flat">
                Expected
              </Chip>
            </div>

            {data.actualGraduationDate && (
              <div className="flex items-center gap-4">
                <CheckCircleIcon className="w-5 h-5 text-success" />
                <div className="flex-1">
                  <p className="font-medium">Actual Graduation</p>
                  <p className="text-gray-600">
                    {formatDate(data.actualGraduationDate)}
                  </p>
                </div>
                <Chip color="success" size="sm" variant="flat">
                  {data.hasGraduated ? "Completed" : "Scheduled"}
                </Chip>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Dissertation Tracking */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Dissertation Progress</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Dissertation Started</span>
              </div>
              <Chip
                color={data.dissertationStarted ? "success" : "default"}
                size="sm"
                variant="flat"
              >
                {data.dissertationStarted ? "Yes" : "No"}
              </Chip>
            </div>

            {data.dissertationStarted && (
              <>
                {data.dissertationTitle && (
                  <div>
                    <p className="font-medium text-sm text-gray-700 mb-1">
                      Title
                    </p>
                    <p className="text-gray-600">{data.dissertationTitle}</p>
                  </div>
                )}

                {data.dissertationDeadline && (
                  <div className="flex items-center gap-4">
                    <ClockIcon className="w-5 h-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="font-medium">Deadline</p>
                      <p className="text-gray-600">
                        {formatDate(data.dissertationDeadline)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Submitted</span>
                  </div>
                  <Chip
                    color={data.dissertationSubmitted ? "success" : "warning"}
                    size="sm"
                    variant="flat"
                  >
                    {data.dissertationSubmitted ? "Yes" : "No"}
                  </Chip>
                </div>

                {data.dissertationSubmissionDate && (
                  <div className="ml-8">
                    <p className="font-medium text-sm text-gray-700 mb-1">
                      Submission Date
                    </p>
                    <p className="text-gray-600">
                      {formatDate(data.dissertationSubmissionDate)}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Edit Form */}
      {editing && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              Update Graduation Tracking
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Actual Graduation Date
              </label>
              <Input
                description="Leave empty if not yet scheduled"
                type="date"
                value={
                  formData.actualGraduationDate
                    ? formData.actualGraduationDate.split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    actualGraduationDate: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : undefined,
                  })
                }
              />
            </div>

            <div className="space-y-4">
              <Switch
                isSelected={formData.dissertationStarted}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    dissertationStarted: value,
                  })
                }
              >
                Dissertation Started
              </Switch>

              {formData.dissertationStarted && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Dissertation Title
                    </label>
                    <Input
                      placeholder="Enter dissertation title"
                      value={formData.dissertationTitle || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dissertationTitle: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Dissertation Deadline
                    </label>
                    <Input
                      type="date"
                      value={
                        formData.dissertationDeadline
                          ? formData.dissertationDeadline.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dissertationDeadline: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : undefined,
                        })
                      }
                    />
                  </div>

                  <Switch
                    isSelected={formData.dissertationSubmitted}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        dissertationSubmitted: value,
                      })
                    }
                  >
                    Dissertation Submitted
                  </Switch>

                  {formData.dissertationSubmitted && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Submission Date
                      </label>
                      <Input
                        type="date"
                        value={
                          formData.dissertationSubmissionDate
                            ? formData.dissertationSubmissionDate.split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dissertationSubmissionDate: e.target.value
                              ? new Date(e.target.value).toISOString()
                              : undefined,
                          })
                        }
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button color="primary" onPress={saveGraduationData}>
                Save Changes
              </Button>
              <Button variant="flat" onPress={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
