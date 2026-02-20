"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateForm,
  FormField,
  FormFieldType,
  FormSettings,
} from "@/lib/hooks/use-forms";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { FormFieldBuilder } from "@/components/forms/form-field-builder";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
});

type FormFormData = z.infer<typeof formSchema>;

const fieldTypes = [
  { value: FormFieldType.TEXT, label: "Text" },
  { value: FormFieldType.EMAIL, label: "Email" },
  { value: FormFieldType.TEXTAREA, label: "Textarea" },
  { value: FormFieldType.NUMBER, label: "Number" },
  { value: FormFieldType.SELECT, label: "Select" },
  { value: FormFieldType.RADIO, label: "Radio" },
  { value: FormFieldType.CHECKBOX, label: "Checkbox" },
  { value: FormFieldType.DATE, label: "Date" },
  { value: FormFieldType.URL, label: "URL" },
  { value: FormFieldType.PHONE, label: "Phone" },
];

export default function NewFormPage() {
  const router = useRouter();
  const [fields, setFields] = useState<FormField[]>([]);
  const [settings, setSettings] = useState<FormSettings>({
    submitButtonText: "Submit",
    successMessage: "Thank you! Your form has been submitted successfully.",
  });
  const createForm = useCreateForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
    },
  });

  const addField = (type: FormFieldType) => {
    const newField: FormField = {
      name: `field_${Date.now()}`,
      label: "New Field",
      type,
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
      await createForm.mutateAsync({
        ...data,
        fields,
        settings,
      });
      router.push("/dashboard/forms");
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/forms">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Form</h1>
          <p className="text-muted-foreground">Create a custom form</p>
        </div>
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
              <p className="text-sm text-muted-foreground">
                Unique identifier for this form
              </p>
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
            <div className="flex items-center justify-between">
              <CardTitle>Form Fields</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {fieldTypes.map((type) => (
                    <DropdownMenuItem
                      key={type.value}
                      onClick={() => addField(type.value)}
                    >
                      {type.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No fields added yet. Click a button above to add a form field.
              </p>
            ) : (
              fields.map((field, index) => (
                <FormFieldBuilder
                  key={index}
                  field={field}
                  index={index}
                  onUpdate={(updates) => updateField(index, updates)}
                  onRemove={() => removeField(index)}
                />
              ))
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
          <Button type="submit" disabled={createForm.isPending}>
            {createForm.isPending ? "Creating..." : "Create Form"}
          </Button>
        </div>
      </form>
    </div>
  );
}
