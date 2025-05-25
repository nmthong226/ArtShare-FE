import { useMutation } from "@tanstack/react-query";
import { CreateReportDto, ReportTargetType, submitReport } from "../api/report.api";

interface ReportVariables {
    targetId: number;
    targetType: ReportTargetType;
    reason: string;
}
  
export function useReport() {
  return useMutation({
    mutationFn: ({ targetId, reason, targetType }: ReportVariables) => {
      const url = window.location.href;
      const dto: CreateReportDto = {
        target_id: targetId,
        target_type: targetType,
        reason,
        target_url: url,
      };
      console.log('response', dto);
      return submitReport(dto);
    },
  });
}