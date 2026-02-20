"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useCreatePage, PageStatus, PageBlock } from "@/lib/hooks/use-pages";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  status: z.enum(PageStatus),
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

export default function NewPagePage() {
  const router = useRouter();
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const createPage = useCreatePage();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: "",
      slug: "",
      status: PageStatus.DRAFT,
    },
  });

  const status = watch("status");

  const addBlock = (type: string) => {
    const newBlock: PageBlock = {
      type,
      data: {},
      id: Date.now().toString(),
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (index: number, data: Record<string, unknown>) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], data: { ...updated[index].data, ...data } };
    setBlocks(updated);
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PageFormData) => {
    try {
      await createPage.mutateAsync({
        ...data,
        blocks,
      });
      router.push("/dashboard/pages");
    } catch (error) {
      console.error("Error creating page:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/pages">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Page</h1>
          <p className="text-muted-foreground">Create a new dynamic page</p>
        </div>
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
              <p className="text-sm text-muted-foreground">
                URL-friendly identifier (e.g., about-us, contact)
              </p>
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
              <div className="flex gap-2">
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
                            value={(block.data.level as string | undefined) || "1"}
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
                            value={(block.data.text as string | undefined) || ""}
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
                          value={(block.data.content as string | undefined) || ""}
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
                            value={(block.data.url as string | undefined) || ""}
                            onChange={(e) =>
                              updateBlock(index, { url: e.target.value })
                            }
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Alt Text</Label>
                          <Input
                            value={(block.data.alt as string | undefined) || ""}
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
                          value={(block.data.url as string | undefined) || ""}
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
                            value={(block.data.text as string | undefined) || ""}
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
                            value={(block.data.author as string | undefined) || ""}
                            onChange={(e) =>
                              updateBlock(index, { author: e.target.value })
                            }
                            placeholder="Quote author"
                          />
                        </div>
                      </>
                    )}

                    {block.type === "code" && (
                      <div className="space-y-2">
                        <Label>Code</Label>
                        <Textarea
                          value={(block.data.code as string | undefined) || ""}
                          onChange={(e) =>
                            updateBlock(index, { code: e.target.value })
                          }
                          placeholder="Code content"
                          rows={8}
                          className="font-mono"
                        />
                        <div className="space-y-2">
                          <Label>Language (optional)</Label>
                          <Input
                            value={(block.data.language as string | undefined) || ""}
                            onChange={(e) =>
                              updateBlock(index, { language: e.target.value })
                            }
                            placeholder="javascript, python, etc."
                          />
                        </div>
                      </div>
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
          <Button type="submit" disabled={createPage.isPending}>
            {createPage.isPending ? "Creating..." : "Create Page"}
          </Button>
        </div>
      </form>
    </div>
  );
}
