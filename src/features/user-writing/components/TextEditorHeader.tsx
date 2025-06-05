//Icons
import { FaArrowLeftLong } from "react-icons/fa6";
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
import { Link } from "react-router-dom";

interface TextEditorHeader {
  handleExport: () => void;
  handleSaveBlog: (blogName: string) => void;
  text: string;
  setText: (text: string) => void;
  isPublished: boolean;
  tooltipOpen: boolean;
}

const TextEditorHeader: React.FC<TextEditorHeader> = ({
  handleExport,
  handleSaveBlog,
  text,
  setText,
  isPublished,
  tooltipOpen,
}) => {
  const { user, loading } = useUser();

  const baseWidth = 300;
  const maxWidth = 600;

  const dynamicWidth = Math.min(
    baseWidth + Math.max(0, (text.length - 36) * 8),
    maxWidth,
  );
  return (
    <nav
      className={`top-0 z-50 sticky px-4 flex justify-between items-center bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-50 dark:bg-mountain-950 border-b-1 border-b-mountain-100 dark:border-b-mountain-700 w-full h-16`}
    >
      <div className="flex items-center h-full">
        <Link
          to="/docs"
          className="flex justify-center items-center hover:bg-mountain-50 mr-4 p-2 rounded-lg"
        >
          <FaArrowLeftLong className="size-5 text-mountain-600" />
        </Link>
        <div className="flex items-center space-x-2">
          <span className="flex font-medium text-lg">My Documents</span>
          <Tooltip
            title={"Share your exprience through characters, paragraphs..."}
          >
            <InfoIcon className="size-4" />
          </Tooltip>
        </div>
      </div>
      <div className="top-1/2 left-1/2 absolute flex justify-between items-center space-x-2 w-[600px] -translate-x-1/2 -translate-y-1/2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: `${dynamicWidth}px` }}
          className="flex bg-white/60 px-4 rounded-full h-12 placeholder:text-mountain-600 transition-all duration-300 ease-in-out"
          placeholder="Name Your Document Here..."
        />
        <div className="flex space-x-2">
          <Button
            onClick={() => handleSaveBlog(text)}
            className="bg-green-600 shadow hover:brightness-95 border border-emerald-700 rounded-full h-9 px-4 font-medium text-white" // Changed background: from-emerald-500 to-green-600
            // Changed border: border-emerald-700 (to match the new gradient)
          >
            <AiOutlineSave className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>{isPublished ? "Save and publish" : "Publish"}</span>
          </Button>
          <Button
            type="submit"
            onClick={handleExport}
            disabled={!isPublished} // Disable if not published
            className="bg-indigo-400 shadow hover:brightness-95 border border-mountain-400 rounded-full w-36 h-9 font-medium text-white hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles
          >
            {tooltipOpen && isPublished ? ( // Show "Link copied" only if published and tooltip is open
              <>
                <p>Link copied!</p>
                <MdCheckCircle style={{ marginRight: "8px" }} />
              </>
            ) : (
              <>
                <MdLockOutline style={{ marginRight: "8px" }} />
                <p>Share blog</p>
              </>
            )}
          </Button>
        </div>
      </div>
      <div className={`flex items-center h-full`}>
        <UserButton user={user!} loading={loading!} />
        <UserInAppConfigs />
      </div>
    </nav>
  );
};

export default TextEditorHeader;
