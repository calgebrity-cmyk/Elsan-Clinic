import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PrescriptionService } from "@/services/prescription.service";

export function usePrescriptionHistory() {
  return useQuery({
    queryKey: ["prescriptions", "history"],
    queryFn: PrescriptionService.getHistory,
  });
}

export function useRegeneratePdf() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => PrescriptionService.regeneratePdf(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions", "history"] });
    },
  });
}
