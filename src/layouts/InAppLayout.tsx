// Core
import React, { useState } from "react";

// Components
import Sidebar from "@/components/sidebar/app-sidebar";
import Header from "@/components/header/app-header";

const InAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expandSideBar, setExpandSideBar] = useState(true);
  return (
    <div className={`relative flex flex-row w-full h-full`}>
      <Sidebar expand={expandSideBar} setExpand={setExpandSideBar} />
      <div
        className={`flex flex-col z-50 flex-1 flex-shrink px-2 w-[calc(100vw-16rem)] h-full`}
      >
        <Header />
        <div className="bg-white shadow-[-4px_-4px_16px_rgba(0,0,0,0.12)] rounded-t-3xl h-full transition-shadow duration-300 dark:bg-mountain-1000">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InAppLayout;
