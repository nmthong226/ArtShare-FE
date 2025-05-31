import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

//Assets
import app_logo from "/logo_app_v_101.png";

//Icons
// import { HiOutlineCommandLine } from "react-icons/hi2";
import {
  MdAutoMode,
  MdOutlineCollectionsBookmark,
  MdOutlineExplore,
  MdOutlineLibraryBooks,
} from "react-icons/md";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { RiImageAiLine } from "react-icons/ri";
import { LuBookOpenText } from "react-icons/lu";
import { IoReorderThreeOutline } from "react-icons/io5";
import { ChevronRight, Home } from "lucide-react";
import { LuStarOff } from "react-icons/lu";
import { LuImageUpscale } from "react-icons/lu";
import { GoSidebarExpand } from "react-icons/go";
import { BiEdit } from "react-icons/bi";

//Components
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
// import UserPlan from "./subscription";
import { Popover, Tooltip } from "@mui/material";

type SidebarProps = {
  expand: boolean;
  setExpand: Dispatch<SetStateAction<boolean>>;
};

const Sidebar: React.FC<SidebarProps> = ({ expand, setExpand }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const [openAI, setOpenAI] = useState(true);
  const [openAuto, setOpenAuto] = useState(true);

  useEffect(() => {
    if (!expand) {
      setOpenAI(false);
      setOpenAuto(false);
    }
  }, [expand]);

  type PopoverType = "ai" | "auto" | null;

  const [anchorEl, setAnchorEl] = useState<{
    [key in NonNullable<PopoverType>]?: HTMLElement;
  }>({});
  const [openPopover, setOpenPopover] = useState<PopoverType>(null);

  const handleClick =
    (type: PopoverType) => (event: React.MouseEvent<HTMLElement>) => {
      if (!expand) {
        setAnchorEl((prev) => ({ ...prev, [type!]: event.currentTarget }));
        setOpenPopover(type);
      }
    };

  const handleClose = (type: PopoverType) => {
    setAnchorEl((prev) => ({ ...prev, [type!]: undefined }));
    if (openPopover === type) setOpenPopover(null);
  };

  const isOpen = (type: PopoverType) => openPopover === type;
  const getId = (type: PopoverType) =>
    isOpen(type) ? `${type}-popover` : undefined;

  return (
    <aside
      className={`${expand ? "w-60" : "w-16"} h-screen transition-all ease-in-out duration-500  top-0 z-20 sticky xs:flex flex-col border-r-1 border-indigo-200 flex-shrink-0 flex-none justify-between space-y-4 dark:bg-mountain-950 py-4 dark:border-r-mountain-700 overflow-hidden`}
    >
      <div className="flex flex-col space-y-6">
        {/* Sidebar Header */}
        <div className="flex justify-between items-center px-4">
          <div
            className={`flex items-center overflow-hidden ease-in-out transition-all duration-500 ${expand ? "w-auto opacity-100" : "opacity-0"}`}
          >
            <img src={app_logo} className="flex mr-2 rounded-sm w-6 h-6" />
            <p className="font-medium">ArtShare</p>
          </div>
          <div className="flex-grow" />
          <div
            onClick={() => setExpand(!expand)}
            className={`flex justify-center items-center rounded-full w-6 h-6 hover:cursor-pointer max-pointer-events-none`}
          >
            {expand ? (
              <GoSidebarExpand className="size-5 text-gray-600" />
            ) : (
              <IoReorderThreeOutline className="size-6 text-gray-600" />
            )}
          </div>
        </div>
        {/* Sidebar Body */}
        <div
          className={`flex flex-col space-y-6  px-2 h-[calc(100vh-8rem)] overflow-x-hidden text-mountain-800 `}
        >
          <div className="flex flex-col justify-between items-center space-y-1 w-full">
            {[
              { icon: Home, label: "Dashboard", href: "/dashboard" },
              {
                icon: MdOutlineExplore,
                label: "Explore Arts",
                href: "/explore",
              },
              {
                icon: MdOutlineLibraryBooks,
                label: "Read Blogs",
                href: "/blogs",
              },
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <Tooltip
                  title={item.label}
                  placement="right"
                  arrow
                  disableHoverListener={expand}
                >
                  <Link
                    to={item.href}
                    key={item.label}
                    className={`${isActive ? "from-indigo-200 to-purple-200 bg-gradient-to-r" : "text-violet-900"} group flex items-center px-4 rounded-md w-full h-10 hover:text-mountain-950 hover:cursor-pointer`}
                  >
                    <item.icon className="flex-shrink-0 size-5" />
                    <div
                      className={`overflow-hidden transition-all duration-500 origin-left ${expand ? "ml-2 w-auto" : "w-0"}`}
                    >
                      <p
                        className={`text-nowrap transition-opacity duration-500 ${expand ? "opacity-100" : "opacity-0"} font-regular`}
                      >
                        {item.label}
                      </p>
                    </div>
                  </Link>
                </Tooltip>
              );
            })}
          </div>
          <div className="flex flex-col justify-between items-center space-y-1 w-full">
            {[
              { icon: LuBookOpenText, label: "My Post", href: "/posts/new" },
              { icon: HiOutlineNewspaper, label: "My Writing", href: "/docs" },
              {
                icon: MdOutlineCollectionsBookmark,
                label: "My Collections",
                href: "/collections",
              },
            ].map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/docs" && pathname === "/docs/new");
              return (
                <Tooltip
                  title={item.label}
                  placement="right"
                  arrow
                  disableHoverListener={expand}
                >
                  <Link
                    to={item.href}
                    key={item.label}
                    className={`${isActive ? "from-indigo-200 to-purple-200 bg-gradient-to-r" : "text-violet-900"} group flex items-center px-4 rounded-md w-full h-10 hover:text-mountain-950 hover:cursor-pointer`}
                  >
                    <item.icon className="flex-shrink-0 size-5" />
                    <div
                      className={`overflow-hidden transition-all duration-500 origin-left ${expand ? "ml-2 w-auto" : "w-0"}`}
                    >
                      <p
                        className={`text-nowrap transition-opacity duration-500 ${expand ? "opacity-100" : "opacity-0"} font-regular`}
                      >
                        {item.label}
                      </p>
                    </div>
                  </Link>
                </Tooltip>
              );
            })}
          </div>
          <div className="flex flex-col">
            <Collapsible
              open={expand ? openAI : false}
              onOpenChange={(value) => expand && setOpenAI(value)}
              className="flex flex-col w-full"
            >
              <CollapsibleTrigger asChild onClick={handleClick("ai")}>
                <button
                  className={`group flex pl-4 pr-2 text-violet-800 justify-between items-center  hover: py-2 rounded-md w-full transition hover:text-mountain-950 hover:cursor-pointer`}
                >
                  <div className="flex items-center space-x-2">
                    <RiImageAiLine className="size-5" />
                    <p
                      className={`text-nowrap transition-opacity duration-500 ${expand ? "opacity-100" : "opacity-0"} font-regular`}
                    >
                      Art Studio
                    </p>
                  </div>
                  <ChevronRight
                    className={`size-4 group-data-[state=open]:rotate-90 transition-transform duration-500 ${!expand && "hidden"}`}
                  />
                </button>
              </CollapsibleTrigger>
              <Popover
                id={getId("ai")}
                open={isOpen("ai")}
                anchorEl={anchorEl.ai}
                disableScrollLock
                onClose={() => handleClose("ai")}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: "left",
                }}
                slotProps={{
                  paper: {
                    className:
                      "relative w-40 ml-2 mt-8 rounded-md shadow-lg overflow-visible", // allow content to go "beyond" border
                  },
                }}
              >
                {/* Arrow: placed just *inside* the left edge */}
                <div className="top-16 -left-1.5 z-10 absolute bg-indigo-100 shadow-sm border-gray-200 border-t border-l w-3 h-3 rotate-45 -translate-y-1/2" />
                <div className="flex flex-col space-y-1">
                  <div className="space-y-1 bg-indigo-100 p-2 border-mountain-200 border-b-1 rounded-t-lg">
                    <p className="font-semibold">AI Studio</p>
                    <p className="text-mountain-600 text-xs leading-tight">
                      Generate and edit images with AI assistant.
                    </p>
                  </div>
                  <Link
                    to="/image/tool/text-to-image"
                    className="flex items-center p-2 border-mountain-200 border-b-1 hover:text-blue-600 text-sm"
                  >
                    <RiImageAiLine className="mr-2 size-4" />
                    <p>Text To Image</p>
                  </Link>
                  <Link
                    to="/image/tool/upscale"
                    className="flex items-center p-2 border-mountain-200 border-b-1 hover:text-blue-600 text-sm"
                  >
                    <LuImageUpscale className="mr-2 size-4" />
                    <p>Creative Upscale</p>
                  </Link>
                  <Link
                    to="/image/tool/editor"
                    className="flex items-center p-2 hover:text-blue-600 text-sm"
                  >
                    <BiEdit className="mr-2 size-4" />
                    <p>Image Editor</p>
                  </Link>
                </div>
              </Popover>
              <CollapsibleContent className="space-y-1 ml-6 px-1 border-purple-800 border-l-1 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                {[
                  {
                    label: "Image Generation",
                    href: "/image/tool/text-to-image",
                  },
                  { label: "Creative Upscale", href: "#" },
                  { label: "Image Editor", href: "/image/tool/editor" },
                ].map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      to={item.href}
                      key={index}
                      className={`${isActive ? " text-black" : "text-violet-800"} group flex pr-1.5 items-center rounded-md justify-between w-full h-8 hover:text-mountain-950 hover:cursor-pointer`}
                    >
                      <div className="relative flex justify-center items-center transition-all duration-500">
                        <hr className="left-0 absolute border-violet-800 border-t-1 w-3" />
                        <p
                          className={`flex text-nowrap ml-4 transition-opacity duration-500 opacity-100 font-regular`}
                        >
                          {item.label}
                        </p>
                      </div>
                      <div className="hidden group-hover:flex w-[14px] h-[14px] text-mountain-400 hover:cursor-pointer">
                        <LuStarOff />
                      </div>
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
            <Collapsible
              open={expand ? openAuto : false}
              onOpenChange={(value) => expand && setOpenAuto(value)}
              className="flex flex-col w-full"
            >
              <CollapsibleTrigger asChild onClick={handleClick("auto")}>
                <button
                  className={`group flex pl-4 pr-2 text-violet-800 justify-between items-center  hover: py-2 rounded-md w-full transition hover:text-mountain-950 hover:cursor-pointer`}
                >
                  <div className="flex items-center space-x-2">
                    <MdAutoMode className="size-5" />
                    <p
                      className={`text-nowrap transition-opacity duration-500 ${expand ? "opacity-100" : "opacity-0"} font-regular`}
                    >
                      Social Automation
                    </p>
                  </div>
                  <ChevronRight
                    className={`size-4 group-data-[state=open]:rotate-90 transition-transform duration-500 ${!expand && "hidden"}`}
                  />
                </button>
              </CollapsibleTrigger>
              <Popover
                id={getId("auto")}
                open={isOpen("auto")}
                anchorEl={anchorEl.auto}
                disableScrollLock
                onClose={() => handleClose("auto")}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: "left",
                }}
                slotProps={{
                  paper: {
                    className:
                      "relative w-40 ml-2 mt-8 rounded-md shadow-lg overflow-visible", // allow content to go "beyond" border
                  },
                }}
              >
                <div className="top-16 -left-1.5 z-10 absolute bg-indigo-100 shadow-sm border-gray-200 border-t border-l w-3 h-3 rotate-45 -translate-y-1/2" />
                <div className="flex flex-col space-y-1">
                  <div className="space-y-1 bg-indigo-100 p-2 border-mountain-200 border-b-1 rounded-t-lg">
                    <p className="font-semibold">AI Studio</p>
                    <p className="text-mountain-600 text-xs leading-tight">
                      Generate and edit images with AI assistant.
                    </p>
                  </div>
                  <Link
                    to="/image/tool/text-to-image"
                    className="flex items-center p-2 border-mountain-200 border-b-1 hover:text-blue-600 text-sm"
                  >
                    <RiImageAiLine className="mr-2 size-4" />
                    <p>Text To Image</p>
                  </Link>
                  <Link
                    to="/image/tool/upscale"
                    className="flex items-center p-2 border-mountain-200 border-b-1 hover:text-blue-600 text-sm"
                  >
                    <LuImageUpscale className="mr-2 size-4" />
                    <p>Creative Upscale</p>
                  </Link>
                  <Link
                    to="/image/tool/editor"
                    className="flex items-center p-2 hover:text-blue-600 text-sm"
                  >
                    <BiEdit className="mr-2 size-4" />
                    <p>Image Editor</p>
                  </Link>
                </div>
              </Popover>
              <CollapsibleContent className="space-y-1 ml-6 px-1 border-purple-800 border-l-1 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                {[
                  {
                    label: "Connect Social",
                    href: "/image/tool/text-to-image",
                  },
                  { label: "Generate Content", href: "#" },
                  { label: "Schedule Sharing", href: "/image/tool/editor" },
                ].map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      to={item.href}
                      key={index}
                      className={`${isActive ? " text-black" : "text-violet-800"} group flex pr-1.5 items-center rounded-md justify-between w-full h-8 hover:text-mountain-950 hover:cursor-pointer`}
                    >
                      <div className="relative flex justify-center items-center transition-all duration-500">
                        <hr className="left-0 absolute border-violet-800 border-t-1 w-3" />
                        <p
                          className={`flex text-nowrap ml-4 transition-opacity duration-500 opacity-100 font-regular`}
                        >
                          {item.label}
                        </p>
                      </div>
                      <div className="hidden group-hover:flex w-[14px] h-[14px] text-mountain-400 hover:cursor-pointer">
                        <LuStarOff />
                      </div>
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
      {/* Sidebar Footer
      <div className="bottom-2 absolute flex pl-2 w-full">
        <UserPlan expand={expand} />
      </div> */}
    </aside>
  );
};

export default Sidebar;
