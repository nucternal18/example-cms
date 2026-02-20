"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Trash2, Plus } from "lucide-react";
import type { FormField, FormFieldType } from "@/lib/hooks/use-forms";

interface FormFieldBuilderProps {
  field: FormField;
  index: number;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
}

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

export function FormFieldBuilder({
  field,
  index,
  onUpdate,
  onRemove,
}: FormFieldBuilderProps) {
  const addOption = () => {
    const newOptions = [
      ...(field.options || []),
      { label: "Option", value: `option_${Date.now()}` },
    ];
    onUpdate({ options: newOptions });
  };

  const updateOption = (optionIndex: number, updates: Partial<{ label: string; value: string }>) => {
    const newOptions = [...(field.options || [])];
    newOptions[optionIndex] = { ...newOptions[optionIndex], ...updates };
    onUpdate({ options: newOptions });
  };

  const removeOption = (optionIndex: number) => {
    const newOptions = field.options?.filter((_, i) => i !== optionIndex) || [];
    onUpdate({ options: newOptions });
  };

  const needsOptions = field.type === FormFieldType.SELECT || field.type === FormFieldType.RADIO;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Field {index + 1}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Field Name</Label>
            <Input
              value={field.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="field_name"
            />
          </div>

          <div className="space-y-2">
            <Label>Field Label</Label>
            <Input
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Field Label"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Field Type</Label>
          <Select
            value={field.type}
            onValueChange={(value) => onUpdate({ type: value as FormFieldType })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fieldTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Placeholder (optional)</Label>
          <Input
            value={field.placeholder || ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            placeholder="Enter placeholder text"
          />
        </div>

        <div className="space-y-2">
          <Label>Help Text (optional)</Label>
          <Input
            value={field.helpText || ""}
            onChange={(e) => onUpdate({ helpText: e.target.value })}
            placeholder="Helpful text for users"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id={`required-${index}`}
            checked={field.required || false}
            onCheckedChange={(checked) => onUpdate({ required: checked as boolean })}
          />
          <Label htmlFor={`required-${index}`} className="cursor-pointer">
            Required field
          </Label>
        </div>

        {needsOptions && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button type="button" variant="outline" size="sm" onClick={addOption}>
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>
            {field.options?.map((option, optIndex) => (
              <div key={optIndex} className="flex gap-2">
                <Input
                  value={option.label}
                  onChange={(e) =>
                    updateOption(optIndex, { label: e.target.value })
                  }
                  placeholder="Option label"
                />
                <Input
                  value={option.value}
                  onChange={(e) =>
                    updateOption(optIndex, { value: e.target.value })
                  }
                  placeholder="Option value"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(optIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {(!field.options || field.options.length === 0) && (
              <p className="text-sm text-muted-foreground">
                No options added. Click "Add Option" to add choices.
              </p>
            )}
          </div>
        )}

        {(field.type === FormFieldType.NUMBER || field.type === FormFieldType.TEXT || field.type === FormFieldType.TEXTAREA) && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Length</Label>
              <Input
                type="number"
                value={field.validation?.minLength || ""}
                onChange={(e) =>
                  onUpdate({
                    validation: {
                      ...field.validation,
                      minLength: e.target.value ? Number(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="Min"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Length</Label>
              <Input
                type="number"
                value={field.validation?.maxLength || ""}
                onChange={(e) =>
                  onUpdate({
                    validation: {
                      ...field.validation,
                      maxLength: e.target.value ? Number(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="Max"
              />
            </div>
          </div>
        )}

        {field.type === FormFieldType.NUMBER && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Value</Label>
              <Input
                type="number"
                value={field.validation?.min || ""}
                onChange={(e) =>
                  onUpdate({
                    validation: {
                      ...field.validation,
                      min: e.target.value ? Number(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="Min"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Value</Label>
              <Input
                type="number"
                value={field.validation?.max || ""}
                onChange={(e) =>
                  onUpdate({
                    validation: {
                      ...field.validation,
                      max: e.target.value ? Number(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="Max"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
