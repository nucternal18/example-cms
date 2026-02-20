import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export enum FormFieldType {
  TEXT = "text",
  EMAIL = "email",
  TEXTAREA = "textarea",
  NUMBER = "number",
  SELECT = "select",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  DATE = "date",
  URL = "url",
  PHONE = "phone",
}

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: FormFieldOption[];
  defaultValue?: string | number | boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface FormSettings {
  successMessage?: string;
  redirectUrl?: string;
  submitButtonText?: string;
  emailNotification?: string;
}

export interface Form {
  id: string;
  title: string;
  slug: string;
  description?: string;
  fields: FormField[];
  settings?: FormSettings;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy?: {
    id: string;
    name?: string;
    email: string;
  };
  _count?: {
    submissions: number;
  };
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  submittedAt: string;
  userEmail?: string;
  userName?: string;
  userIp?: string;
}

export interface CreateFormDto {
  title: string;
  slug: string;
  description?: string;
  fields: FormField[];
  settings?: FormSettings;
}

export interface SubmitFormDto {
  data: Record<string, unknown>;
  userEmail?: string;
  userName?: string;
}

export function useForms() {
  return useQuery({
    queryKey: ["forms"],
    queryFn: () => api.get<Form[]>("/api/forms"),
  });
}

export function useForm(id: string) {
  return useQuery({
    queryKey: ["forms", id],
    queryFn: () => api.get<Form>(`/api/forms/${id}`),
    enabled: !!id,
  });
}

export function useFormBySlug(slug: string) {
  return useQuery({
    queryKey: ["forms", "slug", slug],
    queryFn: () => api.get<Form>(`/api/forms/public/${slug}`),
    enabled: !!slug,
  });
}

export function useCreateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFormDto) => api.post<Form>("/api/forms", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });
}

export function useUpdateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateFormDto> }) =>
      api.patch<Form>(`/api/forms/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["forms", variables.id] });
    },
  });
}

export function useDeleteForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/forms/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });
}

export function useSubmitForm() {
  return useMutation({
    mutationFn: ({ formId, data }: { formId: string; data: SubmitFormDto }) =>
      api.post(`/api/forms/${formId}/submit`, data),
  });
}

export function useFormSubmissions(formId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ["forms", formId, "submissions", page, limit],
    queryFn: () =>
      api.get<{ data: FormSubmission[]; total: number }>(
        `/api/forms/${formId}/submissions?page=${page}&limit=${limit}`
      ),
    enabled: !!formId,
  });
}
