import React from "react";
import { LuCheck, LuLoader, LuCloud, LuCloudOff } from "react-icons/lu";

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

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    return `${Math.floor(hours / 24)}d ago`;
  };

  const { icon, text, className } = getStatusDisplay();

  return (
    <div className={`flex items-center gap-1.5 text-sm ${className}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
};
