// Complete minimal implementation with toast notifications

// components/SuggestPrompt.tsx
import { RiRobot2Line } from 'react-icons/ri';
import { Button, TextareaAutosize, CircularProgress } from '@mui/material';
import { ArrowUp, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useChat } from '../../hook/useChat';
import { useSnackbar } from '@/hooks/useSnackbar';

const SuggestPrompt = () => {
    const [promptExpanded, setPromptExpanded] = useState<boolean>(false);
    const [userPrompt, setUserPrompt] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const {
        messages,
        isLoading,
        sendMessage,
        clearChat,
    } = useChat();

    const { showSnackbar }= useSnackbar();

    const examplePrompts = [
        "A lonely astronaut on Mars",
        "Cyberpunk samurai walking in the rain", 
        "Sunset over a pixel-art mountain"
    ];

    const handleGenerate = async () => {
        if (!userPrompt.trim() || isLoading) return;
        
        try {
            await sendMessage(userPrompt);
            setUserPrompt('');
            setPromptExpanded(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            showSnackbar("Failed to send message", "error")
        }
    };

    const handleExampleClick = (prompt: string) => {
        setUserPrompt(prompt);
        setPromptExpanded(true);
        setTimeout(() => textareaRef.current?.focus(), 0);
    };

    const handlePromptClick = async (prompt: string) => {
        try {
            await navigator.clipboard.writeText(prompt);
            showSnackbar('Prompt copied to clipboard!', 'success')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            showSnackbar('Failed to copy prompt', 'error');
        }
    };

    // Auto-scroll on new messages
    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (textareaRef.current && 
                !textareaRef.current.contains(event.target as Node) &&
                !userPrompt.trim()) {
                setPromptExpanded(false);
            }
        };

        if (promptExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [promptExpanded, userPrompt]);

    return (
        <div className='flex justify-center w-full h-full'>
            <div className='relative flex flex-col items-center w-[70%] h-full'>
                {messages.length > 0 && (
                    <Button
                        onClick={() => {
                            clearChat();
                            showSnackbar('Started new chat');
                        }}
                        startIcon={<RefreshCw className="w-4 h-4" />}
                        variant="text"
                        size="small"
                        className='absolute top-4 right-4 text-mountain-600'
                    >
                        New Chat
                    </Button>
                )}

                <div 
                    ref={scrollRef}
                    className='flex flex-col w-full h-full overflow-y-auto pb-24 custom-scrollbar'
                >
                    {messages.length === 0 ? (
                        <div className='flex flex-col items-center space-y-6 mt-20'>
                            <div className='flex flex-col justify-center items-center space-y-2'>
                                <div className='flex justify-center items-center bg-gradient-to-r from-indigo-400 to-purple-400 shadow ml-4 border border-mountain-300 rounded-xl w-15 h-15'>
                                    <RiRobot2Line className='size-6 text-white' />
                                </div>
                                <p className='font-medium'>Imagine Bot</p>
                                <p className='flex w-[360px] text-mountain-600 text-sm text-center'>
                                    Spark your creativity with Imagine Bot! Generate unique prompts to inspire your next visual masterpiece.
                                </p>
                            </div>
                            <div className='flex flex-col items-center space-y-2'>
                                {examplePrompts.map((prompt, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleExampleClick(prompt)}
                                        className='flex hover:bg-mountain-50 p-2 px-4 border rounded-full w-fit text-mountain-600 hover:text-mountain-950 hover:cursor-pointer transition-colors'
                                    >
                                        <p>{prompt}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col space-y-4 mt-8 px-4'>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] rounded-lg p-4 ${
                                        message.role === 'USER'
                                            ? 'bg-indigo-100 text-indigo-900'
                                            : 'bg-mountain-100'
                                    }`}>
                                        <p className='whitespace-pre-wrap'>{message.content}</p>
                                        
                                        {message.role === 'ASSISTANT' && message.generatedPrompts && (
                                            <div className='space-y-2 mt-4'>
                                                <p className='text-xs text-mountain-500 mb-2'>
                                                    Click any prompt to copy:
                                                </p>
                                                {message.generatedPrompts.map((prompt, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handlePromptClick(prompt)}
                                                        className='bg-white border border-mountain-200 rounded-lg p-3 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group'
                                                    >
                                                        <div className='flex items-center justify-between'>
                                                            <span className='text-xs text-mountain-400 opacity-0 group-hover:opacity-100 transition-opacity'>
                                                                📋 Copy
                                                            </span>
                                                        </div>
                                                        <p className='text-sm text-mountain-700 mt-1'>
                                                            {prompt}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {isLoading && (
                                <div className='flex justify-start'>
                                    <div className='bg-mountain-100 rounded-lg p-4 flex items-center space-x-2'>
                                        <CircularProgress size={20} />
                                        <span className='text-sm text-mountain-600'>Generating ideas...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={`flex bottom-4 left-1/2 z-50 absolute -translate-x-1/2`}>
                    <div className={`flex flex-col bg-white border ${
                        promptExpanded ? 'border-indigo-600 shadow-lg' : 'border-mountain-300 shadow-md'
                    } rounded-xl w-[480px] relative`}>
                        <div
                            className={`flex bg-white rounded-xl w-full border-0 rounded-b-none overflow-hidden transition-all duration-400 ease-in-out transform
                            ${promptExpanded ? 'h-24 scale-y-100 opacity-100 py-2' : 'h-0 opacity-0'} 
                            overflow-y-auto`}
                        >
                            <TextareaAutosize
                                value={userPrompt}
                                ref={textareaRef}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleGenerate();
                                    }
                                }}
                                placeholder="Type your idea..."
                                disabled={isLoading}
                                className='flex p-2 resize-none bg-white custom-scrollbar rounded-xl w-full text-sm rounded-b-none h-full overflow-y-auto placeholder:text-mountain-400 outline-none focus:outline-none focus:ring-0 focus:border-transparent'
                            />
                        </div>
                        <div
                            onClick={() => {
                                setPromptExpanded(true);
                                setTimeout(() => textareaRef.current?.focus(), 0);
                            }}
                            className={`${
                                promptExpanded && 'rounded-t-none pointer-events-none'
                            } items-center text-sm flex bg-white px-2 py-4 rounded-xl w-full h-15 line-clamp-1 hover:cursor-pointer overflow-y-auto`}
                        >
                            <p className={`pr-26 ${userPrompt ? 'text-mountain-800' : 'text-mountain-400'} ${promptExpanded && 'hidden'}`}>
                                {userPrompt || 'Type your idea...'}
                            </p>
                        </div>
                        <Button
                            onClick={handleGenerate}
                            disabled={isLoading || !userPrompt.trim()}
                            className={`right-4 -bottom-2 absolute flex items-center px-4 -translate-y-1/2 ${
                                isLoading || !userPrompt.trim()
                                    ? 'bg-mountain-300 cursor-not-allowed'
                                    : 'bg-indigo-400 hover:bg-indigo-300 hover:cursor-pointer'
                            }`}
                        >
                            {isLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowUp />}
                        </Button>
                    </div>
                </div>
            </div>            
        </div>
    );
};

export default SuggestPrompt;