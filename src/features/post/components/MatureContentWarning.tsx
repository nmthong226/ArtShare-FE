// src/components/MatureContentWarning.tsx (or wherever you keep components)
import { Button } from "@mui/material";
import React from "react";

interface MatureContentWarningProps {
  onShow: () => void;
}

const MatureContentWarning: React.FC<MatureContentWarningProps> = ({
  onShow,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center bg-white md:shadow rounded-2xl">
      <h3 className="mb-2 text-4xl font-extrabold ">Mature Content</h3>
      <p className="mb-1 text-gray-700">
        This content is for mature audiences only.
      </p>
      <p className="mb-4 text-gray-700">User discretion advised.</p>
      <Button variant="contained" onClick={onShow}>Show me the artwork</Button>
    </div>
  );
};

export default MatureContentWarning;
