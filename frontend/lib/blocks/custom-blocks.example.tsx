/**
 * Example: How to register custom blocks
 * 
 * Import this file in your app initialization (e.g., app/layout.tsx or a config file)
 * to register custom block types.
 */

import { blockRegistry, type BlockType } from "./block-registry";

// Example: Custom "Call to Action" block
const ctaBlock: BlockType = {
  slug: "cta",
  label: "Call to Action",
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "Enter CTA title",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: false,
      placeholder: "Enter description",
    },
    {
      name: "buttonText",
      label: "Button Text",
      type: "text",
      required: true,
      placeholder: "Click here",
    },
    {
      name: "buttonUrl",
      label: "Button URL",
      type: "url",
      required: true,
      placeholder: "https://example.com",
    },
    {
      name: "style",
      label: "Style",
      type: "select",
      required: false,
      defaultValue: "primary",
      options: [
        { value: "primary", label: "Primary" },
        { value: "secondary", label: "Secondary" },
        { value: "outline", label: "Outline" },
      ],
    },
  ],
  render: (data) => {
    const description = data.description as string | undefined;
    return (
      <div className="my-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">{data.title as string}</h3>
        {description ? (
          <p className="mb-4 text-gray-700">{description}</p>
        ) : null}
        <a
          href={data.buttonUrl as string}
          className={`inline-block px-6 py-2 rounded ${
            data.style === "secondary"
              ? "bg-gray-600 text-white"
              : data.style === "outline"
              ? "border-2 border-blue-600 text-blue-600"
              : "bg-blue-600 text-white"
          }`}
        >
          {data.buttonText as string}
        </a>
      </div>
    );
  },
};

// Example: Custom "Two Column" block
const twoColumnBlock: BlockType = {
  slug: "two-column",
  label: "Two Column Layout",
  fields: [
    {
      name: "leftContent",
      label: "Left Column Content",
      type: "textarea",
      required: true,
      placeholder: "Left column text",
    },
    {
      name: "rightContent",
      label: "Right Column Content",
      type: "textarea",
      required: true,
      placeholder: "Right column text",
    },
  ],
  render: (data) => {
    return (
      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="prose">{data.leftContent as string}</div>
        <div className="prose">{data.rightContent as string}</div>
      </div>
    );
  },
};

// Register custom blocks
// Uncomment to enable:
// blockRegistry.register(ctaBlock);
// blockRegistry.register(twoColumnBlock);
