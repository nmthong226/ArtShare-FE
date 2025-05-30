import React from "react";
import { Link, useLocation } from "react-router-dom";

//Icons
import { FiLogIn } from "react-icons/fi";
import { BsPen } from "react-icons/bs";
import { BiSolidCoinStack } from "react-icons/bi";

//Components
import { Skeleton } from "../ui/skeleton";

//Types
import { User } from "@/types";
import { FaBell } from "react-icons/fa6";
import PurchaseButton from "../buttons/PurchaseButton";

const UserButton: React.FC<{
  user?: User | null;
  loading?: boolean;
}> = ({ user, loading }) => {
  const location = useLocation();

  // Show a loading indicator while checking authentication
  if (loading) {
    return (
      <>
        <Skeleton className="flex justify-center items-center space-x-2 dark:bg-mountain-900 rounded-2xl w-20 xl:w-26 h-9"></Skeleton>
        <Skeleton className="flex justify-center items-center space-x-2 dark:bg-mountain-900 rounded-2xl w-20 xl:w-26 h-9"></Skeleton>
      </>
    );
  }

  // Show Sign Up and Login for non-logged-in users
  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link
          to="/signup"
          className="hidden xs:flex justify-center items-center space-x-2 border border-mountain-950 rounded-2xl w-24 xl:w-26 h-9 text-muted-foreground text-sm"
        >
          <BsPen />
          <p>Sign Up</p>
        </Link>
        <Link
          to="/login"
          className="flex justify-center items-center space-x-2 bg-mountain-950 hover:bg-mountain-600 dark:bg-mountain-200 rounded-2xl w-20 xl:w-26 h-9 text-mountain-100 dark:text-mountain-950 text-sm"
        >
          <FiLogIn />
          <p>Login</p>
        </Link>
      </div>
    );
  }

  // Show Messages and Updates for logged-in users
  return (
    <div className="flex items-center space-x-2">

      <Link
        to="/messages"
        className={`hidden xs:flex group bg-white items-center border-[0.5px] border-mountain-200 mr-2 h-8 w-8 rounded-full justify-center ${location.pathname === "/messages"
          ? "dark:text-mountain-50 text-mountain-950"
          : "dark:text-mountain-500 text-mountain-700"
          }`}>
        <FaBell />
      </Link>
      <div className="flex justify-between items-center bg-white p-[2px] border-[0.5px] border-mountain-200 rounded-full w-42 h-10">
        <div className="flex items-center space-x-1 px-2">
          <BiSolidCoinStack className="text-indigo-600" />
          <span>50</span>
        </div>
        <PurchaseButton />
      </div>
    </div>
  );
};

export default UserButton;
