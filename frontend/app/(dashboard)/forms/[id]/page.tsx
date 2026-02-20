"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useForm as useFormHook,
  useUpdateForm,
  useDeleteForm,
  FormField,
  FormSettings,
} from "@/lib/hooks/use-forms";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FormFieldBuilder } from "@/components/forms/form-field-builder";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
});

type FormFormData = z.infer<typeof formSchema>;

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;
  const { data: formData, isLoading } = useFormHook(formId);
  const updateForm = useUpdateForm();
  const deleteForm = useDeleteForm();
  const [fields, setFields] = useState<FormField[]>([]);
  const [settings, setSettings] = useState<FormSettings>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (formData?.data) {
      const form = formData.data;
      reset({
        title: form.title,
        slug: form.slug,
        description: form.description || "",
      });
      setFields(form.fields || []);
      setSettings(form.settings || {});
    }
  }, [formData, reset]);

  const addField = (type: string) => {
    const newField: FormField = {
      name: `field_${Date.now()}`,
      label: "New Field",
      type: type as any,
      required: false,
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], ...updates };
    setFields(updated);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormFormData) => {
    try {
      await updateForm.mutateAsync({
        id: formId,
        data: {
          ...data,
          fields,
          settings,
        },
      });
      router.push("/dashboard/forms");
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this form?")) {
      try {
        await deleteForm.mutateAsync(formId);
        router.push("/dashboard/forms");
      } catch (error) {
        console.error("Error deleting form:", error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!formData?.data) {
    return <div>Form not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/forms">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Edit Form</h1>
          <p className="text-muted-foreground">Edit form details and fields</p>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          Delete Form
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Form Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Contact Form"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...register("slug")}
                placeholder="contact-form"
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Form description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <FormFieldBuilder
                key={index}
                field={field}
                index={index}
                onUpdate={(updates) => updateField(index, updates)}
                onRemove={() => removeField(index)}
              />
            ))}
            {fields.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No fields added yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="submitButtonText">Submit Button Text</Label>
              <Input
                id="submitButtonText"
                value={settings.submitButtonText || "Submit"}
                onChange={(e) =>
                  setSettings({ ...settings, submitButtonText: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="successMessage">Success Message</Label>
              <Textarea
                id="successMessage"
                value={settings.successMessage || ""}
                onChange={(e) =>
                  setSettings({ ...settings, successMessage: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="redirectUrl">Redirect URL (optional)</Label>
              <Input
                id="redirectUrl"
                type="url"
                value={settings.redirectUrl || ""}
                onChange={(e) =>
                  setSettings({ ...settings, redirectUrl: e.target.value })
                }
                placeholder="https://example.com/thank-you"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailNotification">Email Notification (optional)</Label>
              <Input
                id="emailNotification"
                type="email"
                value={settings.emailNotification || ""}
                onChange={(e) =>
                  setSettings({ ...settings, emailNotification: e.target.value })
                }
                placeholder="notifications@example.com"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/forms")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateForm.isPending}>
            {updateForm.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
