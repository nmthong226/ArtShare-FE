import { Category, RawCategory } from "./category";
import { Media } from "./media";
import { User } from "./user";

export interface Post {
  id: number;
  title?: string;
  description?: string;
  is_published: boolean;
  is_private: boolean;
  like_count: number;
  share_count: number;
  comment_count: number;
  created_at: Date;
  thumbnail_url?: string;

  medias: Media[];
  user: User;
  categories?: Category[];
}
