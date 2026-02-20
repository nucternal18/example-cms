"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { PageBlock } from "@/lib/hooks/use-pages";
import { blockRegistry, type BlockType } from "@/lib/blocks/block-registry";
import { BlockFieldRenderer } from "@/lib/blocks/block-field-renderer";

interface BlockEditorProps {
  block: PageBlock;
  index: number;
  onUpdate: (index: number, data: Record<string, unknown>) => void;
  onRemove: (index: number) => void;
}

export function BlockEditor({
  block,
  index,
  onUpdate,
  onRemove,
}: BlockEditorProps) {
  const blockType = blockRegistry.get(block.type);

  if (!blockType) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              Unknown Block Type: {block.type}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const updateField = (fieldName: string, value: unknown) => {
    onUpdate(index, {
      ...block.data,
      [fieldName]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm capitalize">
            {blockType.label} Block
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {blockType.fields.map((field) => (
          <BlockFieldRenderer
            key={field.name}
            field={field}
            value={block.data[field.name]}
            onChange={(value) => updateField(field.name, value)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
