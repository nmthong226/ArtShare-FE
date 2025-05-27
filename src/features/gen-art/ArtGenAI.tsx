//Core
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

//Components
import { Button, CircularProgress, TextareaAutosize } from '@mui/material';
import PromptResult from './components/PromptResult';
import TokenPopover from './components/TokenPopover';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';
import AIBot from './components/AI/AIBot';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import PurchaseButton from './components/PurchaseButton';

//Icons
import { IoMdArrowDropdown } from "react-icons/io";
import { BiInfoCircle } from 'react-icons/bi';

//Css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//Mock/Enum
import { aspectOptions, cameraOptions, HistoryFilter, lightingOptions, ModelKey } from './enum';
import { MockModelOptionsData } from './mock/Data';

//API Backend
import api from '@/api/baseApi';
import { useQueryClient } from '@tanstack/react-query';
import { generateImages } from './api/generate-imges.api';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import { useSubscriptionInfo } from '@/hooks/useSubscription';
import axios, { AxiosError } from 'axios';
import { BackendErrorResponse } from '@/api/types/error-response.type';

{/*
A stunning realistic scene featuring a woman astronaut curiously peeking out of 
her dormitory window aboard a futuristic space station, overlooking the breathtaking 
view of Earth below. The setting showcases a vibrant blue planet adorned with swirling 
clouds and continents. Surrounding the space station are sleek construction drones actively 
working, along with various spacecraft gliding gracefully through the cosmos. 
The artwork is richly detailed and realistic, inspired by the visionary style of Syd Mead, 
capturing the intricate design of the space station and the dynamic activity in orbit, 
with stars twinkling in the background creating a sense of vastness in space.
*/}

const PAGE_SIZE = 5;

const getPromptResult = (userPrompt: string, numberOfImages: number, imageUrls: string[]): PromptResult => {
    return {
        id: -1, // Placeholder ID, replace with actual ID if needed
        user_prompt: userPrompt,
        final_prompt: '', // Placeholder, replace with actual final prompt if needed
        aspect_ratio: '',
        created_at: new Date().toISOString(),
        camera: '',
        lighting: '',
        model_key: ModelKey.GPT_IMAGE_1,
        number_of_images_generated: numberOfImages,
        style: '',
        user_id: '', // Placeholder, replace with actual user ID if needed
        image_urls: imageUrls,
    };
}

const ArtGenAI = () => {
    const [promptResultList, setPromptResultList] = useState<PromptResult[]>([]);
    const [expanded, setExpanded] = useState<boolean>(true);
    const [promptExpanded, setPromptExpanded] = useState<boolean>(false);
    const [userPrompt, setUserPrompt] = useState('');

    const [generatingImage, setGeneratingImage] = useState<boolean>(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [loading, setLoading] = useState(true);
    const [historyFilter, setHistoryFilter] = useState(HistoryFilter.TODAY)
    const scrollRef = useRef<HTMLDivElement>(null);
    const [loadedCount, setLoadedCount] = useState(PAGE_SIZE);
    const [displayedResults, setDisplayedResults] = useState<PromptResult[]>([]);
    const [initialScrollDone, setInitialScrollDone] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    //Setting Panel
    const [modelKey] = useState<ModelKey>(ModelKey.GPT_IMAGE_1);
    const [style, setStyle] = useState<StyleOption>(MockModelOptionsData[0]);
    const [aspectRatio, setAspectRatio] = useState<AspectOption>(aspectOptions[0]);
    const [lighting, setLighting] = useState<LightingOption>(lightingOptions[0]);
    const [camera, setCamera] = useState<CameraOption>(cameraOptions[0]);
    const [numberOfImages, setNumberOfImages] = useState<number>(1);

    const queryClient = useQueryClient();

    const { data: subscriptionInfo } = useSubscriptionInfo();
    const { showSnackbar } = useSnackbar();


    const handleGetPromptHistory = async () => {
        try {
            const response = await api.get('/art-generation/prompt-history')
            setPromptResultList(response.data);
        } catch (e) {
            console.log(e);
        }
    }

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

            // Restore scroll position after more items are added
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

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const handleGenerate = async () => {
        if (!userPrompt.trim() || generatingImage) return;

        if (subscriptionInfo?.aiCreditRemaining === 0) {
            showSnackbar("You run out of AI credits, please upgrade your plan to continue or comeback together.", "warning");
            return;
        }

        setGeneratingImage(true);

        setTimeout(() => {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }, 100);

        const payload = {
            prompt: userPrompt,
            modelKey: modelKey,
            style: style.name.toLowerCase(),
            n: numberOfImages,
            aspectRatio: aspectRatio.value,
            lighting: lighting.value,
            camera: camera.value
        };
        try {
            const { prompt, urls } = await generateImages(payload);

            // append this prompt result to the displayed results
            setDisplayedResults(prev => {
                const newPromptResult = getPromptResult(
                    prompt,
                    numberOfImages,
                    urls
                );
                const updated = [...prev, newPromptResult];
                // Ensure we don't exceed the page size
                console.log('Updated Displayed Results:', updated);

                if (updated.length > PAGE_SIZE) {
                    return updated.slice(-PAGE_SIZE);
                }
                return updated;
            });

            setUserPrompt('');

            setTimeout(() => {
                scrollRef.current?.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            }, 100);

        } catch (e) {
            let msg = 'Failed to generate image';

            if (axios.isAxiosError(e)) {
                const axiosErr = e as AxiosError<BackendErrorResponse>;
                msg = axiosErr.response?.data?.message ?? 'Failed to generate image';
            }
            else if (e instanceof Error) {
                msg = e.message;
            }

            showSnackbar(msg, "error");
            console.error('Image generation failed:', e);
        } finally {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setGeneratingImage(false);
            queryClient.invalidateQueries({ queryKey: ['subscriptionInfo'] })
        }
    };

    const handlePrompt = () => {
        setPromptExpanded(true);
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 0); // ensures it's after expansion
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                textareaRef.current &&
                !textareaRef.current.contains(event.target as Node)
            ) {
                setPromptExpanded(false);
            }
        };
        if (promptExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [promptExpanded]);

    // const handleDeleteSingleResult = (resultId: string, imageId: string) => {
    //     setPromptResults((prev) => {
    //         const updated = prev.map((result) =>
    //             result.id === resultId
    //                 ? {
    //                     ...result,
    //                     images: result.images.filter((img: { id: string; }) => img.id !== imageId),
    //                 }
    //                 : result
    //         );
    //         return updated.filter((result) => result.images.length > 0);
    //     });
    // };

    return (
        <div className='flex p-4 pr-0 pb-0 w-full h-[calc(100vh-4rem)]'>
            <div className='relative flex flex-col space-y-4 w-full h-full overflow-y-hidden'>
                <SettingsPanel
                    isExpanded={expanded}
                    setIsExpanded={setExpanded}
                    numberOfImages={numberOfImages}
                    setNumberOfImages={setNumberOfImages}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    lighting={lighting}
                    setLighting={setLighting}
                    camera={camera}
                    setCamera={setCamera}
                    style={style}
                    setStyle={setStyle}
                />
                <div className='flex justify-end pr-4 w-full h-fit'>
                    <div className='flex items-center space-x-2 bg-white shadow-md p-2 rounded-xl w-102 h-13'>
                        <div className='flex w-full h-full'>
                            <div className='flex justify-start items-center bg-mountain-100 hover:bg-mountain-200/80 px-2 rounded-lg w-full h-full font-normal'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="justify-start outline-none w-full hover:cursor-pointer">
                                        <div className="flex items-center space-x-2">
                                            <p>
                                                Show <span className="font-medium">{historyFilter.label}</span>
                                            </p>
                                            <IoMdArrowDropdown />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="flex flex-col mt-4 border-mountain-200 min-w-48 select-none">
                                        {Object.values(HistoryFilter).map((filter, index) => (
                                            <div
                                                key={index}
                                                onClick={() => setHistoryFilter(filter)}
                                                className={`${loading && 'pointer-events-none'} flex p-1.5 hover:bg-mountain-100 hover:cursor-pointer ${historyFilter.value == filter.value ? "bg-indigo-50 font-medium text-mountain-800" : ""
                                                    }`}
                                            >
                                                {filter.label}
                                            </div>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <TokenPopover />
                        <PurchaseButton />
                    </div>
                </div>
                <div className='relative flex justify-end w-full h-full'>
                    <div className={`flex relative h-full custom-scrollbar flex-col ${expanded ? 'w-[78%]' : 'w-full delay-300'} items-start transition-all duration-200 ease-in-out`}>
                        {loading ? (
                            <div className="flex justify-center items-start mt-4 w-full h-full">
                                <div className='flex items-center space-x-4'>
                                    <CircularProgress size={32} thickness={4} />
                                    <p className='text-sm'>Loading...</p>
                                </div>
                            </div>
                        ) : (
                            <div ref={scrollRef} onScroll={handleScroll} className='flex flex-col space-y-10 pr-4 w-full h-full overflow-y-auto custom-scrollbar'>
                                {(displayedResults && displayedResults.length > 0)
                                    ? displayedResults.map((result, index) => (
                                        <PromptResult
                                            key={index}
                                            result={result}
                                        />
                                    )) : (
                                        <div className='flex justify-center items-center h-full text-mountain-600'>
                                            <BiInfoCircle className='mr-2 size-5' />
                                            <p className=''>There is no prompt result. What's on your mind?</p>
                                        </div>
                                    )}
                                {generatingImage &&
                                    <PromptResult
                                        generating={true}
                                        tempPrompt={userPrompt}
                                        tempImageCount={numberOfImages}
                                    />
                                }
                                <div className='flex flex-col space-y-2'>
                                    <div className='flex h-64' />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='bottom-0 z-0 absolute flex bg-white blur-3xl w-full h-40' />
                </div>
                {/* Prompt Chat */}
                <div className={`flex bottom-4 items-end left-1/2 z-50 absolute transform duration-300 ease-in-out ${expanded ? '-translate-x-1/4' : '-translate-x-1/2  delay-300'}`}>
                    <div className={`flex flex-col bg-white border ${promptExpanded ? 'border-indigo-600 shadow-lg' : 'border-mountain-300 shadow-md'} rounded-xl w-[720px] relative`}>
                        <div
                            className={`flex bg-white rounded-xl w-[719px] border-0 rounded-b-none overflow-hidden transition-all duration-400 ease-in-out transform
                            ${promptExpanded ? 'h-24 scale-y-100 opacity-100 py-2' : 'h-0 opacity-0'} 
                            overflow-y-auto`}
                        >
                            <TextareaAutosize
                                value={userPrompt}
                                ref={textareaRef}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                placeholder="What do you imagine about?"
                                className={`flex p-2 resize-none bg-white custom-scrollbar rounded-xl w-full text-sm rounded-b-none h-full overflow-y-auto placeholder:text-mountain-400 outline-none focus:outline-none focus:ring-0 focus:border-transparent`}
                            />
                        </div>
                        <div
                            onClick={() => handlePrompt()}
                            className={`${promptExpanded && 'rounded-t-none pointer-events-none'
                                } items-center text-sm flex bg-white px-2 py-4 rounded-xl w-[719px] h-15 line-clamp-1 hover:cursor-pointer overflow-y-auto`}
                        >
                            {userPrompt ? (
                                <p className={`pr-26 line-clamp-1 ${promptExpanded && 'hidden'}`}>{userPrompt}</p>
                            ) : (
                                <p className={`pr-26 text-mountain-400 ${promptExpanded && 'hidden'}`}>What do you imagine about?</p>
                            )}
                        </div>
                        <Button
                            onClick={handleGenerate}
                            className='right-4 -bottom-2 absolute flex items-center bg-indigo-100 px-4 -translate-y-1/2'>
                            Generate
                        </Button>
                    </div>
                    <AIBot />
                </div>
            </div>
        </div>
    )
}

export default ArtGenAI