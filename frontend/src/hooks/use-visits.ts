import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visitService } from '../services';

export function useVisits() {
  return useQuery({
    queryKey: ['visits'],
    queryFn: () => visitService.getAll(),
  });
}

export function usePatientVisits(patientId: string) {
  return useQuery({
    queryKey: ['visits', 'patient', patientId],
    queryFn: () => visitService.getByPatient(patientId),
    enabled: !!patientId,
  });
}

export function useCreateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: visitService.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['visits', 'patient', variables.patient_id] });
    },
  });
}
