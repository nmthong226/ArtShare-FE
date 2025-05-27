import { Button, CircularProgress, Typography } from "@mui/material";
import React, { ChangeEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { RiImageCircleAiFill } from "react-icons/ri";
import { MediaPreviewContainer } from "./media-preview-container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import api from "@/api/baseApi";
import { HistoryFilter } from "@/features/gen-art/enum";
import PromptResult from "@/features/gen-art/components/PromptResult";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { IoSparkles } from "react-icons/io5";

interface BrowseAiImagesProps {
  handleImageFilesChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const BrowseAiImages: React.FC<BrowseAiImagesProps> = () => {
  const PAGE_SIZE = 5;
  const [promptResultList, setPromptResultList] = useState<PromptResult[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loadedCount, setLoadedCount] = useState(PAGE_SIZE);
  const [displayedResults, setDisplayedResults] = useState<PromptResult[]>([]);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGetPromptHistory = async () => {
    try {
      const response = await api.get('/art-generation/prompt-history');
      setPromptResultList(response.data)
    } catch (e) {
      console.log(e);
    }
  }
  const [historyFilter, setHistoryFilter] = useState(HistoryFilter.TODAY);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        await handleGetPromptHistory();
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

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

  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLoadedCount(PAGE_SIZE);
    setInitialScrollDone(false);
  }, [historyFilter, promptResultList]);

  const filtered = useMemo(() => {
    return promptResultList.filter(result => isInFilterRange(result.created_at));
  }, [promptResultList, historyFilter]);

  const reversed = useMemo(() => filtered.slice().reverse(), [filtered]);

  useEffect(() => {
    const startIndex = Math.max(0, reversed.length - loadedCount);
    const slice = reversed.slice(startIndex);
    setDisplayedResults(slice);
  }, [reversed, loadedCount]);

  useLayoutEffect(() => {
    if (!initialScrollDone && scrollRef.current && displayedResults.length > 0) {
      const container = scrollRef.current;
      container.scrollTop = container.scrollHeight;
      setInitialScrollDone(true);
    }
  }, [displayedResults, initialScrollDone]);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || loadingMore) return;

    if (container.scrollTop < 100 && displayedResults.length < reversed.length) {
      const prevScrollHeight = container.scrollHeight;

      setLoadingMore(true);
      setLoadedCount(prev => prev + PAGE_SIZE);

      scrollTimeout.current = setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - prevScrollHeight + container.scrollTop;
        setLoadingMore(false);
      }, 50);
    }
  }, [loadingMore, displayedResults.length, reversed.length]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [handleScroll]);

  return (
    <MediaPreviewContainer>
      <Dialog>
        <DialogTrigger>
          <Button
            variant="text"
            component="label"
            size="small"
            className="flex flex-col justify-center items-center bg-white hover:bg-mountain-50 shadow-md p-4 border-1 border-mountain-200 w-40"
            sx={{
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "10px",
              textTransform: "none",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            <RiImageCircleAiFill className="mb-2 size-10 text-mountain-600" />
            <Typography variant="body1" className="text-sm">Browse My Stock</Typography>
          </Button>
        </DialogTrigger>
        <DialogContent hideCloseButton className="flex flex-col gap-0 mt-2 p-0 rounded-b-none outline-0 min-w-[90%] h-full">
          <DialogTitle hidden />
          <DialogDescription hidden />
          <div className="flex justify-between items-center shadow-md p-4 w-full min-h-24">
            <div className="flex flex-col">
              <p className="flex font-medium text-lg">Post With Your AI Images</p>
              <p className="flex text-mountain-600 text-sm">Browse your ai images and start sharing over the world</p>
            </div>
            <Link to="/image/tool/text-to-image" className="flex items-center bg-gradient-to-r from-blue-100 to-purple-100 shadow hover:brightness-105 px-4 py-2 rounded-full hover:scale-105 duration-300 ease-in-out hover:cursor-pointer transform">
              <IoSparkles className="mr-2 text-amber-300" />
              <p>Generate with ArtNova</p>
            </Link>
          </div>
          <div className='relative flex justify-between w-full h-full'>
            <div className="flex flex-col bg-mountain-50 m-4 border border-mountain-200 rounded-md w-[220px] h-full">
              <div className="flex justify-center items-center border-mountain-200 border-b-1 w-full h-12">
                <Clock className="mr-2 size-4" />
                <p>Prompt History</p>
              </div>
              <div className="flex flex-col justify-center">
                {Object.values(HistoryFilter).map((filter, index) => (
                  <div
                    key={index}
                    onClick={() => setHistoryFilter(filter)}
                    className={`flex p-2 px-4 cursor-pointer transition-colors duration-150
                      ${historyFilter === filter ? 'bg-mountain-100 text-mountain-700 font-medium' : 'hover:bg-mountain-100 text-mountain-600'}`}
                  >
                    <p className="capitalize">{filter.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={`flex relative h-full custom-scrollbar flex-col w-[80%] items-start transition-all duration-200 ease-in-out`}>
              {loading ? (
                <div className="flex justify-center items-start mt-4 w-full h-full">
                  <div className='flex items-center space-x-4'>
                    <CircularProgress size={32} thickness={4} />
                    <p className='text-sm'>Loading...</p>
                  </div>
                </div>
              ) : (
                <div ref={scrollRef} onScroll={handleScroll} className='flex flex-col space-y-10 pr-4 w-full h-full overflow-y-auto custom-scrollbar'>
                  <div className='flex justify-center items-center'>
                    <div className='flex justify-center items-center h-4'>
                    </div>
                  </div>
                  {displayedResults && displayedResults.length > 0 && (
                    displayedResults.map((result, index) => (
                      <PromptResult
                        key={index}
                        result={result}
                        useToShare={true}
                      />
                    ))
                  )}
                  <div className='flex flex-col space-y-2'>
                    <div className='flex h-64' />
                  </div>
                </div>
              )}
            </div>
            <div className='bottom-0 z-0 absolute flex bg-white blur-3xl w-full h-40' />
          </div>
          <DialogFooter>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MediaPreviewContainer>
  );
}
export default BrowseAiImages;