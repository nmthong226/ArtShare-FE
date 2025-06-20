import api from '@/api/baseApi';
import { Platform } from '../../projects/types/platform';

/**
 * @description Fetches the list of social platforms from the API.
 * @returns A promise that resolves to an array of Platform objects.
 */
export const fetchPlatforms = async (): Promise<Platform[]> => {
  const { data } = await api.get<Platform[]>('/platforms');
  return data;
};

/**
 * @description Sends a request to disconnect (delete) a platform by its ID.
 * @param platformId The ID of the platform to disconnect.
 * @returns The response from the API.
 */
export const disconnectPlatform = (platformId: number) => {
  return api.delete(`/platforms/${platformId}`);
};
