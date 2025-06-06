import { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react";
import api from "@/api/baseApi";
import { HistoryFilter } from "@/features/gen-art/enum";
import { useInfiniteTopScroll } from "./useInfiniteTopScroll";

const PAGE_SIZE = 5;

export const usePromptHistory = () => {
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>(
    HistoryFilter.TODAY,
  );
  const [promptResultList, setPromptResultList] = useState<PromptResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(PAGE_SIZE);
  const [displayedResults, setDisplayedResults] = useState<PromptResult[]>([]);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isInFilterRange = (createdAt: string): boolean => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    switch (historyFilter) {
      case HistoryFilter.TODAY:
        return createdDate.toDateString() === now.toDateString();
      case HistoryFilter.YESTERDAY: {
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        return createdDate.toDateString() === yesterday.toDateString();
      }
      case HistoryFilter.LAST7DAYS: {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 6);
        return createdDate >= sevenDaysAgo && createdDate <= now;
      }
      case HistoryFilter.LAST30DAYS: {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 29);
        return createdDate >= thirtyDaysAgo && createdDate <= now;
      }
      default:
        return true;
    }
  };

  // Fetch history on mount
  useEffect(() => {
    api
      .get("/art-generation/prompt-history")
      .then((res) => setPromptResultList(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Reset pagination when filter or data changes
  useEffect(() => {
    setLoadedCount(PAGE_SIZE);
    setInitialScrollDone(false);
  }, [historyFilter, promptResultList]);

  // Filter and reverse
  const filtered = useMemo(
    () => promptResultList.filter((r) => isInFilterRange(r.created_at)),
    [promptResultList, historyFilter],
  );
  const reversed = useMemo(() => filtered.slice().reverse(), [filtered]);

  // Compute slice
  useEffect(() => {
    const start = Math.max(0, reversed.length - loadedCount);
    setDisplayedResults(reversed.slice(start));
  }, [reversed, loadedCount]);

  // Scroll to bottom once
  useLayoutEffect(() => {
    if (!initialScrollDone && scrollRef.current && displayedResults.length) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setInitialScrollDone(true);
    }
  }, [displayedResults, initialScrollDone]);

  // Infinite scroll trigger
  useInfiniteTopScroll(
    scrollRef,
    displayedResults.length < reversed.length,
    () => setLoadedCount((c) => c + PAGE_SIZE),
    displayedResults.length,
  );

  return {
    scrollRef,
    displayedResults,
    setDisplayedResults,
    loading,
    historyFilter,
    setHistoryFilter,
  };
};
