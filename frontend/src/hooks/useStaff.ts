import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StaffService } from "@/services/staff.service";
import { StaffFormValues } from "@/schemas/staff.schema";

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: StaffService.getAll,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: StaffFormValues) => StaffService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}
