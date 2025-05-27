import api from "@/api/baseApi";
import { Blog } from "@/types/blog";

/**
 * Fetch details for a single blog by ID.
 * GET /blogs/:id
 */
export const fetchBlogDetails = async (blogId: number): Promise<Blog> => {
    const response = await api.get<Blog>(`/blogs/${blogId}`);
    return response.data;
};