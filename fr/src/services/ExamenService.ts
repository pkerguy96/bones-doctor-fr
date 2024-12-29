import { APIClient } from "./Http";

export interface ExamenPreferencesByCategory {
  [category: string]: {
    name: string;
    price: string;
  }[];
}
export const xraysWithCategoryApiClient =
  new APIClient<ExamenPreferencesByCategory>(
    "getXrayPreferencesWithCategories"
  );

export const categoryExamenApiClient = new APIClient<any>("getexamenCategorys");
export const deleteExamenCategoryApiClient = new APIClient<any>(
  "deleteExamenCategory"
);
export const ExamenPreferenceApiClient = new APIClient<any>("examen");
export const ExamenPreferencewithCategoriesApiClient = new APIClient<any>(
  "getExamenPreferencesWithCategories"
);
