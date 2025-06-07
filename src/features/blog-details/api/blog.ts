import api from "@/api/baseApi";
import {
  Blog,
  mapSimpleBlogResponseToBlog,
  SimpleBlogResponseDto,
} from "@/types/blog";

/**
 * Fetch details for a single blog by ID.
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
  const response = await api.get<SimpleBlogResponseDto[]>("/blogs", { params });
  // Use the simpler mapping function that matches the actual response structure
  return response.data.map(mapSimpleBlogResponseToBlog);
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
  // Use SimpleBlogResponseDto since trending endpoint returns same structure as /blogs
  const response = await api.get<SimpleBlogResponseDto[]>("/blogs/trending", {
    params,
  });
  return response.data.map(mapSimpleBlogResponseToBlog);
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
  // Use SimpleBlogResponseDto since following endpoint likely returns same structure
  const response = await api.get<SimpleBlogResponseDto[]>("/blogs/following", {
    params,
  });
  return response.data.map(mapSimpleBlogResponseToBlog);
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
  // Use SimpleBlogResponseDto since search endpoint likely returns same structure
  const response = await api.get<SimpleBlogResponseDto[]>("/blogs/search", {
    params,
  });
  return response.data.map(mapSimpleBlogResponseToBlog);
};

// ... (toggleBookmark, protectBlog, rateBlog - these likely don't return Blog objects, so no mapping needed for them)
export const toggleBookmark = async (
  blogId: number,
): Promise<{ message: string; isBookmarked: boolean }> => {
  const response = await api.post<{ message: string; isBookmarked: boolean }>(
    `/blogs/${blogId}/bookmark`,
  );
  return response.data;
};

export const protectBlog = async (
  blogId: number,
): Promise<{ message: string; isProtected: boolean }> => {
  const response = await api.post<{ message: string; isProtected: boolean }>(
    `/blogs/${blogId}/protect`,
  );
  return response.data;
};

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
  // Only use BackendBlogListItemDto if this endpoint actually returns that structure
  const response = await api.get<SimpleBlogResponseDto[]>(
    `/blogs/user/${username}`,
    { params },
  );
  return response.data.map(mapSimpleBlogResponseToBlog);
};

/**
 * Fetch relevant blogs for a given blog.
 * GET /blogs/:blogId/relevant
 */
export const fetchRelevantBlogs = async (
  blogId: number,
  params?: { take?: number; skip?: number },
): Promise<Blog[]> => {
  // Only use BackendBlogListItemDto if this endpoint actually returns that structure
  const response = await api.get<SimpleBlogResponseDto[]>(
    `/blogs/${blogId}/relevant`,
    {
      params,
    },
  );
  return response.data.map(mapSimpleBlogResponseToBlog);
};

/**
 * Fetch users who liked a blog.
 * GET /blogs/:id/likes
 */
export const fetchBlogLikes = async (
  // This returns likers, not Blog objects
  blogId: number,
  params?: { skip?: number; take?: number },
): Promise<{
  items: {
    id: string;
    username: string;
    profile_picture_url?: string | null;
    full_name?: string | null;
  }[]; // Matched LikingUserResponseDto closer
  total: number;
}> => {
  // Make sure the DTO matches your backend exactly for this endpoint
  const response = await api.get<{
    items: {
      id: string;
      username: string;
      profile_picture_url?: string | null;
      full_name?: string | null;
    }[];
    total: number;
  }>(`/blogs/${blogId}/likes`, { params });
  return response.data;
};
