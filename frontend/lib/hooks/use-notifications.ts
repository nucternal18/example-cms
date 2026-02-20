import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export enum NotificationType {
  INFO = "INFO",
  ALERT = "ALERT",
  PROMOTION = "PROMOTION",
}

export enum NotificationTarget {
  ALL = "ALL",
  LOCATION = "LOCATION",
  USER = "USER",
}

export enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  targetType: NotificationTarget;
  locationIds: string[];
  scheduledAt?: string;
  sentAt?: string;
  status: NotificationStatus;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  type: NotificationType;
  targetType?: NotificationTarget;
  locationIds?: string[];
  scheduledAt?: string;
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get<Notification[]>("/api/notifications"),
  });
}

export function useNotification(id: string) {
  return useQuery({
    queryKey: ["notifications", id],
    queryFn: () => api.get<Notification>(`/api/notifications/${id}`),
    enabled: !!id,
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotificationDto) =>
      api.post<Notification>("/api/notifications", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useUpdateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateNotificationDto> }) =>
      api.patch<Notification>(`/api/notifications/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", variables.id] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useSendNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.post<Notification>(`/api/notifications/${id}/send`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
