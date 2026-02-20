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
import type { BlockField } from "./block-registry";

interface BlockFieldRendererProps {
  field: BlockField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function BlockFieldRenderer({
  field,
  value,
  onChange,
}: BlockFieldRendererProps) {
  const renderField = () => {
    switch (field.type) {
      case "text":
      case "url":
        return (
          <Input
            type={field.type === "url" ? "url" : "text"}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case "textarea":
      case "richText":
        return (
          <Textarea
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={field.type === "richText" ? 8 : 6}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={(value as number) || ""}
            onChange={(e) =>
              onChange(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            placeholder={field.placeholder}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );

      case "select":
        return (
          <Select
            value={(value as string) || (field.defaultValue as string | undefined) || ""}
            onValueChange={onChange}
          >
            <SelectTrigger>
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
          />
        );
    }
  };

  if (field.type === "checkbox") {
    return <div className="space-y-2">{renderField()}</div>;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
    </div>
  );
}
