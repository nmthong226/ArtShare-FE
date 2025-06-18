import React from "react";
import { LuCheck, LuLoader, LuCloud, LuCloudOff } from "react-icons/lu";
import { formatTimeAgo } from "@/lib/utils";

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

interface AutoSaveStatusProps {
  status: SaveStatus;
  lastSaved?: Date;
}

export const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({
  status,
  lastSaved,
}) => {
  const getStatusDisplay = () => {
    switch (status) {
      case "saved":
        return {
          icon: <LuCheck className="w-4 h-4" />,
          text: lastSaved ? `Saved ${formatTimeAgo(lastSaved)}` : "Saved",
          className: "text-green-600",
        };
      case "saving":
        return {
          icon: <LuLoader className="w-4 h-4 animate-spin" />,
          text: "Saving...",
          className: "text-blue-600",
        };
      case "unsaved":
        return {
          icon: <LuCloud className="w-4 h-4" />,
          text: "Unsaved changes",
          className: "text-gray-600",
        };
      case "error":
        return {
          icon: <LuCloudOff className="w-4 h-4" />,
          text: "Error saving",
          className: "text-red-600",
        };
    }
  };

  const { icon, text, className } = getStatusDisplay();

  return (
    <div className={`flex items-center gap-1.5 text-sm ${className}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
};
