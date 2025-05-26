import { useQuery } from '@tanstack/react-query';
import { getSubscriptionInfo, SubscriptionInfoDto } from '@/api/subscription/get-subscription-info.api';

export const useSubscriptionInfo = () => {
  return useQuery<SubscriptionInfoDto, Error>({
    queryKey: ['subscriptionInfo'],
    queryFn: getSubscriptionInfo,
    staleTime: 1000 * 60 * 5,  // 5 minutes
    retry: 1,
  });
};