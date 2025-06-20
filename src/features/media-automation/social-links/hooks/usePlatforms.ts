import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Platform } from '../../projects/types/platform';
import { fetchPlatforms } from '../api/platforms.api';

/**
 * @description Custom hook to fetch social platforms using TanStack Query.
 * Encapsulates the useQuery logic for fetching platform data.
 * @returns The result of the useQuery hook, including data, isLoading, and error states.
 */
export const usePlatforms = () => {
  return useQuery<Platform[], AxiosError>({
    queryKey: ['platforms'],
    queryFn: fetchPlatforms,
    staleTime: 1000 * 60 * 5,
  });
};
