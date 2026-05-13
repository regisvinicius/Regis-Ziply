import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryKeys } from '../lib/query-keys';
import type { CreateLinkInput } from '../lib/validators';

export function useLinks() {
  return useQuery({
    queryKey: queryKeys.links(),
    queryFn: () => api.list(),
    staleTime: 10_000,
  });
}

export function useCreateLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLinkInput) => api.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.links() });
    },
  });
}

export function useDeleteLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (shortPath: string) => api.remove(shortPath),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.links() });
    },
  });
}

export function useDownloadCsv() {
  return useMutation({
    mutationFn: () => api.exportCsv(),
  });
}
