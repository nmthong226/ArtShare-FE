export type AutoPostStatus = 'draft' | 'scheduled' | 'posted' | 'canceled';

export type AutoPost = {
  id: number;
  content: string;
  imageUrl?: string[];
  status: AutoPostStatus;
  createdAt: Date;
  scheduledTime?: Date;
};
