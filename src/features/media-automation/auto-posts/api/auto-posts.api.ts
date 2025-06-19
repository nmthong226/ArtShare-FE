import api from '@/api/baseApi';
import { getQueryParams } from '@/utils';
import { Order } from '../../projects/types/automation-project';
import { AutoPost, AutoPostStatus } from '../types';

export interface GetAutoPostsParams {
  autoProjectId?: number;
  status?: AutoPostStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: Order;
}

export const getAutoPosts = async (
  params: GetAutoPostsParams,
): Promise<AutoPost[]> => {
  const response = await api.get<AutoPost[]>(
    `/auto-post${getQueryParams(params)}`,
  );
  return response.data;
};
