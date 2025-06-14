import api from "@/api/baseApi";
import qs from "qs";
import type { Category } from "@/types/category"; // This will now use the updated Category type

export interface GetCategoriesParams {
  page?: number;
  pageSize?: number;
}

export const getCategories = async ({
  page = 1,
  pageSize = 25,
}: GetCategoriesParams): Promise<Category[]> => {
  try {
    const queryParams = {
      page,
      page_size: pageSize,
    };

    const queryString =
      Object.keys(queryParams).length > 0
        ? qs.stringify(queryParams, {
          addQueryPrefix: true,
          arrayFormat: "brackets",
        })
        : "";

    const response = await api.get<Category[]>(`/categories${queryString}`);

    // Parse dates from string to Date objects
    return response.data.map((cat) => ({
      ...cat,
      // Ensure these properties exist on 'cat' after the GET request.
      // 'cat' here is an element of response.data, which is typed as Category.
      // If your backend sends dates as strings (common in JSON), this parsing is good.
      created_at: new Date(cat.created_at as string), // Cast as string if sure API sends string
      updated_at: cat.updated_at ? new Date(cat.updated_at as string) : null, // Cast as string
    }));
  } catch (error) {
    console.error("Error in getCategories API call:", error);
    throw error;
  }
};
