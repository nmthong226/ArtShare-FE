import { Dispatch, SetStateAction, useState } from "react";

//Icons
import { FaArrowLeftLong } from "react-icons/fa6";
import { CircularProgress, Tooltip } from "@mui/material";
import { Check, InfoIcon, X } from "lucide-react";
import { MdLockOutline } from "react-icons/md";
import { AiOutlineSave } from "react-icons/ai";
//Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/header/user-button";
import UserInAppConfigs from "@/components/popovers/UserInAppConfigs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
//Context
import { useUser } from "@/contexts/UserProvider";
import { Link } from "react-router-dom";
import { BsGlobe2 } from "react-icons/bs";
import { FaCog } from "react-icons/fa";

interface TextEditorHeader {
  documentTitle: string;
  isPublished: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isToggling: boolean;
  isTitleValid: boolean;
  isContentValid: boolean;
  canPublish: boolean;
  onValidatePublish: () => boolean;
  setDocumentTitle: Dispatch<SetStateAction<string>>;
  handleSaveDocument: () => void;
  handleSetDocumentPublish: () => void;
}

const TextEditorHeader: React.FC<TextEditorHeader> = ({
  documentTitle,
  isPublished,
  isLoading,
  isSaving,
  isTitleValid,
  isContentValid,
  setDocumentTitle,
  handleSaveDocument,
  onValidatePublish,
  handleSetDocumentPublish,
}) => {
  const { user, loading } = useUser();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const baseWidth = 300;
  const maxWidth = 600;

  const dynamicWidth = Math.min(
    baseWidth + Math.max(0, (documentTitle.length - 36) * 8),
    maxWidth,
  );

  const handleOpenConfirm = () => {
    requestAnimationFrame(() => {
      onValidatePublish();
      setConfirmOpen(true);
    });
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  const handlePublishConfirmed = () => {
    setConfirmOpen(false);
    handleSetDocumentPublish();
  };

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
      <div className="top-1/2 left-1/2 absolute flex justify-between items-center space-x-2 w-[720px] -translate-x-1/2 -translate-y-1/2">
        {isLoading ? (
          <div
            className="bg-white/60 rounded-full h-12 animate-pulse"
            style={{ width: `${dynamicWidth}px` }}
          />
        ) : (
          <Input
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            style={{ width: `${dynamicWidth}px` }}
            className="flex bg-white/60 px-4 rounded-full h-12 placeholder:text-mountain-600 transition-all duration-300 ease-in-out"
            placeholder="Name Your Document Here..."
          />
        )}
        <div className="flex space-x-2">
          <Button
            type="submit"
            onClick={handleSaveDocument}
            disabled={isSaving}
            className="flex justify-center items-center bg-white hover:bg-mountain-50 border border-mountain-200 rounded-full w-32 h-12 text-mountain-950 cursor-pointer"
          >
            {isSaving ? (
              <>
                <CircularProgress size={8} />
                <p>Saving...</p>
              </>
            ) : (
              <>
                <AiOutlineSave className="size-5" />
                <p>Save</p>
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={handleOpenConfirm}
            className="flex justify-center items-center bg-indigo-200/80 hover:bg-indigo-200/60 border border-mountain-200 rounded-full w-48 h-12 text-mountain-950 cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <CircularProgress size={8} />
                <p>Loading...</p>
              </div>
            ) : isPublished ? (
              <div className="flex items-center space-x-2">
                <BsGlobe2 className="size-5" />
                <p>Currently Published</p>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <MdLockOutline className="size-5" />
                <p>Publish as Blog</p>
              </div>
            )}
          </Button>
        </div>
      </div>
      <div className={`flex items-center h-full`}>
        <UserButton user={user!} loading={loading!} />
        <UserInAppConfigs />
      </div>
      <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle className="flex items-center space-x-2">
          <BsGlobe2 />
          <p>Publish This Document As Blog</p>
        </DialogTitle>
        <DialogContent className="flex flex-col space-y-2">
          <p className="text-mountain-600">
            This will make your document publicly available in the blog section
            for others to read. Ready to publish?
          </p>
          <div className="flex flex-col space-y-4 bg-mountain-50 p-4 w-full">
            <div className="flex items-center space-x-2">
              <p>The document has title</p>
              {isTitleValid ? <Check /> : <X className="text-red-600" />}
            </div>
            <hr className="w-full" />
            <div className="flex items-center space-x-2">
              <p>The document's content is larger than 100 words</p>
              {isContentValid ? <Check /> : <X className="text-red-600" />}
            </div>
          </div>
        </DialogContent>
        <DialogActions className="flex justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button className="bg-mountain-50 hover:bg-mountain-100/80 text-mountain-950 cursor-pointer">
              <FaCog className="size-5 text-mountain-600" />
            </Button>
            <Button className="bg-indigo-100 hover:bg-indigo-100/80 text-mountain-950 cursor-pointer">
              <p>Help</p>
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleCloseConfirm}
              className="bg-mountain-200 hover:bg-mountain-200/80 text-mountain-950"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePublishConfirmed}
              autoFocus
              className="bg-indigo-600 hover:bg-indigo-600/80 cursor-pointer"
              disabled={!onValidatePublish()}
            >
              Publish as Blog
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </nav>
  );
};

export default TextEditorHeader;
