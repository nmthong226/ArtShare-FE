import { memo, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import { useSearch } from "@/contexts/SearchProvider";
import { Input } from "@/components/ui/input";
import { Box, Tab, Tabs } from "@mui/material";
import { a11yProps } from "@/components/TabPanel/util";
import TabPanel from "@/components/TabPanel";
import PostSearch from "./components/PostSearch";
import { UserSearch } from "lucide-react";

const Search = () => {
  const { query, setQuery } = useSearch();
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<SearchTabValue>("posts");
  const [searchParams, setSearchParams] = useSearchParams();

  const finalQuery = query || searchParams.get("q");

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    setInputValue(q);
  }, [searchParams, setQuery]);

  const handleChangeTab = (
    _: React.SyntheticEvent,
    newValue: SearchTabValue,
  ) => {
    console.log("Tab changed to:", newValue);
    setTab(newValue);
    setQuery("");
    setInputValue("");
    setSearchParams({ q: "" });
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center justify-end w-full pt-8 space-x-4 space-y-2 bg-white border-mountain-100 dark:bg-mountain-950 dark:border-mountain-800 border-b-1 h-fit">
        <p className="inline-block text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Seek
        </p>
        <div className="flex items-center justify-center mb-6">
          <div className="relative flex items-center bg-mountain-50 dark:bg-mountain-900 rounded-2xl w-168 h-14 text-neutral-700 focus-within:text-mountain-950 dark:focus-within:text-mountain-50 dark:text-neutral-300">
            <FiSearch className="absolute w-5 h-5 left-2" />
            <Input
              ref={inputRef}
              className="w-full h-full pl-8 pr-8 bg-transparent border-none shadow-inner rounded-2xl placeholder:text-mountain-400 md:text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setQuery(inputValue);
                  inputRef.current?.blur();
                  setSearchParams({ q: inputValue });
                }
              }}
            />
            {inputValue.length > 0 && (
              <TiDeleteOutline
                className={`right-4 text-mountain-600 dark:text-mountain-400 absolute w-5 h-5 cursor-pointer`}
                onClick={() => {
                  setInputValue("");
                  setQuery("");

                  const newSearchParams = new URLSearchParams(searchParams);
                  newSearchParams.delete("q");
                  setSearchParams(newSearchParams);
                }}
              />
            )}
          </div>
        </div>
      </div>
      <Box className="flex justify-center mt-2">
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          aria-label="basic tabs example"
          sx={{
            "& .MuiTab-root": {
              fontSize: "1.1rem",
              fontWeight: 400,
            },
          }}
        >
          <Tab label="Posts" value="posts" {...a11yProps("posts")} />
          <Tab label="Users" value="users" {...a11yProps("users")} />
        </Tabs>
      </Box>

      <TabPanel value={tab} index={"posts"}>
        <PostSearch finalQuery={finalQuery} />
      </TabPanel>
      <TabPanel value={tab} index={"users"}>
        <UserSearch />
      </TabPanel>
    </div>
  );
};

export default memo(Search);

type SearchTabValue = "posts" | "users";
