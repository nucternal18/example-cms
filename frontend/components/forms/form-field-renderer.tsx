"use client";

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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { FormField } from "@/lib/hooks/use-forms";

interface FormFieldRendererProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export function FormFieldRenderer({
  field,
  value,
  onChange,
  error,
}: FormFieldRendererProps) {
  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "url":
      case "phone":
        return (
          <Input
            type={field.type === "email" ? "email" : field.type === "url" ? "url" : field.type === "phone" ? "tel" : "text"}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={error ? "border-red-500" : ""}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className={error ? "border-red-500" : ""}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={(value as number) || ""}
            onChange={(e) =>
              onChange(e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder={field.placeholder}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
            className={error ? "border-red-500" : ""}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className={error ? "border-red-500" : ""}
          />
        );

      case "select":
        return (
          <Select
            value={(value as string) || ""}
            onValueChange={onChange}
          >
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder={field.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            value={(value as string) || ""}
            onValueChange={onChange}
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={(value as boolean) || false}
              onCheckedChange={(checked) => onChange(checked)}
            />
            <label
              htmlFor={field.name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </label>
          </div>
        );

      default:
        return (
          <Input
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={error ? "border-red-500" : ""}
          />
        );
    }
  };

  if (field.type === "checkbox") {
    return (
      <div className="space-y-2">
        {renderField()}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {field.helpText && (
        <p className="text-sm text-muted-foreground">{field.helpText}</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
