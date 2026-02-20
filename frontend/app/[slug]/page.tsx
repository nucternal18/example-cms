import { PageBlock } from "@/lib/hooks/use-pages";
import { notFound } from "next/navigation";
import { renderBlock } from "@/lib/blocks/block-renderer";


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
