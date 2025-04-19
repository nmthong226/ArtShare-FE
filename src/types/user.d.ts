export interface User {
  id: string;
  name?: string;
  email: string;
  username: string;
  password_hash?: string;
  full_name?: string;
  profile_picture_url?: string;
  bio?: string;
  created_at?: Date;
  updated_at?: Date;
  refresh_token?: string;

  //   posts: Post[];

  //   likes: Like[];
  //   comments: Comment[];
  //   shares: Share[];

  //   followers: Follow[];
  //   followings: Follow[];
}
