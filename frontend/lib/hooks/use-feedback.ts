import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export enum FeedbackType {
  FEEDBACK = "FEEDBACK",
  SUPPORT = "SUPPORT",
  BUG_REPORT = "BUG_REPORT",
}

export enum FeedbackStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export interface FeedbackResponse {
  id: string;
  feedbackId: string;
  message: string;
  authorId: string;
  createdAt: string;
  author?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface Feedback {
  id: string;
  userId?: string;
  type: FeedbackType;
  category?: string;
  subject: string;
  message: string;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
  responses?: FeedbackResponse[];
}

export interface CreateFeedbackDto {
  userId?: string;
  type: FeedbackType;
  category?: string;
  subject: string;
  message: string;
}

export interface RespondFeedbackDto {
  message: string;
}

export function useFeedback(
  status?: FeedbackStatus,
  page = 1,
  limit = 10
) {
  const queryParams = new URLSearchParams();
  if (status) queryParams.append("status", status);
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  return useQuery({
    queryKey: ["feedback", status, page, limit],
    queryFn: () =>
      api.get<{ data: Feedback[]; total: number }>(
        `/api/feedback?${queryParams.toString()}`
      ),
  });
}

export function useFeedbackItem(id: string) {
  return useQuery({
    queryKey: ["feedback", id],
    queryFn: () => api.get<Feedback>(`/api/feedback/${id}`),
    enabled: !!id,
  });
}

export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFeedbackDto) =>
      api.post<Feedback>("/api/feedback", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
    },
  });
}

export function useUpdateFeedbackStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: FeedbackStatus }) =>
      api.patch<Feedback>(`/api/feedback/${id}/status`, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      queryClient.invalidateQueries({ queryKey: ["feedback", variables.id] });
    },
  });
}

export function useRespondFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RespondFeedbackDto }) =>
      api.post<Feedback>(`/api/feedback/${id}/respond`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      queryClient.invalidateQueries({ queryKey: ["feedback", variables.id] });
    },
  });
}
