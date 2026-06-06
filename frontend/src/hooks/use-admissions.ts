import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admissionService } from '../services';

export function useAdmissions() {
  return useQuery({
    queryKey: ['admissions'],
    queryFn: () => admissionService.getAll(),
  });
}

export function useCreateAdmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: admissionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
    },
  });
}

export function useDischargeAdmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: admissionService.discharge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
    },
  });
}

export function useAddDailyVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ admissionId, data }: { admissionId: string; data: any }) => 
      admissionService.addDailyVisit(admissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
    },
  });
}
