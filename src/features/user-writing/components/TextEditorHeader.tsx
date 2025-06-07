//Icons
import { FaArrowLeftLong, FaEye } from "react-icons/fa6";
import { Tooltip } from "@mui/material";
import { InfoIcon } from "lucide-react";
import { MdCheckCircle, MdLockOutline } from "react-icons/md";
import { AiOutlineSave } from "react-icons/ai";
//Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/header/user-button";
import UserInAppConfigs from "@/components/popovers/UserInAppConfigs";
//Context
import { useUser } from "@/contexts/UserProvider";
import { Link, useNavigate, useParams } from "react-router-dom";

interface TextEditorHeaderProps {
  handleExport: () => void;
  handleSaveBlog: (blogName: string) => void;
  text: string;
  setText: (text: string) => void;
  isPublished: boolean;
  tooltipOpen: boolean;
  saveStatus?: React.ReactNode;
}

const TextEditorHeader: React.FC<TextEditorHeaderProps> = ({
  handleExport,
  handleSaveBlog,
  text,
  setText,
  isPublished,
  tooltipOpen,
  saveStatus,
}) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const { blogId } = useParams<{ blogId: string }>();

  const baseWidth = 300;
  const maxWidth = 600;

  const dynamicWidth = Math.min(
    baseWidth + Math.max(0, (text.length - 36) * 8),
    maxWidth,
  );

  const handlePreview = () => {
    if (blogId && blogId !== "new") {
      navigate(`/blogs/${blogId}`);
    }
  };

  return (
    <nav
      className={`
        top-0 z-50 sticky w-full h-16 px-4
        flex items-center justify-between gap-4
        bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-50
        dark:bg-gradient-to-r dark:from-mountain-900 dark:via-mountain-800 dark:to-mountain-900
        border-b-1 border-b-mountain-100 dark:border-b-mountain-700
      `}
    >
      {/* ===== Left Section ===== */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Link
          to="/docs"
          className="flex justify-center items-center hover:bg-mountain-50 dark:hover:bg-mountain-700 p-2 rounded-lg transition-colors"
        >
          <FaArrowLeftLong className="size-5 text-mountain-600 dark:text-mountain-300" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-medium text-lg whitespace-nowrap text-gray-900 dark:text-gray-100">
            My Writing
          </span>
          <Tooltip
            title={"Share your experience through characters, paragraphs..."}
          >
            <InfoIcon className="size-4 text-mountain-600 dark:text-mountain-300" />
          </Tooltip>
        </div>
      </div>

      {/* ===== Center Section ===== */}
      <div className="flex-grow flex items-center justify-center gap-4">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: `${dynamicWidth}px` }}
          className="
            flex-shrink
            bg-white/60 dark:bg-mountain-800/80 px-4 rounded-full h-12
            border border-gray-200 dark:border-mountain-600
            text-gray-900 dark:text-gray-100
            placeholder:text-mountain-600 dark:placeholder:text-mountain-400
            focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            transition-all duration-300 ease-in-out"
          placeholder="Name Your Document Here..."
        />
        {saveStatus && <div className="flex-shrink-0">{saveStatus}</div>}
      </div>

      {/* ===== Right Section ===== */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Tooltip
          title={
            blogId === "new" ? "Save document first to preview" : "Preview blog"
          }
        >
          <div>
            <Button
              onClick={handlePreview}
              variant="outline"
              size="icon"
              disabled={blogId === "new"}
              className="
                bg-white/60 dark:bg-mountain-700/80 
                hover:bg-white/90 dark:hover:bg-mountain-600/90 
                border-gray-300 dark:border-mountain-600
                rounded-full h-9 w-9
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              "
            >
              <FaEye className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </Tooltip>

        <Button
          onClick={() => handleSaveBlog(text)}
          className="
            bg-green-600 dark:bg-green-700 shadow hover:brightness-95
            border border-emerald-700 dark:border-emerald-800 rounded-full
            h-9 px-4 font-medium text-white
            flex items-center gap-2
            hover:bg-green-700 dark:hover:bg-green-800
            transition-colors
          "
        >
          <AiOutlineSave className="h-4 w-4" />
          <span className="whitespace-nowrap">
            {isPublished ? "Save and publish" : "Publish"}
          </span>
        </Button>

        <Button
          type="submit"
          onClick={handleExport}
          disabled={!isPublished}
          className="
            bg-indigo-400 dark:bg-indigo-600 shadow hover:brightness-95
            border border-mountain-400 dark:border-indigo-700 rounded-full
            w-36 h-9 font-medium text-white
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
            hover:bg-indigo-500 dark:hover:bg-indigo-700
            transition-colors
          "
        >
          {tooltipOpen && isPublished ? (
            <>
              <span>Link copied!</span>
              <MdCheckCircle />
            </>
          ) : (
            <>
              <MdLockOutline />
              <span>Share blog</span>
            </>
          )}
        </Button>

        <div className="flex items-center">
          <UserButton user={user!} loading={loading!} />
          <UserInAppConfigs />
        </div>
      </div>
    </nav>
  );
};

export default TextEditorHeader;
