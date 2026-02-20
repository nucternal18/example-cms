import { blockRegistry, type BlockType } from "./block-registry";

// Form block type - dynamically loads forms
const formBlockType: BlockType = {
  slug: "form",
  label: "Form",
  fields: [
    {
      name: "formSlug",
      label: "Form Slug",
      type: "text",
      required: true,
      placeholder: "contact-form",
      helpText: "Enter the slug of the form to embed",
    },
  ],
};

// Register form block type
blockRegistry.register(formBlockType);
