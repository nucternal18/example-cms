"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  usePage,
  useUpdatePage,
  useDeletePage,
  PageStatus,
  PageBlock,
} from "@/lib/hooks/use-pages";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  status: z.nativeEnum(PageStatus).default(PageStatus.DRAFT),
  publishedAt: z.string().optional(),
  scheduledAt: z.string().optional(),
});

type PageFormData = z.infer<typeof pageSchema>;

const blockTypes = [
  { value: "heading", label: "Heading" },
  { value: "text", label: "Text" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "quote", label: "Quote" },
  { value: "code", label: "Code Block" },
];

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;
  const { data: pageData, isLoading } = usePage(pageId);
  const updatePage = useUpdatePage();
  const deletePage = useDeletePage();
  const [blocks, setBlocks] = useState<PageBlock[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
  });

  const status = watch("status");

  useEffect(() => {
    if (pageData?.data) {
      const page = pageData.data;
      reset({
        title: page.title,
        slug: page.slug,
        status: page.status,
        publishedAt: page.publishedAt
          ? new Date(page.publishedAt).toISOString().slice(0, 16)
          : undefined,
        scheduledAt: page.scheduledAt
          ? new Date(page.scheduledAt).toISOString().slice(0, 16)
          : undefined,
      });
      setBlocks(page.blocks || []);
    }
  }, [pageData, reset]);

  const addBlock = (type: string) => {
    const newBlock: PageBlock = {
      type,
      data: {},
      id: Date.now().toString(),
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (index: number, data: Record<string, any>) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], data: { ...updated[index].data, ...data } };
    setBlocks(updated);
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PageFormData) => {
    try {
      await updatePage.mutateAsync({
        id: pageId,
        data: {
          ...data,
          blocks,
        },
      });
      router.push("/dashboard/pages");
    } catch (error) {
      console.error("Error updating page:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this page?")) {
      try {
        await deletePage.mutateAsync(pageId);
        router.push("/dashboard/pages");
      } catch (error) {
        console.error("Error deleting page:", error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!pageData?.data) {
    return <div>Page not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/pages">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Edit Page</h1>
          <p className="text-muted-foreground">Edit page details and content blocks</p>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          Delete Page
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Page title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...register("slug")}
                placeholder="page-slug"
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setValue("status", value as PageStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PageStatus.DRAFT}>Draft</SelectItem>
                  <SelectItem value={PageStatus.PUBLISHED}>Published</SelectItem>
                  <SelectItem value={PageStatus.ARCHIVED}>Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {status === PageStatus.PUBLISHED && (
              <div className="space-y-2">
                <Label htmlFor="publishedAt">Published At (optional)</Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  {...register("publishedAt")}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Scheduled At (optional)</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                {...register("scheduledAt")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Content Blocks</CardTitle>
              <div className="flex gap-2 flex-wrap">
                {blockTypes.map((type) => (
                  <Button
                    key={type.value}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock(type.value)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {blocks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No blocks added yet. Click a button above to add a content block.
              </p>
            ) : (
              blocks.map((block, index) => (
                <Card key={block.id || index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm capitalize">
                        {block.type} Block
                      </CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBlock(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {block.type === "heading" && (
                      <>
                        <div className="space-y-2">
                          <Label>Level</Label>
                          <Select
                            value={block.data.level || "1"}
                            onValueChange={(value) =>
                              updateBlock(index, { level: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">H1</SelectItem>
                              <SelectItem value="2">H2</SelectItem>
                              <SelectItem value="3">H3</SelectItem>
                              <SelectItem value="4">H4</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Text</Label>
                          <Input
                            value={block.data.text || ""}
                            onChange={(e) =>
                              updateBlock(index, { text: e.target.value })
                            }
                            placeholder="Heading text"
                          />
                        </div>
                      </>
                    )}

                    {block.type === "text" && (
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea
                          value={block.data.content || ""}
                          onChange={(e) =>
                            updateBlock(index, { content: e.target.value })
                          }
                          placeholder="Text content"
                          rows={6}
                        />
                      </div>
                    )}

                    {block.type === "image" && (
                      <>
                        <div className="space-y-2">
                          <Label>Image URL</Label>
                          <Input
                            value={block.data.url || ""}
                            onChange={(e) =>
                              updateBlock(index, { url: e.target.value })
                            }
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Alt Text</Label>
                          <Input
                            value={block.data.alt || ""}
                            onChange={(e) =>
                              updateBlock(index, { alt: e.target.value })
                            }
                            placeholder="Image description"
                          />
                        </div>
                      </>
                    )}

                    {block.type === "video" && (
                      <div className="space-y-2">
                        <Label>Video URL</Label>
                        <Input
                          value={block.data.url || ""}
                          onChange={(e) =>
                            updateBlock(index, { url: e.target.value })
                          }
                          placeholder="https://example.com/video.mp4"
                        />
                      </div>
                    )}

                    {block.type === "quote" && (
                      <>
                        <div className="space-y-2">
                          <Label>Quote Text</Label>
                          <Textarea
                            value={block.data.text || ""}
                            onChange={(e) =>
                              updateBlock(index, { text: e.target.value })
                            }
                            placeholder="Quote text"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Author (optional)</Label>
                          <Input
                            value={block.data.author || ""}
                            onChange={(e) =>
                              updateBlock(index, { author: e.target.value })
                            }
                            placeholder="Quote author"
                          />
                        </div>
                      </>
                    )}

                    {block.type === "code" && (
                      <>
                        <div className="space-y-2">
                          <Label>Code</Label>
                          <Textarea
                            value={block.data.code || ""}
                            onChange={(e) =>
                              updateBlock(index, { code: e.target.value })
                            }
                            placeholder="Code content"
                            rows={8}
                            className="font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Language (optional)</Label>
                          <Input
                            value={block.data.language || ""}
                            onChange={(e) =>
                              updateBlock(index, { language: e.target.value })
                            }
                            placeholder="javascript, python, etc."
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/pages")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updatePage.isPending}>
            {updatePage.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
