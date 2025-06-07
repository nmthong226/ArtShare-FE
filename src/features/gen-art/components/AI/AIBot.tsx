import { useState, useEffect, useRef } from "react";

//Libs

//Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SuggestPrompt from "./SuggestPrompt";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

//Icons
import { RiRobot2Line } from "react-icons/ri";
import { TbPrompt } from "react-icons/tb";
import { TbTrendingUp } from "react-icons/tb";
import TrendingPrompt from "./TrendingPrompt";

const AIBot = () => {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"suggest" | "trending">(
    "suggest",
  );

  const [promptExpanded, setPromptExpanded] = useState<boolean>(false);
  // const [userPrompt] = useState('');
  // const [, setCommittedPrompt] = useState('');
  // const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // const handleGenerate = () => {
  //     if (!userPrompt.trim()) return;
  //     setCommittedPrompt(userPrompt); // store the current prompt
  //     // Immediately scroll down
  //     setTimeout(() => {
  //         scrollRef.current?.scrollTo({
  //             top: scrollRef.current.scrollHeight,
  //             behavior: 'smooth',
  //         });
  //     }, 100);
  //     // Simulate generation delay
  //     setTimeout(() => {
  //         scrollRef.current?.scrollTo({
  //             top: scrollRef.current.scrollHeight,
  //             behavior: 'smooth',
  //         });
  //     }, 100);
  // };

  // const handlePrompt = () => {
  //     setPromptExpanded(true);
  //     setTimeout(() => {
  //         textareaRef.current?.focus();
  //     }, 0); // ensures it's after expansion
  // };

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

  const handleOpenModal = () => {
    setOpen(!open);
    setSelectedTab("suggest");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenModal}>
      <DialogTrigger asChild>
        <Tooltip title="Imagine Bot">
          <Button className="bg-white hover:bg-mountain-100 ml-4 border border-mountain-300 rounded-xl w-15 h-15 hover:cursor-pointer">
            <RiRobot2Line className="size-6 text-mountain-700" />
          </Button>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 space-y-0 bg-white p-0 border-0 rounded-xl min-w-6xl h-[95%]">
        <DialogHeader
          hidden
          className="flex p-4 border-mountain-200 border-b-[1px] h-12"
        >
          <DialogTitle className="font-normal text-mountain-700">
            ArtShare AI Bot
          </DialogTitle>
          <DialogDescription hidden>Image Description</DialogDescription>
        </DialogHeader>
        <div className="relative flex w-full h-full">
          <div className="flex flex-col items-center space-y-8 py-8 border-mountain-300 border-r-1 w-20 h-full">
            <div className="group flex flex-col justify-center items-center">
              <Button
                onClick={() => setSelectedTab("suggest")}
                className={`flex flex-col border-none hover:bg-mountain-100 ${
                  selectedTab === "suggest"
                    ? "bg-mountain-100"
                    : "hover:bg-mountain-100"
                } shadow-none border rounded-xl w-15 h-10 hover:cursor-pointer`}
                title="Suggest Prompt"
              >
                <TbPrompt className="size-5 text-mountain-700" />
              </Button>
              <p className="text-mountain-600 text-xs">Suggest</p>
            </div>
            <div className="group flex flex-col justify-center items-center">
              <Button
                onClick={() => setSelectedTab("trending")}
                className={`flex flex-col hover:bg-mountain-100 border-none ${
                  selectedTab === "trending"
                    ? "bg-mountain-100"
                    : "hover:bg-mountain-100"
                } shadow-none border rounded-xl w-15 h-10 hover:cursor-pointer`}
                title="Trending Prompt"
              >
                <TbTrendingUp className="size-5 text-mountain-700" />
              </Button>
              <p className="text-mountain-600 text-xs">Trending</p>
            </div>
          </div>
          {selectedTab === "suggest" && <SuggestPrompt />}
          {selectedTab === "trending" && (
            <TrendingPrompt
              selectedTab={selectedTab}
              onClose={handleOpenModal}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIBot;
