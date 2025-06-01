import { Category } from "./category";
import { MediaDto } from "./media";
import { User } from "./user";

export interface Post {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  created_at: Date;
  updated_at?: Date;
  is_published: boolean;
  is_private: boolean;
  group_id?: number;
  share_count: number;
  comment_count: number;
  like_count: number;
  view_count: number;
  thumbnail_url: string;
  is_mature: boolean;
  ai_created: boolean;

  medias: MediaDto[];
  user: User;
  categories?: Category[];
  thumbnail_crop_meta: ThumbnailMeta;
}
