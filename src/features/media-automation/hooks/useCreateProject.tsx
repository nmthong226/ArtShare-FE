import { useLoading } from '@/contexts/Loading/useLoading';
import { useSnackbar } from '@/hooks/useSnackbar';
import { extractApiErrorMessage } from '@/utils/error.util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAutoProject,
  CreateAutoProjectPayload,
} from '../api/create-project.api';
import { ProjectFormValues } from '../types';
import { AutoProjectDetailsDto } from '../types/automation-project';

interface UseCreateProjectOptions {
  onSuccess?: (data: AutoProjectDetailsDto) => void;
  onError?: (errorMessage: string) => void;
}

export const useCreateProject = ({
  onSuccess,
  onError,
}: UseCreateProjectOptions) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: (values: ProjectFormValues) => {
      const payload: CreateAutoProjectPayload = {
        title: values.projectName,
        description: values.description,
        platform_id: values.platform.id,
      };

      return createAutoProject(payload);
    },

    onMutate: () => {
      showLoading('Creating project...');
    },

    onSettled: () => {
      hideLoading();
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projectDetails'] });
      showSnackbar('Project created successfully!', 'success');
      onSuccess?.(data);
    },

    onError: (error) => {
      const message = extractApiErrorMessage(
        error,
        'Failed to create project.',
      );
      showSnackbar(message, 'error');
      onError?.(message);
    },
  });
};
