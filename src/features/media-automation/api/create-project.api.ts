import api from '@/api/baseApi';
import { AutoProjectDetailsDto } from '../types/automation-project';

export interface CreateAutoProjectPayload {
  title: string;
  description: string;
  platform_id: number;
}

export const createAutoProject = async (
  payload: CreateAutoProjectPayload,
): Promise<AutoProjectDetailsDto> => {
  const response = await api.post<AutoProjectDetailsDto>(
    '/auto-project',
    payload,
  );
  return response.data;
};
