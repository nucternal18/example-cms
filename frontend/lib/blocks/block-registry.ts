export type FieldType = 
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "url"
  | "checkbox"
  | "richText";

export interface BlockField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select fields
  defaultValue?: unknown;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface BlockType {
  slug: string;
  label: string;
  icon?: string;
  fields: BlockField[];
  render?: (data: Record<string, unknown>) => React.ReactNode;
}

// Default block types
export const defaultBlockTypes: BlockType[] = [
  {
    slug: "heading",
    label: "Heading",
    fields: [
      {
        name: "level",
        label: "Level",
        type: "select",
        required: true,
        defaultValue: "1",
        options: [
          { value: "1", label: "H1" },
          { value: "2", label: "H2" },
          { value: "3", label: "H3" },
          { value: "4", label: "H4" },
        ],
      },
      {
        name: "text",
        label: "Text",
        type: "text",
        required: true,
        placeholder: "Heading text",
      },
    ],
  },
  {
    slug: "text",
    label: "Text",
    fields: [
      {
        name: "content",
        label: "Content",
        type: "textarea",
        required: true,
        placeholder: "Text content",
      },
    ],
  },
  {
    slug: "image",
    label: "Image",
    fields: [
      {
        name: "url",
        label: "Image URL",
        type: "url",
        required: true,
        placeholder: "https://example.com/image.jpg",
      },
      {
        name: "alt",
        label: "Alt Text",
        type: "text",
        placeholder: "Image description",
      },
    ],
  },
  {
    slug: "video",
    label: "Video",
    fields: [
      {
        name: "url",
        label: "Video URL",
        type: "url",
        required: true,
        placeholder: "https://example.com/video.mp4",
      },
    ],
  },
  {
    slug: "quote",
    label: "Quote",
    fields: [
      {
        name: "text",
        label: "Quote Text",
        type: "textarea",
        required: true,
        placeholder: "Quote text",
      },
      {
        name: "author",
        label: "Author",
        type: "text",
        placeholder: "Quote author",
      },
    ],
  },
  {
    slug: "code",
    label: "Code Block",
    fields: [
      {
        name: "code",
        label: "Code",
        type: "textarea",
        required: true,
        placeholder: "Code content",
      },
      {
        name: "language",
        label: "Language",
        type: "text",
        placeholder: "javascript, python, etc.",
      },
    ],
  },
];

// Block registry - can be extended with custom blocks
class BlockRegistry {
  private blocks: Map<string, BlockType> = new Map();

  constructor() {
    // Register default blocks
    defaultBlockTypes.forEach((block) => {
      this.register(block);
    });
  }

  register(block: BlockType): void {
    this.blocks.set(block.slug, block);
  }

  get(slug: string): BlockType | undefined {
    return this.blocks.get(slug);
  }

  getAll(): BlockType[] {
    return Array.from(this.blocks.values());
  }

  has(slug: string): boolean {
    return this.blocks.has(slug);
  }
}

export const blockRegistry = new BlockRegistry();
