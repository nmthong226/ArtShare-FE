//Icons
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ChevronDownIcon,
  HighlighterIcon,
  ImageIcon,
  ItalicIcon,
  Link2Icon,
  ListCollapseIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodo,
  LucideIcon,
  MessageSquarePlusIcon,
  MinusIcon,
  PlusIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SearchIcon,
  SpellCheck,
  Underline,
  Undo2Icon,
  UploadIcon,
} from "lucide-react";
import { AiOutlineYoutube } from "react-icons/ai";

//Components
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

//Stores
import { useEditorStore } from "../stores/use-editor-store";

//Ultils
import { cn } from "@/lib/utils";
import { ColorResult, CirclePicker } from "react-color";
import { Level } from "@tiptap/extension-heading";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Tooltip } from "@mui/material";
import { useWritingMediaUploader } from "../hooks/use-writing-medias-uploader";

const LineHeightButton = () => {
  const { editor } = useEditorStore();

  const lineHeights = [
    {
      label: "Default",
      value: "normal",
    },
    {
      label: "Single",
      value: "1",
    },
    {
      label: "1.15",
      value: "1.15",
    },
    {
      label: "1.5",
      value: "1.5",
    },
    {
      label: "Double",
      value: "2.0",
    },
  ];
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 shrink-0 items-center flex-col flex justify-center rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 px-1.5 overflow-hidden text-sm text-gray-900 dark:text-gray-100",
          )}
        >
          <ListCollapseIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-x-2 gap-y-1 mt-2 p-0 border-1 border-mountain-200 dark:border-mountain-600 overflow-hidden bg-white dark:bg-mountain-800">
        {lineHeights.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => editor?.chain().focus().setLineHeight(value).run()}
            className={cn(
              "h-7 min-w-7 shrink-0 items-center flex space-x-2 rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 px-1.5 overflow-hidden text-sm text-gray-900 dark:text-gray-100",
              editor?.getAttributes("paragraph").lineHeight === value &&
                "bg-mountain-100/80 dark:bg-mountain-700/80",
            )}
          >
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FontSizeButton = () => {
  const { editor } = useEditorStore();

  const currentFontSize = editor?.getAttributes("textStyle").fontSize
    ? editor?.getAttributes("textStyle").fontSize.replace("px", "")
    : "16";

  const [fontSize, setFontSize] = useState(currentFontSize);
  const [inputValue, setInputValue] = useState(fontSize);
  const [isEditing, setIsEditing] = useState(false);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);
    if (!isNaN(size) && size > 0) {
      editor?.chain().focus().setFontSize(`${size}px`).run();
      setFontSize(newSize);
      setInputValue(newSize);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    updateFontSize(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const increment = () => {
    const newSize = parseInt(fontSize) + 1;
    updateFontSize(newSize.toString());
  };

  const decrement = () => {
    const newSize = parseInt(fontSize) - 1;
    if (newSize > 0) updateFontSize(newSize.toString());
  };

  return (
    <div className="flex items-center gap-x-0.5">
      <button
        onClick={decrement}
        className="flex flex-col justify-center items-center hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 rounded-sm w-7 h-7 shrink-0 text-gray-900 dark:text-gray-100"
      >
        <MinusIcon className="size-4" />
      </button>
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="bg-transparent border border-mountain-100 dark:border-mountain-600 rounded-sm focus:outline-none focus:ring-0 w-10 h-7 text-sm text-center cursor-text text-gray-900 dark:text-gray-100"
        />
      ) : (
        <button
          onClick={() => {
            setIsEditing(true);
            setFontSize(currentFontSize);
          }}
          className="bg-transparent border border-mountain-100 dark:border-mountain-600 rounded-sm w-10 h-7 text-sm text-center cursor-text text-gray-900 dark:text-gray-100"
        >
          {currentFontSize}
        </button>
      )}
      <button
        onClick={increment}
        className="flex flex-col justify-center items-center hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 rounded-sm w-7 h-7 shrink-0 text-gray-900 dark:text-gray-100"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};

const ListButton = () => {
  const { editor } = useEditorStore();

  const lists = [
    {
      label: "Bullet List",
      icon: ListIcon,
      isActive: () => editor?.isActive("bulletList"),
      onClick: () => {
        const check = editor?.chain().focus().toggleBulletList().run();
        console.log("Bullet List toggled:", check);
      },
    },
    {
      label: "Ordered List",
      icon: ListOrderedIcon,
      isActive: () => editor?.isActive("orderList"),
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 shrink-0 items-center flex-col flex justify-center rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 px-1.5 overflow-hidden text-sm text-gray-900 dark:text-gray-100",
          )}
        >
          <ListIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-x-2 gap-y-1 mt-2 p-0 border-1 border-mountain-200 dark:border-mountain-600 overflow-hidden bg-white dark:bg-mountain-800">
        {lists.map(({ label, icon: Icon, onClick, isActive }) => (
          <button
            key={label}
            onClick={onClick}
            className={cn(
              "h-7 min-w-7 shrink-0 items-center flex space-x-2 rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 px-1.5 overflow-hidden text-sm text-gray-900 dark:text-gray-100",
              isActive() && "bg-mountain-100/80 dark:bg-mountain-700/80",
            )}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AlignButton = () => {
  const { editor } = useEditorStore();

  const alignments = [
    {
      label: "Align Left",
      value: "left",
      icon: AlignLeftIcon,
    },
    {
      label: "Align Center",
      value: "center",
      icon: AlignCenterIcon,
    },
    {
      label: "Align Right",
      value: "right",
      icon: AlignRightIcon,
    },
    {
      label: "Align Justify",
      value: "justify",
      icon: AlignJustifyIcon,
    },
  ];
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 shrink-0 items-center flex-col flex justify-center rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 px-1.5 overflow-hidden text-sm text-gray-900 dark:text-gray-100",
          )}
        >
          <AlignLeftIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-x-2 gap-y-1 mt-2 p-0 border-1 border-mountain-200 dark:border-mountain-600 overflow-hidden bg-white dark:bg-mountain-800">
        {alignments.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => editor?.chain().focus().setTextAlign(value).run()}
            className={cn(
              "h-7 min-w-7 shrink-0 items-center flex space-x-2 rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 px-1.5 overflow-hidden text-sm text-gray-900 dark:text-gray-100",
            )}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const YoutubeButton = () => {
  const { editor } = useEditorStore();
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [height] = useState(480);
  const [width] = useState(640);

  const addYoutubeVideo = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation?.();
    if (videoUrl) {
      editor?.commands.setYoutubeVideo({
        src: videoUrl,
        width: Math.max(320, parseInt(width.toString(), 10)) || 640,
        height: Math.max(180, parseInt(height.toString(), 10)) || 480,
      });
      setIsVideoDialogOpen(false);
      setVideoUrl("");
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "h-7 min-w-7 shrink-0 items-center flex-col flex justify-center rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 px-1.5 overflow-hidden text-sm text-gray-900 dark:text-gray-100",
            )}
          >
            <AiOutlineYoutube className="size-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col gap-y-1 mt-2 p-2.5 border border-mountain-200 dark:border-mountain-600 bg-white dark:bg-mountain-800">
          <DropdownMenuItem
            onClick={() => setIsVideoDialogOpen(true)}
            className="text-gray-900 dark:text-gray-100 hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80"
          >
            <SearchIcon className="mr-2 size-4" />
            Paste Youtube URL
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={isVideoDialogOpen}
        onOpenChange={setIsVideoDialogOpen}
        modal={false}
      >
        <DialogContent className="bg-white dark:bg-mountain-800 border-gray-200 dark:border-mountain-600">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Insert Youtube Embedded Link
            </DialogTitle>
          </DialogHeader>
          <Input
            placeholder="https://youtube.com/example"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addYoutubeVideo(e);
              }
            }}
            className="placeholder:text-mountain-400 dark:placeholder:text-mountain-500 bg-white dark:bg-mountain-700 border-gray-300 dark:border-mountain-600 text-gray-900 dark:text-gray-100"
          />
          <DialogFooter>
            <Button
              onClick={addYoutubeVideo}
              className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white"
            >
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ImageButton = () => {
  const { editor } = useEditorStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const { handleUploadImageFile } = useWritingMediaUploader();

  const insertImage = (src: string) => {
    if (src) {
      editor?.chain().focus().setImage({ src }).run();
    }
  };

  const onUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageS3Url = await handleUploadImageFile(file, "blog");
        if (imageS3Url) {
          insertImage(imageS3Url);
        }
      }
    };
    input.click();
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl.trim()) {
      insertImage(imageUrl.trim());
      setImageUrl("");
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "h-7 min-w-7 shrink-0 items-center flex-col flex justify-center rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 px-1.5 overflow-hidden text-sm text-gray-900 dark:text-gray-100",
            )}
          >
            <ImageIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col gap-y-1 mt-2 p-2.5 border border-mountain-200 dark:border-mountain-600 bg-white dark:bg-mountain-800">
          <DropdownMenuItem
            onClick={onUpload}
            className="text-gray-900 dark:text-gray-100 hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80"
          >
            <UploadIcon className="mr-2 size-4" />
            Upload
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDialogOpen(true)}
            className="text-gray-900 dark:text-gray-100 hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80"
          >
            <SearchIcon className="mr-2 size-4" />
            Paste image URL
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={false}>
        <DialogContent className="bg-white dark:bg-mountain-800 border-gray-200 dark:border-mountain-600">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Insert Image URL
            </DialogTitle>
          </DialogHeader>
          <Input
            placeholder="https://example.com/image.png"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleImageUrlSubmit();
              }
            }}
            className="placeholder:text-mountain-400 dark:placeholder:text-mountain-500 bg-white dark:bg-mountain-700 border-gray-300 dark:border-mountain-600 text-gray-900 dark:text-gray-100"
          />
          <DialogFooter>
            <Button
              onClick={handleImageUrlSubmit}
              className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white"
            >
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const LinkButon = () => {
  const { editor } = useEditorStore();
  const [value, setValue] = useState(editor?.getAttributes("link").href || "");

  const onChange = (href: string) => {
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setValue("");
  };
  return (
    <DropdownMenu
      modal={false}
      onOpenChange={(open) => {
        if (open) {
          setValue(editor?.getAttributes("link").href || "");
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 shrink-0 items-center flex-col flex justify-center rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 px-1.5 overflow-hidden text-sm text-gray-900 dark:text-gray-100",
          )}
        >
          <Link2Icon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex gap-x-2 mt-2 p-2.5 border-1 border-mountain-200 dark:border-mountain-600 overflow-hidden bg-white dark:bg-mountain-800">
        <Input
          placeholder="https://example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="placeholder:text-mountain-400 dark:placeholder:text-mountain-500 line-clamp-1 bg-white dark:bg-mountain-700 border-gray-300 dark:border-mountain-600 text-gray-900 dark:text-gray-100"
        />
        <Button
          onClick={() => onChange(value)}
          className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white"
        >
          Apply
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HighLightColorButton = () => {
  const { editor } = useEditorStore();

  const value = editor?.getAttributes("highlight").color || "#FFFFFF";

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setHighlight({ color: color.hex }).run();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 shrink-0 items-center flex-col flex justify-center rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 px-1.5 overflow-hidden text-sm text-gray-900 dark:text-gray-100",
          )}
        >
          <HighlighterIcon className="size-4" />
          <div
            className="mt-0.5 w-full h-0.5"
            style={{ backgroundColor: value }}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 p-2.5 border-1 border-mountain-200 dark:border-mountain-600 overflow-hidden bg-white dark:bg-mountain-800">
        <CirclePicker onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TextColorButton = () => {
  const { editor } = useEditorStore();
  const value = editor?.getAttributes("textStyle").color || "#000000";

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setColor(color.hex).run();
  };
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 shrink-0 items-center flex-col flex justify-center rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 px-1.5 overflow-hidden text-sm text-gray-900 dark:text-gray-100",
          )}
        >
          <span className="text-sm">A</span>
          <div className="w-full h-0.5" style={{ backgroundColor: value }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 p-2.5 border-1 border-mountain-200 dark:border-mountain-600 overflow-hidden bg-white dark:bg-mountain-800">
        <CirclePicker color={value} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HeadingLevelButton = () => {
  const { editor } = useEditorStore();
  const headings = [
    { label: "Heading 1", value: 1, fontSize: "32px" },
    { label: "Heading 2", value: 2, fontSize: "24px" },
    { label: "Heading 3", value: 3, fontSize: "20px" },
    { label: "Heading 4", value: 3, fontSize: "18px" },
    { label: "Heading 5", value: 3, fontSize: "16px" },
    { label: "Normal text", value: 0, fontSize: "16px" },
  ];
  const getCurrentHeading = () => {
    for (let level = 1; level <= 5; level++) {
      if (editor?.isActive("heading", { level })) {
        return `Heading ${level}`;
      }
    }
    return "Normal text";
  };
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 shrink-0 items-center flex justify-between rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 px-1.5 overflow-hidden text-sm text-gray-900 dark:text-gray-100",
          )}
        >
          <span className="truncate">{getCurrentHeading()}</span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-y-1 mt-2 p-1 border-mountain-200 dark:border-mountain-600 bg-white dark:bg-mountain-800">
        {headings.map(({ label, value, fontSize }) => (
          <button
            onClick={() => {
              if (value === 0) {
                editor?.chain().focus().setParagraph().run();
              } else {
                editor
                  ?.chain()
                  .focus()
                  .toggleHeading({ level: value as Level })
                  .run();
              }
            }}
            key={value}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 text-gray-900 dark:text-gray-100",
              (value === 0 && !editor?.isActive("heading")) ||
                (editor?.isActive("heading", { level: value }) &&
                  "bg-mountain-100/80 dark:bg-mountain-700/80"),
            )}
            style={{ fontSize }}
          >
            {label}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FontFamilyButton = () => {
  const { editor } = useEditorStore();
  const fonts = [
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
  ];
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <button
          className={cn(
            "h-7 w-[120px] shrink-0 items-center flex justify-between rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 px-1.5 overflow-hidden text-sm text-gray-900 dark:text-gray-100",
          )}
        >
          <span className="truncate">
            {editor?.getAttributes("textStyle").fontFamily || "Arial"}
          </span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-y-1 p-1 border-mountain-200 dark:border-mountain-600 bg-white dark:bg-mountain-800">
        {fonts.map((font, value) => (
          <DropdownMenuItem
            onClick={() =>
              editor?.chain().focus().setFontFamily(font.value).run()
            }
            key={value}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 text-gray-900 dark:text-gray-100",
              editor?.getAttributes("textStyle").fontFamily === value &&
                "bg-mountain-100/80 dark:bg-mountain-700/80",
            )}
            style={{ fontFamily: font.value }}
          >
            <span className="text-sm">{font.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface ToolbarButtonProps {
  label: string;
  shortcut: string;
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
}

const ToolbarButton = ({
  label,
  shortcut,
  onClick,
  isActive,
  icon: Icon,
}: ToolbarButtonProps) => {
  return (
    <Tooltip title={label + ` (${shortcut})`} arrow placement="bottom">
      <button
        onClick={onClick}
        className={cn(
          "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-mountain-100/80 dark:hover:bg-mountain-700/80 text-gray-900 dark:text-gray-100",
          isActive && "bg-mountain-100/80 dark:bg-mountain-700/80",
        )}
      >
        <Icon className="size-4" />
      </button>
    </Tooltip>
  );
};

const Toolbar = () => {
  const { editor } = useEditorStore();

  const sections: {
    label: string;
    shortcut: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
  }[][] = [
    [
      {
        label: "Undo",
        shortcut: "Crl + Z",
        icon: Undo2Icon,
        onClick: () => editor?.chain().focus().undo().run(),
      },
      {
        label: "Redo",
        shortcut: "Crl + Y",
        icon: Redo2Icon,
        onClick: () => editor?.chain().focus().redo().run(),
      },
      {
        label: "Print",
        shortcut: "Crl + P",
        icon: PrinterIcon,
        onClick: () => window.print(),
      },
      {
        label: "Spell Check",
        shortcut: "Crl + Alt + X",
        icon: SpellCheck,
        onClick: () => {
          const current = editor?.view.dom.getAttribute("spellcheck");
          editor?.view.dom.setAttribute(
            "spellcheck",
            current === "false" ? "true" : "false",
          );
        },
      },
    ],
    [
      {
        label: "Bold",
        shortcut: "Crl + B",
        icon: BoldIcon,
        isActive: editor?.isActive("bold"),
        onClick: () => editor?.chain().focus().toggleBold().run(),
      },
      {
        label: "Italic",
        shortcut: "Crl + I",
        icon: ItalicIcon,
        isActive: editor?.isActive("italic"),
        onClick: () => editor?.chain().focus().toggleItalic().run(),
      },
      {
        label: "Underline",
        shortcut: "Crl + U",
        icon: Underline,
        isActive: editor?.isActive("underline"),
        onClick: () => editor?.chain().focus().toggleUnderline().run(),
      },
    ],
    [
      {
        label: "List Todo",
        shortcut: "Crl + Shift + 9",
        icon: ListTodo,
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
        isActive: editor?.isActive("taskList"),
      },
      {
        label: "Remove Formatting",
        shortcut: "Crl + /",
        icon: RemoveFormattingIcon,
        onClick: () => editor?.chain().focus().unsetAllMarks().run(),
      },
      {
        label: "Comment",
        shortcut: "Crl + Shift + P",
        icon: MessageSquarePlusIcon,
        onClick: () => console.log("TODO: comment"),
        isActive: false,
      },
    ],
  ];

  return (
    <div className="top-16 z-20 sticky flex justify-center items-center gap-x-0.5 bg-white dark:bg-mountain-800 shadow-md px-2.5 py-0.5 border-1 border-mountain-200 dark:border-mountain-600 border-r-1 min-h-[48px] overflow-x-auto">
      {sections[0].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <Separator
        orientation="vertical"
        className="bg-mountain-100 dark:bg-mountain-600 h-6"
      />
      {sections[1].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <Separator
        orientation="vertical"
        className="bg-mountain-100 dark:bg-mountain-600 h-6"
      />
      <HeadingLevelButton />
      <Separator
        orientation="vertical"
        className="bg-mountain-100 dark:bg-mountain-600 h-6"
      />
      <FontFamilyButton />
      <Separator
        orientation="vertical"
        className="bg-mountain-100 dark:bg-mountain-600 h-6"
      />
      <FontSizeButton />
      <Separator
        orientation="vertical"
        className="bg-mountain-100 dark:bg-mountain-600 h-6"
      />
      <TextColorButton />
      <HighLightColorButton />
      <Separator
        orientation="vertical"
        className="bg-mountain-100 dark:bg-mountain-600 h-6"
      />
      <AlignButton />
      <LineHeightButton />
      <ListButton />
      <LinkButon />
      <ImageButton />
      <YoutubeButton />
      {sections[2].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
    </div>
  );
};

export default Toolbar;
