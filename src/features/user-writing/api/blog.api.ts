import api from "@/api/baseApi";
import { Blog } from "@/types/blog";

export interface CreateBlogPayload {
  title: string;
  content: string;
  is_published?: boolean;
}

/**
 * Creates a new blog post.
 * @param blogData The data for the new blog.
 * @returns The created blog post.
 */
export const createNewBlog = async (
  blogData: CreateBlogPayload,
): Promise<Blog> => {
  try {
    const response = await api.post<Blog>("/blogs", blogData);
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    // You might want to throw a more specific error or handle it based on your app's needs
    throw error;
  }
};

/**
 * Fetches all blog posts.
 * You might want to add parameters for pagination, filtering, sorting, etc.
 * @returns A list of blog posts.
 */
export const getAllBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await api.get<Blog[]>("/blogs");
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

/**
 * Fetches a single blog post by its ID.
 * @param blogId The ID of the blog to fetch.
 * @returns The blog post.
 */
export const getBlogById = async (blogId: string | number): Promise<Blog> => {
  try {
    const response = await api.get<Blog>(`/blogs/${blogId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog with ID ${blogId}:`, error);
    throw error;
  }
};

export interface UpdateBlogPayload {
  title?: string;
  content?: string;
  is_published?: boolean;
  slug?: string;
  cover_image_url?: string;
  pictures?: string[];
}

/**
 * Updates an existing blog post.
 * @param blogId The ID of the blog to update.
 * @param blogData The data to update the blog with.
 * @returns The updated blog post.
 */
export const updateExistingBlog = async (
  blogId: string | number,
  blogData: UpdateBlogPayload,
): Promise<Blog> => {
  try {
    const response = await api.patch<Blog>(`/blogs/${blogId}`, blogData);
    return response.data;
  } catch (error) {
    console.error(`Error updating blog with ID ${blogId}:`, error);
    // You might want to throw a more specific error or handle it based on your app's needs
    throw error;
  }
};
