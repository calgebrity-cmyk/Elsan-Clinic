import { apiClient } from "@/lib/axios";
import { PrescriptionHistoryResponse } from "@/schemas/prescription.schema";

export class PrescriptionService {
  static async getHistory(): Promise<PrescriptionHistoryResponse[]> {
    const { data } = await apiClient.get<PrescriptionHistoryResponse[]>("/prescriptions/history");
    return data;
  }

  static async downloadPdf(id: string): Promise<Blob> {
    const { data } = await apiClient.get(`/prescriptions/${id}/download`, {
      responseType: "blob",
    });
    return data;
  }

  static async regeneratePdf(id: string): Promise<{ message: string; pdf_url: string }> {
    const { data } = await apiClient.post(`/prescriptions/${id}/regenerate-pdf`);
    return data;
  }
}
