import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export enum PageStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface PageBlock {
  type: string; // 'text', 'image', 'video', 'heading', 'quote', etc.
  data: Record<string, unknown>;
  id?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  blocks: PageBlock[];
  status: PageStatus;
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface CreatePageDto {
  title: string;
  slug: string;
  blocks: PageBlock[];
  status?: PageStatus;
  publishedAt?: string;
  scheduledAt?: string;
}

export function usePages(
  status?: PageStatus,
  page = 1,
  limit = 10
) {
  const queryParams = new URLSearchParams();
  if (status) queryParams.append("status", status);
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  return useQuery({
    queryKey: ["pages", "admin", status, page, limit],
    queryFn: () =>
      api.get<{ data: Page[]; total: number }>(
        `/api/pages/admin?${queryParams.toString()}`
      ),
  });
}

export function usePublishedPages() {
  return useQuery({
    queryKey: ["pages", "published"],
    queryFn: () => api.get<Page[]>("/api/pages"),
  });
}

export function usePage(id: string) {
  return useQuery({
    queryKey: ["pages", id],
    queryFn: () => api.get<Page>(`/api/pages/${id}`),
    enabled: !!id,
  });
}

export function usePageBySlug(slug: string) {
  return useQuery({
    queryKey: ["pages", "slug", slug],
    queryFn: () => api.get<Page>(`/api/pages/slug/${slug}`),
    enabled: !!slug,
  });
}

export function useCreatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePageDto) =>
      api.post<Page>("/api/pages", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePageDto> }) =>
      api.patch<Page>(`/api/pages/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      queryClient.invalidateQueries({ queryKey: ["pages", variables.id] });
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/pages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}
