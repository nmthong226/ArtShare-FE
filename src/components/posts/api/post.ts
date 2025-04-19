import api from "@/api/baseApi";
import { MEDIA_TYPE } from "@/constants";
import { Category, Post, User, Media } from "@/types";

const mediaData: Media[] = [
  {
    media_type: MEDIA_TYPE.IMAGE,
    description: "Poster illustration",
    url: "https://images.unsplash.com/photo-1742275346989-2d696fa2c9b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjU0NTh8MHwxfGFsbHw0OXx8fHx8fHx8MTc0MjYzNjg1MHw&ixlib=rb-4.0.3&q=80&w=1080",
    creator_id: "1",
    downloads: 100,
    created_at: new Date(),
    id: 1,
    post_id: 1,
  },
  {
    media_type: MEDIA_TYPE.IMAGE,
    description: "Poster illustration",
    url: "https://images.unsplash.com/photo-1742414348816-fe5f76446808?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjU0NTh8MHwxfGFsbHwxM3x8fHx8fHx8MTc0MjYxMTQ2MHw&ixlib=rb-4.0.3&q=80&w=1080",
    creator_id: "1",
    downloads: 100,
    created_at: new Date(),
    id: 2,
    post_id: 1,
  },
  {
    media_type: MEDIA_TYPE.IMAGE,
    description: "Poster illustration",
    url: "https://images.unsplash.com/photo-1742470523391-891944f4155f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjU0NTh8MHwxfGFsbHwxNHx8fHx8fHx8MTc0MjYxMTQ2MHw&ixlib=rb-4.0.3&q=80&w=1080",
    creator_id: "1",
    downloads: 100,
    created_at: new Date(),
    id: 3,
    post_id: 1,
  },
];

const userData: User = {
  id: "1",
  username: "michael_guimont",
  full_name: "Michael Guimont",
  profile_picture_url: "example.com/profile.jpg",
  email: "michael@gmail.com",
};

const categoryData: Category[] = [
  {
    id: 1,
    name: "Illustration",
    url: "example.com/category/art",
    createdAt: new Date(),
  },
];

const postData: Post = {
  id: 1,
  title: "Caro & Max's train robbers family",
  description:
    "Here is a poster illustration I did for a couple, friends of mine! They're celebrating their 20 years of being in a relationship together and asked me if I could make them something special for the occasion. Since the husband is working as a train conductor, I thought it would be appropriate to have their family as train robbers :p Hope you like",
  is_published: true,
  is_private: false,
  like_count: 53,
  share_count: 12,
  comment_count: 2,
  created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  medias: mediaData,
  user: userData,
  categories: categoryData,
};

export const fetchPost = async (postId: number) => {
  return await api.get<Post>(`/posts/${postId}`);
  // return { data: postData };
};

export const fetchPosts = async (
  artistUsername: string,
  page: number,
  pageSize: number = 9,
) => {
  console.log(
    "Fetching posts for artist:",
    artistUsername,
    "Page:",
    page,
    "Page Size:",
    pageSize,
  );
  // return await api.get<Post[]>(`?username${artistUsername}?page=${page}?pageSize=${pageSize}`);
  return {
    data: Array.from({ length: 9 }).map(() => postData),
  };
};
