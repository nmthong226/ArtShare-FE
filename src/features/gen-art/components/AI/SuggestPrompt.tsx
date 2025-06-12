//Libs

//Components

//Icons
import { RiRobot2Line } from "react-icons/ri";
import { Button, TextareaAutosize } from "@mui/material";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SuggestPrompt = () => {
  const [promptExpanded, setPromptExpanded] = useState<boolean>(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [, setCommittedPrompt] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = () => {
    if (!userPrompt.trim()) return;
    setCommittedPrompt(userPrompt); // store the current prompt
    // Immediately scroll down
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
    // Simulate generation delay
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
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
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [promptExpanded]);

  return (
    <div className="flex justify-center w-full h-full">
      <div className="relative flex flex-col items-center w-[70%] h-full">
        <div className="flex flex-col items-center space-y-6 mt-20">
          <div className="flex flex-col justify-center items-center space-y-2">
            <div className="flex justify-center items-center bg-gradient-to-r from-indigo-400 to-purple-400 shadow ml-4 border border-mountain-300 rounded-xl w-15 h-15 hover:cursor-pointer">
              <RiRobot2Line className="size-6 text-white" />
            </div>
            <p className="font-medium">Imagine Bot</p>
            <p className="flex w-[360px] text-mountain-600 text-sm text-center">
              Spark your creativity with Imagine Bot! Generate unique prompts to
              inspire your next visual masterpiece.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="flex hover:bg-mountain-50 p-2 px-4 border rounded-full w-fit text-mountain-600 hover:text-mountain-950 hover:cursor-pointer">
              <p>A lonely astronaut on Mars</p>
            </div>
            <div className="flex hover:bg-mountain-50 p-2 px-4 border rounded-full text-mountain-600 hover:text-mountain-950 hover:cursor-pointer">
              <p>Cyberpunk samurai walking in the rain</p>
            </div>
            <div className="flex hover:bg-mountain-50 p-2 px-4 border rounded-full w-fit text-mountain-600 hover:text-mountain-950 hover:cursor-pointer">
              <p>Sunset over a pixel-art mountain</p>
            </div>
          </div>
        </div>
        <div
          className={`flex bottom-4 left-1/2 z-50 absolute -translate-x-1/2`}
        >
          <div
            className={`flex flex-col bg-white border ${promptExpanded ? "border-indigo-600 shadow-lg" : "border-mountain-300 shadow-md"} rounded-xl w-[480px] relative`}
          >
            <div
              className={`flex bg-white rounded-xl w-full border-0 rounded-b-none overflow-hidden transition-all duration-400 ease-in-out transform
                    ${promptExpanded ? "h-24 scale-y-100 opacity-100 py-2" : "h-0 opacity-0"} 
                    overflow-y-auto`}
            >
              <TextareaAutosize
                value={userPrompt}
                ref={textareaRef}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Type your idea..."
                className={`flex p-2 resize-none bg-white custom-scrollbar rounded-xl w-full text-sm rounded-b-none h-full overflow-y-auto placeholder:text-mountain-400 outline-none focus:outline-none focus:ring-0 focus:border-transparent`}
              />
            </div>
            <div
              onClick={() => handlePrompt()}
              className={`${
                promptExpanded && "rounded-t-none pointer-events-none"
              } items-center text-sm flex bg-white px-2 py-4 rounded-xl w-full h-15 line-clamp-1 hover:cursor-pointer overflow-y-auto`}
            >
              {userPrompt ? (
                <p
                  className={`pr-26 line-clamp-1 ${promptExpanded && "hidden"}`}
                >
                  {userPrompt}
                </p>
              ) : (
                <p
                  className={`pr-26 text-mountain-400 ${promptExpanded && "hidden"}`}
                >
                  Type your idea...
                </p>
              )}
            </div>
            <Button
              onClick={handleGenerate}
              className="right-4 -bottom-2 absolute flex items-center bg-indigo-400 hover:bg-indigo-300 px-4 -translate-y-1/2 hover:cursor-pointer"
            >
              <ArrowUp />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestPrompt;
