// src/hooks/useIsMature.ts
import { useState } from 'react';
import { PostMedia } from '../types/post-media';
import { detectAdultImages, DetectAdultImagesResponse } from '@/api/detect-adult-images.api';

interface UseIsMatureReturn {
  checkMaturityForNewItems: (newMediaItems: PostMedia[]) => Promise<PostMedia[]>;
  isLoading: boolean;
  error: string | null;
}

export default function useIsMature(): UseIsMatureReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkMaturityForNewItems = async (newMediaItems: PostMedia[]) => {
    if (!newMediaItems || newMediaItems.length === 0) {
      return [];
    }

    setIsLoading(true);
    setError(null);

    const imageMediasToProcess: PostMedia[] = [...newMediaItems];

    if (imageMediasToProcess.length === 0) {
      setIsLoading(false);
      return newMediaItems;
    }

    const filesToDetect: File[] = imageMediasToProcess.map(media => media.file!);
    let processedImageMedias: PostMedia[] = [...imageMediasToProcess];

    try {
      const detectionResults: DetectAdultImagesResponse[] = await detectAdultImages(filesToDetect);

      processedImageMedias = imageMediasToProcess.map((mediaItem, index) => ({
        ...mediaItem,
        isMature: detectionResults[index].isAdult,
      }));
    } catch (err) {
      console.error("Error in detectAdultImages:", err);
      setError(err instanceof Error ? err.message : "Failed to detect image maturity.");
    } finally {
      setIsLoading(false);
    }
    return processedImageMedias;
  };

  return {
    checkMaturityForNewItems,
    isLoading,
    error,
  };
}