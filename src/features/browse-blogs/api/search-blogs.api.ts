import api from "@/api/baseApi";
import { PaginatedResponse } from "@/api/types/paginated-response.type";
import { Blog } from "@/types/blog";
import qs from "qs";

interface SearchBlogsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const searchBlogs = async (
  params: SearchBlogsParams,
): Promise<PaginatedResponse<Blog>> => {
  const queryString = qs.stringify(params, {
    addQueryPrefix: true,
    skipNulls: true,
  });
  const response = await api.get<Promise<PaginatedResponse<Blog>>>(
    `/blogs${queryString}`,
  );
  return response.data;
};
