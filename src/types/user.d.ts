export interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  is_onboard: boolean;
  followers_count: number;
  followings_count: number;
  full_name?: string | null;
  profile_picture_url?: string | null;
  bio?: string | null;
  created_at: Date;
  updated_at?: Date | null;
  refresh_token?: string | null;
  collections?: Collection[];
  blogs?: Blog[];
  bookmarks?: Bookmark[];
  comments?: Comment[];
  followers?: Follow[];
  followings?: Follow[];
  likes?: Like[];
  posts?: Post[];
  ratings?: Rating[];
  shares?: Share[];
  roles?: UserRole[];
}
