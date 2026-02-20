import React from "react";
import Image from "next/image";
import { PageBlock } from "@/lib/hooks/use-pages";
import { blockRegistry } from "./block-registry";
import { FormRenderer } from "@/components/forms/form-renderer";

export function renderBlock(block: PageBlock): React.ReactNode {
  const blockType = blockRegistry.get(block.type);

  if (!blockType) {
    return (
      <div className="my-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          Unknown block type: {block.type}
        </p>
      </div>
    );
  }

  // Use custom render function if provided
  if (blockType.render) {
    return blockType.render(block.data);
  }

  // Default rendering based on block type
  switch (block.type) {
    case "heading": {
      const level = (block.data.level as string | undefined) || "1";
      const headingMap: Record<string, React.ElementType> = {
        "1": "h1",
        "2": "h2",
        "3": "h3",
        "4": "h4",
      };
      const HeadingTag = headingMap[level] || "h1";
      return (
        <HeadingTag className="mt-8 mb-4 text-2xl font-bold">
          {block.data.text as string}
        </HeadingTag>
      );
    }

    case "text":
      return (
        <div
          className="prose prose-lg max-w-none mb-6"
          dangerouslySetInnerHTML={{
            __html: (block.data.content as string | undefined)?.replace(
              /\n/g,
              "<br />"
            ) || "",
          }}
        />
      );

    case "image":
      return (
        <div className="my-8">
          <Image
            src={block.data.url as string}
            alt={(block.data.alt as string | undefined) || ""}
            width={1000}
            height={1000}
            className="w-full rounded-lg"
          />
        </div>
      );

    case "video":
      return (
        <div className="my-8">
          <video
            src={block.data.url as string}
            controls
            className="w-full rounded-lg"
          />
        </div>
      );

    case "quote": {
      const author = block.data.author as string | undefined;
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 my-8 italic">
          <p className="text-lg">{block.data.text as string}</p>
          {author && (
            <footer className="mt-2 text-sm text-gray-600">— {author}</footer>
          )}
        </blockquote>
      );
    }

    case "code":
      return (
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-8">
          <code
            className={
              (block.data.language as string | undefined)
                ? `language-${block.data.language}`
                : ""
            }
          >
            {block.data.code as string}
          </code>
        </pre>
      );

    case "form":
      return (
        <FormRenderer formSlug={block.data.formSlug as string} />
      );

    default:
      return (
        <div className="my-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            Block type &quot;{block.type}&quot; has no default renderer. Add a custom
            render function to the block definition.
          </p>
        </div>
      );
  }
}
