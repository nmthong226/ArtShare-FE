import { getCategories, GetCategoriesParams } from "@/api/category";
import { Category } from "@/types/category";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function useCategories({
  page = 1,
  pageSize = 25,
}: GetCategoriesParams): UseQueryResult<Category[]> {
  return useQuery<Category[]>({
    queryKey: ["categories", page, pageSize],
    queryFn: async () => {
      console.log(`⏳ Fetching categories (page=${page}) from network`);
      return getCategories({ page, pageSize });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
