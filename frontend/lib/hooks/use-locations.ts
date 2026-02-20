import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export interface Location {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  parent?: Location;
  children?: Location[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLocationDto {
  name: string;
  description?: string;
  parentId?: string;
}

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: () => api.get<Location[]>("/api/locations"),
  });
}

export function useLocation(id: string) {
  return useQuery({
    queryKey: ["locations", id],
    queryFn: () => api.get<Location>(`/api/locations/${id}`),
    enabled: !!id,
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLocationDto) =>
      api.post<Location>("/api/locations", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateLocationDto> }) =>
      api.patch<Location>(`/api/locations/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["locations", variables.id] });
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/locations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}
