import api from '@/api/baseApi';
import { AutoProjectDetailsDto } from '../types/automation-project';

export interface SaveAutoProjectPayload {
  title: string;
  description: string;
  platform_id: number;
}

export const createAutoProject = async (
  payload: SaveAutoProjectPayload,
): Promise<AutoProjectDetailsDto> => {
  const response = await api.post<AutoProjectDetailsDto>(
    '/auto-project',
    payload,
  );
  return response.data;
};

export const updateAutoProject = async (
  projectId: number,
  payload: SaveAutoProjectPayload,
): Promise<AutoProjectDetailsDto> => {
  const response = await api.put<AutoProjectDetailsDto>(
    `/auto-project/${projectId}`,
    payload,
  );
  return response.data;
};

export const getProjectDetails = async (
  projectId: number,
): Promise<AutoProjectDetailsDto> => {
  const response = await api.get<AutoProjectDetailsDto>(
    `/auto-project/${projectId}`,
  );
  return response.data;
};
