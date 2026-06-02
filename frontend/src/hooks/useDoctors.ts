import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DoctorsService } from "@/services/doctors.service";
import { DoctorFormValues } from "@/schemas/doctor.schema";

export function useDoctors() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: DoctorsService.getAll,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: DoctorFormValues) => DoctorsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}
