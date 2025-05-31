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

/**
 * Fetch a paginated list of published blogs.
 * GET /blogs
 */
export const fetchBlogs = async (params?: {
  take?: number;
  skip?: number;
  search?: string;
}): Promise<Blog[]> => {
  const response = await api.get<Blog[]>("/blogs", { params });
  console.log("!", response);
  return response.data;
};

/**
 * Fetch trending blogs, optionally filtered by categories.
 * GET /blogs/trending
 */
export const fetchTrendingBlogs = async (params?: {
  take?: number;
  skip?: number;
  categories?: string[];
}): Promise<Blog[]> => {
  const response = await api.get<Blog[]>("/blogs/trending", { params });
  return response.data;
};

/**
 * Fetch blogs from followed users.
 * GET /blogs/following
 */
export const fetchFollowingBlogs = async (params?: {
  take?: number;
  skip?: number;
  categories?: string[];
}): Promise<Blog[]> => {
  const response = await api.get<Blog[]>("/blogs/following", { params });
  return response.data;
};

/**
 * Search blogs by query.
 * GET /blogs/search
 */
export const searchBlogs = async (params: {
  take?: number;
  skip?: number;
  search?: string;
}): Promise<Blog[]> => {
  const response = await api.get<Blog[]>("/blogs/search", { params });
  return response.data;
};

/**
 * Toggle bookmark status for a blog.
 * POST /blogs/:id/bookmark
 */
export const toggleBookmark = async (
  blogId: number,
): Promise<{ message: string; isBookmarked: boolean }> => {
  const response = await api.post<{ message: string; isBookmarked: boolean }>(
    `/blogs/${blogId}/bookmark`,
  );
  return response.data;
};

/**
 * Protect a blog.
 * POST /blogs/:id/protect
 */
export const protectBlog = async (
  blogId: number,
): Promise<{ message: string; isProtected: boolean }> => {
  const response = await api.post<{ message: string; isProtected: boolean }>(
    `/blogs/${blogId}/protect`,
  );
  return response.data;
};

/**
 * Rate a blog.
 * POST /blogs/:id/rate
 */
export const rateBlog = async (
  blogId: number,
  rating: number,
): Promise<{ message: string; rating: number }> => {
  const response = await api.post<{ message: string; rating: number }>(
    `/blogs/${blogId}/rate`,
    { rating },
  );
  return response.data;
};

/**
 * Fetch blogs by username.
 * GET /blogs/user/:username
 */
export const fetchBlogsByUsername = async (
  username: string,
  params?: { take?: number; skip?: number },
): Promise<Blog[]> => {
  const response = await api.get<Blog[]>(`/blogs/user/${username}`, { params });
  return response.data;
};

/**
 * Fetch relevant blogs for a given blog.
 * GET /blogs/:blogId/relevant
 */
export const fetchRelevantBlogs = async (
  blogId: number,
  params?: { take?: number; skip?: number },
): Promise<Blog[]> => {
  const response = await api.get<Blog[]>(`/blogs/${blogId}/relevant`, {
    params,
  });
  return response.data;
};

/**
 * Fetch users who liked a blog.
 * GET /blogs/:id/likes
 */
export const fetchBlogLikes = async (
  blogId: number,
  params?: { skip?: number; take?: number },
): Promise<{
  items: { id: number; username: string; avatar?: string }[];
  total: number;
}> => {
  const response = await api.get<{
    items: { id: number; username: string; avatar?: string }[];
    total: number;
  }>(`/blogs/${blogId}/likes`, { params });
  return response.data;
};
