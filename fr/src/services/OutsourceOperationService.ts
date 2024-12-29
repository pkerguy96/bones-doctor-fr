import { APIClient } from "./Http";

const SearchPatientApiClient = new APIClient<{ id: number; name: string }>(
  "/searchPatients"
);
export const SearchHospitalApiClient = new APIClient<any>("/searchHospitals");
export interface AddOutsourceOperationForm {
  patient?: { id: number; name: string } | null; // Selected patient
  hospital?: { id: number; name: string } | null; // Selected hospital
  operation_type: string; // Type of operation
  description: string; // Operation description
  operation_date: string; // Operation date (formatted as YYYY-MM-DD)
  total_price: number;
  amount_paid: number;
  fee: number;
}
