import { useQuery } from "@tanstack/react-query";
import {
  getSubscriptionInfo,
  SubscriptionInfoDto,
  SubscriptionPlan,
} from "@/api/subscription/get-subscription-info.api";

export const useSubscriptionInfo = () => {
  return useQuery<SubscriptionInfoDto, Error>({
    queryKey: ["subscriptionInfo"],
    queryFn: getSubscriptionInfo,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const getDisplayPlanName = (plan: SubscriptionPlan): string => {
  switch (plan) {
    case SubscriptionPlan.FREE:
      return "Free";
    case SubscriptionPlan.ARTIST_PRO:
      return "Artist Pro";
    case SubscriptionPlan.ENTERPRISE:
      return "Enterprise";
    default:
      return "Unknown Plan";
  }
};
