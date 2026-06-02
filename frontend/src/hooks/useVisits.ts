import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VisitsService, Visit } from '@/services/visits.service';

export function useVisits(params?: { date?: string; doctor_id?: string; patient_id?: string }) {
  return useQuery({
    queryKey: ['visits', params],
    queryFn: () => VisitsService.getAll(params),
  });
}

export function useVisit(id: string) {
  return useQuery({
    queryKey: ['visits', id],
    queryFn: () => VisitsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Visit, 'id'>) => VisitsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
}
