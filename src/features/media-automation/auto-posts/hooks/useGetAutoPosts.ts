import { useQuery } from '@tanstack/react-query';
import { Order } from '../../projects/types/automation-project';
import { getAutoPosts } from '../api/auto-posts.api';
import { AutoPostStatus } from '../types';

interface UseGetAutoPostsOptions {
  projectId: number;
  status?: AutoPostStatus;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: Order;
}

export const useGetAutoPosts = (params: UseGetAutoPostsOptions) => {
  const { projectId, status, page = 1, limit = 10, orderBy, order } = params;
  return useQuery({
    queryKey: ['posts', 'list'],

    queryFn: () =>
      getAutoPosts({
        autoProjectId: projectId,
        status,
        page,
        limit,
        sortBy: orderBy,
        sortOrder: order,
      }),
    staleTime: 1000 * 60 * 5,
  });
};
