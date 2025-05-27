// 2) hook for infinite-scroll / “load more” at the top
import { useEffect } from 'react';

export function useInfiniteTopScroll(
  ref: React.RefObject<HTMLElement>,
  canLoadMore: boolean,
  onLoadMore: () => void,
  threshold = 100
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !canLoadMore) return;

    const handler = () => {
      if (el.scrollTop < threshold) {
        console.log('Infinite top scroll triggered');
        onLoadMore();
      }
    };

    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, [ref, canLoadMore, onLoadMore, threshold]);
}
