import { PageBlock } from "@/lib/hooks/use-pages";
import { notFound } from "next/navigation";
import React from "react";
import Image from "next/image";


async function getPageBySlug(slug: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${API_URL}/api/pages/slug/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error: unknown) {
    console.error(error);
    return null;
  }
}

function renderBlock(block: PageBlock) {
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
          dangerouslySetInnerHTML={{ __html: (block.data.content as string | undefined)?.replace(/\n/g, "<br />") || "" }}
        />
      );
    case "image":
      return <Image src={block.data.url as string} alt={(block.data.alt as string | undefined) || ""} width={1000} height={1000} className="w-full rounded-lg" />;
    case "video":
      return (
        <div className="my-8">
          <video src={block.data.url as string} controls className="w-full rounded-lg" />
        </div>
      );
    case "quote": {
      const author = block.data.author as string | undefined;
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 my-8 italic">
          <p className="text-lg">{block.data.text as string}</p>
          {author && (
            <footer className="mt-2 text-sm text-gray-600">
              — {author}
            </footer>
          )}
        </blockquote>
      );
    }
    case "code":
      return (
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-8">
          <code className={(block.data.language as string | undefined) ? `language-${block.data.language}` : ""}>
            {block.data.code as string}
          </code>
        </pre>
      );
    default:
      return null;
  }
}

export default async function PublicPagePage({
  params,
}: {
  params: { slug: string };
}) {
  const pageData = await getPageBySlug(params.slug);

  if (!pageData || pageData.status !== "PUBLISHED") {
    notFound();
  }

  const page = pageData;

  return (
    <div className="min-h-screen bg-background">
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
          {page.publishedAt && (
            <time className="text-muted-foreground">
              {new Date(page.publishedAt).toLocaleDateString()}
            </time>
          )}
        </header>

        <div className="prose prose-lg max-w-none">
          {page.blocks && page.blocks.length > 0 ? (
            page.blocks.map((block: PageBlock, index: number) => (
              <div key={block.id || index}>{renderBlock(block)}</div>
            ))
          ) : (
            <p className="text-muted-foreground">No content available.</p>
          )}
        </div>
      </article>
    </div>
  );
}
