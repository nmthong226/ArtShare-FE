import { RiRobot2Line } from "react-icons/ri";
import { Button, TextareaAutosize } from "@mui/material";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import getTrendingPrompts from "../../api/get-trending-prompts";

const ChatInterface = () => {
  const [userPrompt, setUserPrompt] = useState(""); // User input state
  const [chatHistory, setChatHistory] = useState<
    { sender: string; text: string }[]
  >([]); // Chat history
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false); // Simulating bot typing
  const scrollRef = useRef<HTMLDivElement>(null); // Reference for scroll
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Reference for input field
  const [trendingPrompts, setTrendingPrompts] = useState<string[]>([]); // Trending prompts

  useEffect(() => {
    const fetchTrendingPrompts = async () => {
      try {
        const prompts = await getTrendingPrompts();
        setTrendingPrompts(prompts);
      } catch (error) {
        console.error("Failed to fetch trending prompts:", error);
      }
    };

    fetchTrendingPrompts();
  }, []);

  // Handle generating the bot's response
  const handleGenerate = () => {
    if (!userPrompt.trim()) return;

    // Add user message to the chat history
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: "user", text: userPrompt },
    ]);

    // Simulate bot response after a delay
    setIsBotTyping(true);
    setTimeout(() => {
      const botReply = `Bot's response to: ${userPrompt}`; // Replace this with real bot logic
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: "bot", text: botReply },
      ]);
      setIsBotTyping(false);
    }, 1500);

    // Scroll to the bottom of the chat area
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);

    setUserPrompt(""); // Clear the input field after generating a message
  };

  // Handle prompt selection from the trending prompts list
  const handlePromptClick = (prompt: string) => {
    setUserPrompt(prompt);
    setChatHistory([
      { sender: "bot", text: `You selected the prompt: ${prompt}` }, // Bot's first message
    ]);
  };

  return (
    <div className="flex justify-center w-full h-full">
      <div className="relative flex flex-col items-center w-[90%] h-full">
        {/* Prompt Section (Optional, can be minimized or replaced with a button) */}
        <div className="flex flex-col items-center mt-6 space-y-4">
          <div className="flex justify-center items-center bg-gradient-to-r from-indigo-400 to-purple-400 shadow ml-4 border border-mountain-300 rounded-xl w-15 h-15 hover:cursor-pointer">
            <RiRobot2Line className="size-6 text-white" />
          </div>
          <p className="font-medium">Imagine Bot</p>
          <p className="flex w-[360px] text-mountain-600 text-sm text-center">
            Spark your creativity with Imagine Bot! Generate unique prompts to
            inspire your next visual masterpiece.
          </p>
          <div className="flex space-x-2">
            {trendingPrompts.length > 0 ? (
              trendingPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  variant="outlined"
                  className="hover:bg-mountain-50 p-2 px-4 border rounded-full text-mountain-600 hover:text-mountain-950 hover:cursor-pointer"
                >
                  {prompt}
                </Button>
              ))
            ) : (
              <p>Loading prompts...</p>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-col w-full h-full bg-white border rounded-xl shadow-lg relative mt-6">
          {/* Chat messages area */}
          <div
            ref={scrollRef}
            className="flex flex-col p-4 space-y-4 overflow-y-auto flex-grow"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex p-2 rounded-xl ${
                    message.sender === "user"
                      ? "bg-indigo-400 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}

            {/* Bot typing indicator */}
            {isBotTyping && (
              <div className="flex justify-start">
                <div className="flex p-2 rounded-xl bg-gray-200 text-gray-800">
                  <p>Bot is typing...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex p-4 bg-white border-t">
            <TextareaAutosize
              ref={textareaRef}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Type your idea..."
              className="w-full p-2 resize-none rounded-xl text-sm bg-gray-100 outline-none"
            />
            <Button
              onClick={handleGenerate}
              className="ml-2 bg-indigo-400 hover:bg-indigo-300 text-white rounded-full px-4"
            >
              <ArrowUp />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
