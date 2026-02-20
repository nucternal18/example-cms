"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormFieldRenderer } from "./form-field-renderer";
import { useSubmitForm, useFormBySlug, type Form } from "@/lib/hooks/use-forms";
import { Loader2, CheckCircle2 } from "lucide-react";

interface FormRendererProps {
  formSlug: string;
}

export function FormRenderer({ formSlug }: FormRendererProps) {
  const { data: formData, isLoading } = useFormBySlug(formSlug);
  const submitForm = useSubmitForm();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const form = formData?.data;

  const defaultValues = form?.fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue ?? (field.type === "checkbox" ? false : "");
    return acc;
  }, {} as Record<string, unknown>) || {};

  const {
    handleSubmit,
    formState: { errors: formErrors },
    setValue,
    watch,
  } = useForm({
    defaultValues,
  });

  const onSubmit = async (data: Record<string, unknown>) => {
    if (!form) return;

    try {
      await submitForm.mutateAsync({
        formId: form.id,
        data,
      });
      setSubmitted(true);

      // Redirect if configured
      if (form.settings?.redirectUrl) {
        setTimeout(() => {
          window.location.href = form.settings!.redirectUrl!;
        }, 2000);
      }
    } catch (error: any) {
      // Handle validation errors
      if (error.message) {
        const fieldErrors: Record<string, string> = {};
        // Parse error message to extract field-specific errors
        // This is a simple implementation - you may want to enhance it
        setErrors({ general: error.message });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">Form not found</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <Card className="my-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold">
              {form.settings?.successMessage ||
                "Thank you! Your form has been submitted successfully."}
            </p>
            {form.settings?.redirectUrl && (
              <p className="text-sm text-muted-foreground mt-2">
                Redirecting...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="my-8">
      <CardContent className="pt-6">
        {form.description && (
          <p className="text-muted-foreground mb-6">{form.description}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {form.fields.map((field) => {
            const fieldValue = watch(field.name);
            return (
              <FormFieldRenderer
                key={field.name}
                field={field}
                value={fieldValue}
                onChange={(value) => setValue(field.name, value)}
                error={formErrors[field.name]?.message as string}
              />
            );
          })}

          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={submitForm.isPending}
            className="w-full"
          >
            {submitForm.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              form.settings?.submitButtonText || "Submit"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
