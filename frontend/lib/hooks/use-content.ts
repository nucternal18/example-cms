import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export enum ContentType {
  ARTICLE = "ARTICLE",
  VIDEO = "VIDEO",
  AD = "AD",
}

export enum ContentStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  body?: string;
  videoUrl?: string;
  imageUrl?: string;
  status: ContentStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  locationIds: string[];
  tags: string[];
  author?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface CreateContentDto {
  type: ContentType;
  title: string;
  description?: string;
  body?: string;
  videoUrl?: string;
  imageUrl?: string;
  status?: ContentStatus;
  publishedAt?: string;
  locationIds?: string[];
  tags?: string[];
}

export function useContent(
  type?: ContentType,
  status?: ContentStatus,
  page = 1,
  limit = 10
) {
  const queryParams = new URLSearchParams();
  if (type) queryParams.append("type", type);
  if (status) queryParams.append("status", status);
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  return useQuery({
    queryKey: ["content", type, status, page, limit],
    queryFn: () =>
      api.get<{ data: Content[]; total: number }>(
        `/api/content?${queryParams.toString()}`
      ),
  });
}

export function useContentItem(id: string) {
  return useQuery({
    queryKey: ["content", id],
    queryFn: () => api.get<Content>(`/api/content/${id}`),
    enabled: !!id,
  });
}

export function useCreateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContentDto) =>
      api.post<Content>("/api/content", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateContentDto> }) =>
      api.patch<Content>(`/api/content/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      queryClient.invalidateQueries({ queryKey: ["content", variables.id] });
    },
  });
}

export function useDeleteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/content/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}
