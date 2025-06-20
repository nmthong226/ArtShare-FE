import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Platform } from '../../projects/types/platform';
import { disconnectPlatform } from '../api/platforms.api';

/**
 * @description Custom hook for disconnecting a social platform.
 * Encapsulates the useMutation logic and handles query invalidation on success.
 * @returns The result of the useMutation hook.
 */
export const useDisconnectPlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectPlatform,

    onMutate: async (platformIdToDelete) => {
      await queryClient.cancelQueries({ queryKey: ['platforms'] });

      const previousPlatforms = queryClient.getQueryData<Platform[]>([
        'platforms',
      ]);

      if (previousPlatforms) {
        queryClient.setQueryData<Platform[]>(['platforms'], (old) =>
          old ? old.filter((p) => p.id !== platformIdToDelete) : [],
        );
      }

      return { previousPlatforms };
    },

    onError: (err, _variables, context) => {
      console.error('Optimistic update failed, rolling back:', err);
      if (context?.previousPlatforms) {
        queryClient.setQueryData<Platform[]>(
          ['platforms'],
          context.previousPlatforms,
        );
      }
      alert('Failed to disconnect account. The connection has been restored.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
    },
  });
};
