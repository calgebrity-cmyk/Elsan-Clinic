import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services';

export function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentService.getAll,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useAssignDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, doctorId }: { id: string; doctorId: string }) => 
      appointmentService.assignDoctor(id, doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      appointmentService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      // We also invalidate visits because a status update might create a visit
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
}
