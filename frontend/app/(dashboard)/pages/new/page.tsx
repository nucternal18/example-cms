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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BlockEditor } from "@/components/blocks/block-editor";
import { BlockTypeSelector } from "@/components/blocks/block-type-selector";
import { blockRegistry } from "@/lib/blocks/block-registry";

const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  status: z.enum(PageStatus),
  publishedAt: z.string().optional(),
  scheduledAt: z.string().optional(),
});

type PageFormData = z.infer<typeof pageSchema>;

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

  const addBlock = (blockSlug: string) => {
    const blockType = blockRegistry.get(blockSlug);
    if (!blockType) return;

    // Initialize block with default values
    const defaultData: Record<string, unknown> = {};
    blockType.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaultData[field.name] = field.defaultValue;
      }
    });

    const newBlock: PageBlock = {
      type: blockSlug,
      data: defaultData,
      id: Date.now().toString(),
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (index: number, data: Record<string, unknown>) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], data };
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
              <BlockTypeSelector onSelect={addBlock} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {blocks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No blocks added yet. Click &quot;Add Block&quot; above to add a content block.
              </p>
            ) : (
              blocks.map((block, index) => (
                <BlockEditor
                  key={block.id || index}
                  block={block}
                  index={index}
                  onUpdate={updateBlock}
                  onRemove={removeBlock}
                />
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
