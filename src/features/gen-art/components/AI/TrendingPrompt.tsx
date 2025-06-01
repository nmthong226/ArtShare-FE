import { useState, useEffect, useRef } from "react";
import api from "@/api/baseApi";

//Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@mui/material";

//Icons
import { IoIosSquareOutline } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";

//Assets
const example_1 =
  "https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/v1/Models-Mock/Model-1/dzu0q9a2zxvtu3w1r29a";

interface TrendingPromptProps {
  selectedTab: string;
}

const TrendingPrompt: React.FC<TrendingPromptProps> = ({ selectedTab }) => {
  const [translateY, setTranslateY] = useState(10);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [seletectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollStep = 1; // Scroll 1 item at a time
  const scrollThreshold = 40; // Minimum delta before triggering a change
  const scrollAccumulator = useRef(0);
  interface TrendingItem {
    image: string;
    prompt: string;
    // Add other properties if needed
  }

  const [trending, setTrending] = useState<TrendingItem[]>([]);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const data = await getTrendingAiPosts();
        setTrending(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to load trending posts:", error);
      }
    };

    fetchTrendingPosts();
  }, []);

  useEffect(() => {
    const container = document.getElementById("trending-container");
    if (!container) return;

    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      scrollAccumulator.current += e.deltaY;

      if (Math.abs(scrollAccumulator.current) >= scrollThreshold) {
        const direction = scrollAccumulator.current > 0 ? 1 : -1;

        setSelectedImageIndex((prev) => {
          let next = prev + direction * scrollStep;
          next = Math.min(Math.max(next, 0), trending.length - 1);

          setTranslateY((prevY) => {
            if (next <= 5) {
              // Reset translateY to 10 for top items
              return 10;
            } else {
              // Apply consistent scroll
              const newY = prevY - direction * 64;
              return Math.min(Math.max(newY, -1500), 10);
            }
          });

          return next;
        });

        scrollAccumulator.current = 0;
      }
    };

    container.addEventListener("wheel", handleScroll);

    return () => {
      container.removeEventListener("wheel", handleScroll);
    };
  }, [selectedTab, trending]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);

    if (index <= 5) {
      // Lock the scroll at top
      setTranslateY(10);
    } else {
      // Translate consistently by fixed pixel per image after index 5
      const offsetPerItem = 64 + 8; // image height (64) + space-y-2 (8px gap)
      const itemsAbove = index - 5;
      const newY = 10 - offsetPerItem * itemsAbove;

      setTranslateY(Math.max(newY, -1500)); // clamp to bottom bound
    }
  };

  return (
    <div
      id="trending-container"
      ref={containerRef}
      className="flex justify-start w-full h-full"
    >
      <div className="relative flex justify-center items-center bg-mountain-100 w-[60%] h-full">
        <div className="top-6 absolute flex justify-center items-center bg-white p-3 px-9 rounded-full font-medium text-sm">
          <p>
            <span className="text-xl">👑</span> Top Trending Propmt Results
          </p>
        </div>
        <img
          src={trending[seletectedImageIndex]?.image}
          alt="Selected"
          className="flex shadow-lg rounded-lg h-128 transition-all duration-200"
        />{" "}
      </div>
      <div className="flex border-mountain-200 border-r-1 w-[30%] h-full">
        <div className="relative flex flex-col w-full">
          <div className="flex justify-between items-end p-4 border-mountain-100 border-b w-full h-28">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center space-x-2">
                <Avatar className="size-12">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="font-medium">Nguyễn Minh Thông</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2 p-4 border-mountain-100 border-b w-full h-1/2">
            <div className="flex justify-between items-center w-full">
              <p className="font-medium">Prompt</p>
              <Button title="Copy" className="bg-mountain-100">
                <IoCopyOutline className="size-5" />
              </Button>
            </div>
            <div className="flex bg-mountain-50 p-2 rounded-lg h-fit max-h-full overflow-y-auto text-sm custom-scrollbar">
              {trending[seletectedImageIndex]?.prompt}
            </div>
          </div>
          <div className="flex space-x-4 p-4 w-full">
            <div className="flex flex-col space-y-2 w-1/3">
              <div className="flex items-center w-full">
                <p className="font-medium">Model</p>
              </div>
              <div className="flex items-center space-x-2">
                <img src={example_1} className="rounded-xs w-5 h-5" />
                <p className="text-mountain-600 line-clamp-1">Ultra Realism</p>
              </div>
            </div>
            <div className="flex flex-col space-y-2 w-1/3">
              <div className="flex items-center w-full">
                <p className="font-medium">Aspect Ratio</p>
              </div>
              <div className="flex items-center space-x-2">
                <IoIosSquareOutline className="size-5" />
                <p className="text-mountain-600">1:1</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between px-4 w-full">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center w-full">
                <p className="font-medium">Styles</p>
              </div>
              <div className="flex items-center">
                <p className="text-mountain-600">Default</p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center w-full">
                <p className="font-medium">Lighting</p>
              </div>
              <div className="flex items-center">
                <p className="text-mountain-600">Default</p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center w-full">
                <p className="font-medium">Camera</p>
              </div>
              <div className="flex items-center">
                <p className="text-mountain-600">Default</p>
              </div>
            </div>
          </div>
          <div className="bottom-0 absolute p-4 w-full">
            <Button className="bg-mountain-100 shadow-sm w-full h-12 font-normal text-mountain-700">
              <LuImagePlus className="mr-2 size-5" />
              <p>Apply This Prompt</p>
            </Button>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col rounded-xl w-[10%] h-full overflow-hidden">
        <div className="top-0 z-10 absolute flex bg-white blur-xl w-full h-10" />
        <div
          className="flex flex-col items-end space-y-2 pr-2 w-full h-[2000px]"
          style={{ transform: `translateY(${translateY}px)` }}
        >
          {trending.map((item, index) => (
            <img
              key={index}
              src={item.image}
              onClick={() => handleImageClick(index)}
              className={`flex justify-start items-start rounded-lg ${
                seletectedImageIndex === index ? "w-20" : "w-16"
              } min-h-16 max-h-16 object-cover transition-all duration-150`}
            />
          ))}
          <div />
        </div>
        <div className="-bottom-2 z-10 absolute flex bg-white blur-lg w-full h-10" />
      </div>
    </div>
  );
};

const getTrendingAiPosts = async () => {
  try {
    const response = await api.get("/posts/ai-trending");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching trending AI posts:", error);
    throw error;
  }
};

export default TrendingPrompt;
