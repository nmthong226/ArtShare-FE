import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@mui/material";
import { Info } from "lucide-react";
import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings2 } from "lucide-react";
import { GenPostContent } from "../types/automation-project";

interface ProjectGenPostsProp {
  handleStepChange: (
    step: string,
    data?: { projectName?: string; selectedPlatform?: Platform },
  ) => void;
}

const ProjectGenPostsTab: React.FC<ProjectGenPostsProp> = ({
  handleStepChange,
}) => {
  const [postNumber, setPostNumber] = useState<string>("");
  const [postContent, setPostContent] = useState<GenPostContent[]>([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(250);
  const [generateHashtag, setGenerateHashtag] = useState(false);
  const [useEmojis, setUseEmojis] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setCharCount(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 1000) {
      setCharCount(value);
    }
  };

  const tones = ["Friendly", "Professional", "Casual", "Inspiring", "Witty"];

  const generateMockPosts = (count: number): GenPostContent[] => {
    const examples = [
      {
        id: "post_001",
        title: "🔥 PHONG VŨ’S JUNE TECH FEST IS HERE! 🔥",
        content: `Biggest Electronics Sale of the Month – Don’t Miss Out!
            Ready to upgrade your gear? Phong Vũ is turning up the heat this June with massive discounts across a wide range of top-brand electronics! Whether you're a gamer, a student, a remote worker, or just a tech enthusiast – we’ve got something for you! 💻🎧📱🖥️
            ✨ WHAT’S HOT THIS MONTH?
            🔹 Laptops – Up to 30% OFF on top models from ASUS, Dell, HP, Lenovo & more
            🔹 PC Components – Unbeatable prices on GPUs, SSDs, RAM, and power supplies
            🔹 Gaming Gear – Discounts on keyboards, headsets, mice & chairs
            🔹 Smart Devices – Deals on tablets, smartwatches, and wireless earbuds
            🔹 Home Appliances – Save big on air purifiers, fans, and more
            🎁 EXTRA BONUSES:
            💳 0% installment plans for up to 12 months
            🎫 Exclusive online vouchers up to 1,000,000 VND
            🚛 FREE nationwide delivery on selected items

            🗓️ Campaign Period: June 5 – June 30
            🏬 Shop in-store or online at: https://phongvu.vn
            💡 Don’t wait until the last minute – our hottest deals are limited in quantity!
            Follow us on Facebook to stay updated on daily flash sales and lucky draw events throughout June. Let Phong Vũ power your tech life this summer! ☀️💼⚡
            #PhongVuJuneSale #TechFest2025 #ElectronicsDeals #PhongVuOfficial`,
      },
      {
        id: "post_002",
        title: "🌟 JUNE TECH MADNESS AT PHONG VŨ! 🌟",
        content: `
            Your favorite electronics sale is BACK — bigger, better, and hotter than ever! 🔥
            This June, Phong Vũ brings you exclusive deals and mind-blowing discounts on the latest tech essentials. Whether you're upgrading your home setup, hunting for gaming gear, or shopping for smart gadgets — we’ve got you covered!

            🎉 WHAT TO EXPECT:
            🖥️ Laptops & PCs – Save up to 25% on ASUS, Acer, Dell & more
            🧩 PC Components – Hot deals on GPUs, RAM, SSDs, and CPUs
            🎮 Gaming Accessories – Premium keyboards, mice, monitors & chairs on sale
            📱 Smart Devices – Special offers on smartwatches, tablets, and wireless audio
            🏠 Home Tech – Discounts on air purifiers, fans, and other essentials

            🎁 EXCLUSIVE BONUSES JUST FOR YOU:
            ✅ 0% interest installment plans
            ✅ Free nationwide shipping on select items
            ✅ Limited-time online vouchers worth up to 1,000,000 VND
            ✅ Flash sales every Friday!

            📅 Promotion runs from June 5 – June 30
            🛒 Shop online or visit any Phong Vũ store nationwide
            🌐 https://phongvu.vn

            Hurry – stocks won’t last long!
            Follow our Facebook page for daily updates, giveaways, and surprise deals.
            Let Phong Vũ supercharge your tech life this June! 💡

            #PhongVuJunePromo #JuneDeals2025 #TechSale #PhongVuElectronics #SmartShopping`,
      },
      {
        id: "post_003",
        title: "⚡ LEVEL UP YOUR TECH – PHONG VŨ JUNE SALE IS ON! ⚡",
        content: `
            Looking for the perfect time to upgrade your setup? June is your moment.
            Phong Vũ is bringing the 🔥 heat with our BIGGEST mid-year tech promotion!

            🎯 Whether you're into gaming, studying, remote work, or smart living — we’ve handpicked deals just for YOU.

            🔻 TOP DEALS YOU CAN’T MISS:
            💻 Laptops & Ultrabooks – Up to 30% OFF from top brands like MSI, HP, Dell
            🛠️ PC Components – Massive markdowns on SSDs, RAM, GPUs & cooling systems
            🎮 Gamer Must-Haves – Get your dream keyboard, mouse, or gaming chair at unbeatable prices
            📱 Smart Gadgets – Shop wireless earbuds, smartwatches & tablets
            🌬️ Lifestyle Tech – Save big on fans, purifiers, and home essentials

            ✨ SPECIAL PERKS THIS MONTH:
            ✅ 0% installment plans – Pay comfortably over time
            🎫 Exclusive online vouchers – Up to 1,000,000 VND
            🚚 FREE nationwide shipping for selected tech
            🎉 Weekly lucky draw events for online buyers!

            🗓️ Campaign Duration: June 5 – June 30
            🛍️ Available both in-store & online at: https://phongvu.vn

            💡 Tip: The hottest deals are limited in quantity – grab them while they last!
            📲 Don’t forget to follow us for daily flash deals and giveaways throughout June!

            👉 Power up with Phong Vũ – your go-to tech destination this summer! 🌞🖱️🖥️

            #PhongVuJune2025 #MidYearTechDeals #ElectronicsSale #PhongVuOfficial #UpgradeSeason`,
      },
    ];

    for (let i = 0; i < count; i++) {
      const random = examples[Math.floor(Math.random() * examples.length)];
      postContent.push({
        ...random,
        id: i + 1,
      });
    }

    return postContent;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const number = parseInt(postNumber);
    if (!isNaN(number) && number > 0) {
      setIsLoading(true);
      setTimeout(() => {
        const generated = generateMockPosts(number);
        setPostContent(generated);
        setIsLoading(false);
      }, 1000); // simulate delay
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col items-center w-full h-full space-y-2 bg-white"
    >
      <div className="flex flex-col items-center w-full gap-4 pb-2 border-mountain-200 border-b-1 h-fit">
        <div className="relative flex items-end gap-4 w-xl">
          <div className="flex flex-col">
            <label className="flex items-center mb-1 space-x-2 text-sm text-mountain-800">
              <p>Your Prompt</p>
              <span>
                <Info className="size-4" />
              </span>
            </label>
            <Input
              className="h-10 rounded-md w-108 placeholder:text-mountain-400"
              placeholder="Prompt your post content"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-mountain-800">
              How many posts?
            </label>
            <input
              type="number"
              min={1}
              max={7}
              value={postNumber}
              onChange={(e) => setPostNumber(e.target.value)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g. 5"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="h-10 px-4 text-white transition bg-indigo-500 rounded-md shadow-md hover:bg-indigo-600"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="absolute flex items-center gap-2 px-4 py-2 text-white rounded-md cursor-pointer -left-32 bg-mountain-400 hover:bg-mountain-300"
              >
                <Settings2 className="size-4" />
                Settings
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              onInteractOutside={(e) => e.preventDefault()}
              className="space-y-6 shadow-md mt-2 p-2 border border-mountain-200 rounded-lg w-72 max-h-[calc(100vh-14rem)] overflow-x-hidden overflow-y-auto"
            >
              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-sm text-mountain-800">
                  <p>Prompt Settings</p>
                </label>
                <hr className="border-mountain-200" />
                {/* Tone of Voice */}
                <div className="space-y-2">
                  <label className="px-1 text-sm text-mountain-800">
                    Tone of Voice
                  </label>
                  <div className="flex flex-wrap gap-2 px-1">
                    {tones.map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setSelectedTone(tone)}
                        className={`px-2 py-1 rounded-md text-sm border transition 
                                                    ${
                                                      selectedTone === tone
                                                        ? "bg-indigo-500 text-white border-indigo-600"
                                                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                                    }`}
                      >
                        {tone}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {}}
                      className="flex items-center px-3 py-1 text-sm text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      <BiChevronDown className="mr-1" />
                      <p>More</p>
                    </button>
                  </div>
                </div>
                {/* Word count & slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-mountain-800">
                      Approximate words
                    </label>
                    <Input
                      className="w-16 h-8"
                      type="number"
                      value={charCount}
                      onChange={handleInputChange}
                      min={0}
                      max={500}
                    />
                  </div>
                  <Slider
                    value={charCount}
                    min={0}
                    max={500}
                    step={10}
                    onChange={handleSliderChange}
                  />
                </div>
                {/* Toggles */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-mountain-800">
                    Generate hashtag
                  </label>
                  <Switch
                    checked={generateHashtag}
                    onClick={() => setGenerateHashtag(!generateHashtag)}
                    className="cursor-pointer"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-mountain-800">
                    Include emojis
                  </label>
                  <Switch
                    checked={useEmojis}
                    onClick={() => setUseEmojis(!useEmojis)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {postContent && postContent.length > 0 && (
        <div className="relative flex gap-4 shadow-md border border-mountain-200 w-xl h-[calc(100vh-19.5rem)]">
          {/* Post Display */}
          <div className="w-full p-4 overflow-auto text-left">
            <h2 className="mb-2 text-xl font-bold">
              {postContent[selectedPostIndex]?.title}
            </h2>
            <p className="whitespace-pre-line">
              {postContent[selectedPostIndex]?.content}
            </p>
          </div>
          {/* Sidebar for selecting posts */}
          <div className="absolute flex flex-col items-center w-24 h-full p-2 space-y-2 border rounded-lg -right-28 bg-mountain-50 border-mountain-200">
            {postContent.map((_, index) => (
              <div
                key={index}
                onClick={() => setSelectedPostIndex(index)}
                className={`flex justify-center items-center border-1 rounded-md w-16 h-14 cursor-pointer select-none shrink-0
                                    ${
                                      selectedPostIndex === index
                                        ? "bg-white border-indigo-600"
                                        : "bg-white border-mountain-200 hover:bg-gray-100"
                                    }`}
              >
                <p className="text-sm text-mountain-600">Post {index + 1}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="absolute bottom-0 flex space-x-4 -translate-x-1/2 left-1/2">
        <button
          onClick={() => handleStepChange("project-info")}
          className="flex items-center justify-center w-48 px-2 py-2 mt-4 transition bg-indigo-200 rounded-md cursor-default hover:bg-indigo-300/80 text-mountain-950 disabled:text-mountain-600"
        >
          Previous Step
        </button>
        <button
          onClick={() => handleStepChange("edit-posts")}
          className="flex items-center justify-center w-48 px-6 py-2 mt-4 transition bg-indigo-200 rounded-md cursor-pointer hover:bg-indigo-300/80 text-mountain-950"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};

export default ProjectGenPostsTab;
