// src/hooks/useReportUser.ts
import { useMutation } from "@tanstack/react-query";
import { CreateReportDto, ReportTargetType, submitReport } from "../api/report.api";

interface ReportUserVariables {
  targetId: number;
  reason: string;
  userId?: string;
}

export function useReportUser() {
  return useMutation({
    mutationFn: ({ targetId, reason, userId }: ReportUserVariables) => {
      const url = window.location.href;
      const dto: CreateReportDto = {
        target_id: targetId,
        user_id: userId,
        target_type: ReportTargetType.USER,
        reason,
        target_url: url,
      };
      console.log('response', dto);
      return submitReport(dto);
    },
  });
}


