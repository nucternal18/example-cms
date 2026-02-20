"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { blockRegistry } from "@/lib/blocks/block-registry";

interface BlockTypeSelectorProps {
  onSelect: (blockSlug: string) => void;
}

export function BlockTypeSelector({ onSelect }: BlockTypeSelectorProps) {
  const blockTypes = blockRegistry.getAll();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Block
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {blockTypes.map((blockType) => (
          <DropdownMenuItem
            key={blockType.slug}
            onClick={() => onSelect(blockType.slug)}
          >
            {blockType.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
