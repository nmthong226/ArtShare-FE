import api from '@/api/baseApi';
import { PaginatedResponse } from '@/api/types/paginated-response.type';
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
): Promise<PaginatedResponse<AutoPost>> => {
  const response = await api.get(`/auto-post${getQueryParams(params)}`);
  return response.data;
};
