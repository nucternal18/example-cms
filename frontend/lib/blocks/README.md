# Custom Blocks System

This system allows you to create custom block types for dynamic pages, similar to PayloadCMS but simpler.

## Overview

Blocks are reusable content components that can be added to pages. Each block type has:
- A unique slug (identifier)
- A label (display name)
- Field definitions (what data the block stores)
- Optional custom render function (how it displays on the public site)

## Default Block Types

The system comes with these built-in block types:
- **heading** - Headings (H1-H4)
- **text** - Text content
- **image** - Images with alt text
- **video** - Video embeds
- **quote** - Quote blocks with optional author
- **code** - Code blocks with syntax highlighting

## Adding Custom Blocks

### Step 1: Define Your Block Type

Create a block definition in a file (e.g., `lib/blocks/custom-blocks.ts`):

```typescript
import { blockRegistry, type BlockType } from "./block-registry";

const myCustomBlock: BlockType = {
  slug: "my-custom-block",
  label: "My Custom Block",
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "Enter title",
    },
    {
      name: "content",
      label: "Content",
      type: "textarea",
      required: false,
    },
    {
      name: "color",
      label: "Color",
      type: "select",
      defaultValue: "blue",
      options: [
        { value: "blue", label: "Blue" },
        { value: "red", label: "Red" },
      ],
    },
  ],
  // Optional: Custom render function
  render: (data) => {
    return (
      <div className={`p-4 bg-${data.color}-100`}>
        <h3>{data.title as string}</h3>
        <p>{data.content as string}</p>
      </div>
    );
  },
};

// Register the block
blockRegistry.register(myCustomBlock);
```

### Step 2: Register Your Block

Import and register your block in your app initialization (e.g., `app/layout.tsx`):

```typescript
import "@/lib/blocks/custom-blocks"; // This will register your blocks
```

### Step 3: Use Your Block

Your custom block will automatically appear in the "Add Block" dropdown when creating/editing pages.

## Field Types

Available field types:
- `text` - Single line text input
- `textarea` - Multi-line text input
- `number` - Number input (supports min/max validation)
- `select` - Dropdown select (requires `options` array)
- `url` - URL input with validation
- `checkbox` - Boolean checkbox
- `richText` - Rich text editor (currently renders as textarea)

## Field Options

Each field can have:
- `name` - Field identifier (required)
- `label` - Display label (required)
- `type` - Field type (required)
- `required` - Whether field is required (default: false)
- `placeholder` - Placeholder text
- `defaultValue` - Default value
- `options` - Options for select fields
- `validation` - Validation rules (min, max, pattern)

## Custom Rendering

If you don't provide a `render` function, the system will use default rendering based on the block slug. For custom blocks, it's recommended to provide a render function.

The render function receives the block's `data` object and should return a React component.

## Examples

See `custom-blocks.example.ts` for complete examples including:
- Call to Action block
- Two Column layout block

## Backend Validation

The backend accepts any block structure. For production, you may want to add validation based on registered block types. This can be done by:
1. Sharing block definitions between frontend and backend
2. Adding validation middleware that checks block types against a registry
3. Using Zod schemas generated from block definitions
