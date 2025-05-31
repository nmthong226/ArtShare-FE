import { useEffect, useRef, useState } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

//Icons
import { TiDeleteOutline } from "react-icons/ti";
import { FiSearch } from "react-icons/fi";
import { InfoIcon } from "lucide-react";

//Components
import Tooltip from "@mui/material/Tooltip";
import UserInAppConfigs from "../popovers/UserInAppConfigs";
import { Input } from "../ui/input";
import UserButton from "./user-button";

//Context
import { useSearch } from "@/contexts/SearchProvider";
import { useUser } from "@/contexts/UserProvider";
import { routesForHeaders } from "@/utils/constants";

const Header: React.FC = () => {
  const { user, loading } = useUser();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    console.log("Query updated:", query);
  }, [query]);

  const matchedRoute = routesForHeaders.find((route) =>
    matchPath({ path: route.path, end: true }, location.pathname),
  );

  return (
    <nav
      className={`top-0 z-50 sticky px-4 flex justify-between items-center dark:bg-mountain-950 dark:border-b-mountain-700 w-full h-16`}
    >
      <div className="flex items-center h-full">
        <div className="flex items-center h-full">
          <div className="flex items-center space-x-2">
            <span className="flex font-medium text-lg select-none">
              {matchedRoute?.label || ""}
            </span>
            <Tooltip title={matchedRoute?.description || ""}>
              <InfoIcon className="size-4" />
            </Tooltip>
          </div>
          <div
            className={`hidden top-1/2 left-1/2 absolute lg:flex items-center dark:bg-mountain-1000 
                            rounded-2xl h-10 text-neutral-700 focus-within:text-mountain-950 dark:focus-within:text-mountain-50 
                            dark:text-neutral-300 -translate-x-1/2 -translate-y-1/2 
                            transition-all duration-300 ease-in-out 
                            ${isFocused ? "w-144" : "w-108"}`}
          >
            <FiSearch className="left-2 absolute w-5 h-5" />
            <Input
              ref={inputRef}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="bg-white shadow-inner pr-8 pl-8 rounded-2xl w-full"
              placeholder="Search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setInputValue("");
                  setQuery(inputValue);
                  inputRef.current?.blur();
                  navigate(`/search?q=${inputValue}`);
                }
              }}
            />
            <TiDeleteOutline
              className={`right-2 text-mountain-600 absolute w-5 h-5 ${inputValue.length <= 0 ? "hidden" : "flex"}`}
              onClick={() => {
                setInputValue("");
                setQuery("");
              }}
            />
          </div>
          <div className="lg:hidden flex items-center border-white dark:border-mountain-950 border-b-4 h-full">
            <div className="hidden md:flex items-center space-x-1:lg:space-x-2 hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg text-mountain-500 hover:text-mountain-800 dark:hover:text-mountain-50 hover:cursor-pointer lg">
              <FiSearch className="w-6 h-6" />
              <p className="text-sm">Search</p>
            </div>
          </div>
        </div>
      </div>
      <div className={`flex items-center h-full space-x-2`}>
        <UserButton user={user!} loading={loading!} />
        <UserInAppConfigs />
      </div>
    </nav>
  );
};

export default Header;
