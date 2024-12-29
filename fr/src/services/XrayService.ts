import { APIClient } from "./Http";

export interface XrayProps {
  patient_id?: string;
  xray_type: string[];
  view_type: string[];
  body_side: string[];
  note?: string;
}
export interface XrayData {
  operation_id: number;
  patient_id: number;
  xray_type: string;
  price: number;
}

export interface XrayItem {
  patient_name: string; // Full name of the patient
  xray_type: string; // Type of X-ray
  view_type: string; // View type of the X-ray (e.g., Face, Side)
  body_side: string; // Side of the body (e.g., Left, Right, etc.)
}

// Interface for the entire response
export interface XrayResponse {
  data: XrayItem[]; // Array of X-ray items
}
export interface XrayPreferencesByCategory {
  [category: string]: {
    name: string;
    price: string;
  }[];
}
export const xrayApiClient = new APIClient<XrayProps>("StoreParaclinique");
export const updateParacliniqueApiClient = new APIClient<any>(
  "updateParaclinique"
);
export const fetchBloodTestOperation = new APIClient<any>(
  "fetchOperationBloodTests"
);
export const getOrdonanceIdApiClient = new APIClient<any>("getOrdonanceId");
export const origonalxrayApiClient = new APIClient<XrayProps>("xray");
export const categoryXrayApiClient = new APIClient<any>("getxrayCategorys");
export const deleteCategoryApiClient = new APIClient<any>("deleteCategory");
export const PatientXrayApiClient = new APIClient<XrayData>("showpatientxrays");
export const insertOpwithoutxray = new APIClient<XrayData>("insertWihtoutxray");

export const DeleteradioApiClient = new APIClient<XrayData>("deleteRadio");
export const deletebloodtestApiClient = new APIClient<XrayData>(
  "deleteBloodTest"
);
export const deleteOrdonanceApiClient = new APIClient<XrayData>(
  "deleteOrdonance"
);

export const xraysWithCategoryApiClient =
  new APIClient<XrayPreferencesByCategory>("getXrayPreferencesWithCategories");
export const NurseXrayvalidationApiClient = new APIClient<XrayResponse>(
  "getXraysByOperation"
);
export const fetchxrayfirststep = new APIClient<any>("fetchXrays");
/* new apis  */

export const getnoteApiClient = new APIClient<any>("fetchNote");
export const editnoteApiclient = new APIClient<any>("EditOpNote");
