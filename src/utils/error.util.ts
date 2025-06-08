import { BackendErrorResponse } from "@/api/types/error-response.type";
import axios, { AxiosError } from "axios";

export const extractApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  return axios.isAxiosError(error)
    ? ((error as AxiosError<BackendErrorResponse>).response?.data?.message ??
        fallbackMessage)
    : error instanceof Error
      ? error.message
      : "An unexpected error occurred. Please try again.";
};
