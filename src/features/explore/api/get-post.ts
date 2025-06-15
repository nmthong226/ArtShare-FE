import { Post } from "@/types";
import api from "@/api/baseApi";
import qs from "qs";

export interface UnsplashPhoto {
  id: string;
  urls: { regular: string };
  user: { name: string; username: string };
  current_user_collections: { title: string };
  links: { html: string };
  description?: string;
  alt_description?: string;
}

export const fetchPosts = async (
  page: number,
  tab?: string,
  query?: string,
  filter?: string[],
  pageSize: number = 24,
): Promise<Post[]> => {
  try {
    if (query) {
      const searchParams = {
        q: query,
        page: page,
        page_size: pageSize,
        filter: filter,
      };
      console.log("Search params:", searchParams);

      const queryString = qs.stringify(searchParams, {
        addQueryPrefix: true, // Adds the leading '?'
        skipNulls: true, // Omits keys with null or undefined values
        arrayFormat: "comma", // This is the magic! Handles your .join(',') for you.
      });

      console.log("Fetching posts with query:", queryString);
      const response = await api.get<Post[]>(`/posts/search${queryString}`);
      return response.data;
    } else {
      const response = await api.post<Post[]>(`/posts/${tab}`, {
        page,
        page_size: pageSize,
        filter,
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const fetchPostsByArtist = async (
  artistUsername: string,
  page: number,
  pageSize: number = 9,
): Promise<Post[]> => {
  try {
    const response = await api.get<Post[]>(
      `/posts/user/${artistUsername}?page=${page}&page_size=${pageSize}`,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch artist posts:", error);
    return [];
  }
};
