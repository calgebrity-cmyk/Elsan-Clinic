import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppointmentsService, Appointment } from '@/services/appointments.service';

export function useAppointments(params?: { date?: string; doctor_id?: string; status?: string }) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => AppointmentsService.getAll(params),
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: () => AppointmentsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Appointment, 'id' | 'status'>) => AppointmentsService.create(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Appointment['status'] }) =>
      AppointmentsService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments', variables.id] });
    },
  });
}
