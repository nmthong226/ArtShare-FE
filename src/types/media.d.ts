export interface Media {
  id: number;
  post_id: number;
  media_type: MediaType;
  description?: string;
  url: string;
  creator_id: string;
  downloads: number;
  created_at: Date;
}
