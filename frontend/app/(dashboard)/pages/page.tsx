"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  usePages,
  useDeletePage,
  PageStatus,
} from "@/lib/hooks/use-pages";
import { Plus, Trash2, Edit, ExternalLink } from "lucide-react";

export default function PagesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PageStatus | undefined>();
  const { data, isLoading } = usePages(statusFilter, page, 10);
  const deletePage = useDeletePage();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this page?")) {
      await deletePage.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground">
            Manage dynamic public-facing pages
          </p>
        </div>
        <Link href="/dashboard/pages/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Page
          </Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <Button
          variant={statusFilter === undefined ? "default" : "outline"}
          onClick={() => setStatusFilter(undefined)}
        >
          All
        </Button>
        <Button
          variant={statusFilter === PageStatus.DRAFT ? "default" : "outline"}
          onClick={() => setStatusFilter(PageStatus.DRAFT)}
        >
          Draft
        </Button>
        <Button
          variant={statusFilter === PageStatus.PUBLISHED ? "default" : "outline"}
          onClick={() => setStatusFilter(PageStatus.PUBLISHED)}
        >
          Published
        </Button>
        <Button
          variant={statusFilter === PageStatus.ARCHIVED ? "default" : "outline"}
          onClick={() => setStatusFilter(PageStatus.ARCHIVED)}
        >
          Archived
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.data.map((pageItem) => (
                <TableRow key={pageItem.id}>
                  <TableCell className="font-medium">
                    {pageItem.title}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    /{pageItem.slug}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        pageItem.status === PageStatus.PUBLISHED
                          ? "bg-green-100 text-green-800"
                          : pageItem.status === PageStatus.DRAFT
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {pageItem.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {pageItem.publishedAt
                      ? new Date(pageItem.publishedAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {new Date(pageItem.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {pageItem.status === PageStatus.PUBLISHED && (
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={`/${pageItem.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/pages/${pageItem.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(pageItem.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.data.data || data.data.data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No pages found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
