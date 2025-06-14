import React, { memo, useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  // Pagination,
  // Stack,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Ellipsis, LoaderPinwheel } from "lucide-react";
import { AiFillFire } from "react-icons/ai";
import { IoHeartCircleOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";

import {
  fetchTrendingBlogs,
  fetchFollowingBlogs,
  fetchBlogs,
  searchBlogs,
} from "@/features/blog-details/api/blog";
import { DataPopper } from "./components/Categories";
import BlogItem from "@/components/lists/BlogItem";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/contexts/SearchProvider";
import { categoriesData } from "@/utils/mocks";

import type { Blog } from "@/types/blog";
import "./BrowseBlogs.css";

const PAGE_SIZE = 12; // blogs per page

const BrowseBlogs: React.FC = () => {
  /* ───────── UI state ───────── */
  const [tab, setTab] = useState<"trending" | "following">("trending");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  /* popper for categories */
  const [openPop, setOpenPop] = useState(false);
  const [anchorPop, setAnchorPop] = useState<HTMLElement | null>(null);

  /* search */
  const [searchInput, setSearchInput] = useState("");
  const { query, setQuery } = useSearch();
  const navigate = useNavigate();

  /* reset page when filters change */
  useEffect(() => setPage(1), [tab, selectedCategories, query]);

  /* ───────── fetch blogs ───────── */
  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery<Blog[], Error>({
    queryKey: ["blogs", tab, selectedCategories, query, page],
    queryFn: async (): Promise<Blog[]> => {
      const skip = (page - 1) * PAGE_SIZE;

      if (query)
        return await searchBlogs({ take: PAGE_SIZE, skip, search: query });

      if (tab === "following")
        return await fetchFollowingBlogs({
          take: PAGE_SIZE,
          skip,
          categories: selectedCategories,
        });

      if (tab === "trending")
        return fetchTrendingBlogs({
          take: PAGE_SIZE,
          skip,
          categories: selectedCategories,
        });

      return await fetchBlogs({ take: PAGE_SIZE, skip });
    },
    select: (data) => (Array.isArray(data) ? data : []),
  });

  /* ───────── handlers ───────── */
  const toggleCategory = (name: string) =>
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );

  const clearCategories = () => setSelectedCategories([]);

  const handleTabChange = (
    _: React.MouseEvent<HTMLElement>,
    val: string | null,
  ) => val && setTab(val as "trending" | "following");

  // const handlePageChange = (_: any, p: number) => setPage(p);

  const submitSearch = () => {
    setQuery(searchInput);
    navigate(`/blogs?q=${searchInput}`);
  };

  /* ───────── loading / error ───────── */
  if (isLoading)
    return (
      <div className="flex justify-center items-center space-x-4 h-screen bg-white dark:bg-mountain-950">
        <CircularProgress size={36} />
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 dark:text-red-400 bg-white dark:bg-mountain-950">
        `{isError} Fail to load message`
      </div>
    );
  /* ───────── JSX ───────── */
  return (
    <div className="flex rounded-t-3xl h-screen overflow-hidden bg-white dark:bg-mountain-950">
      <div className="flex flex-col w-[75%] min-h-screen">
        <div className="top-0 z-60 sticky bg-white dark:bg-mountain-900 shadow-sm p-4 border-mountain-200 dark:border-mountain-700 border-b-1">
          <div className="flex items-center space-x-4">
            <Paper className="bg-mountain-50 dark:bg-mountain-800 shadow-none rounded-full">
              <ToggleButtonGroup
                size="small"
                exclusive
                value={tab}
                onChange={handleTabChange}
                className="dark:text-white"
              >
                <ToggleButton
                  value="trending"
                  className="rounded-full dark:text-gray-300 dark:hover:bg-mountain-700"
                >
                  <AiFillFire className="mr-1 size-4 text-mountain-400 dark:text-mountain-300 capitalize" />
                  Trending
                </ToggleButton>
                <ToggleButton
                  value="following"
                  className="rounded-full dark:text-gray-300 dark:hover:bg-mountain-700"
                >
                  <IoHeartCircleOutline className="mr-1 size-4 text-mountain-400 dark:text-mountain-300" />
                  Following
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
            <div className="relative flex flex-1 items-center">
              <FiSearch className="left-2 absolute w-5 h-5 text-gray-500 dark:text-gray-400" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                placeholder="Search"
                className="shadow-inner pr-8 pl-8 rounded-2xl w-full bg-white dark:bg-mountain-800 border-gray-200 dark:border-mountain-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <TiDeleteOutline
                className={`absolute right-2 w-5 h-5 text-mountain-600 dark:text-mountain-400 cursor-pointer hover:text-mountain-700 dark:hover:text-mountain-300 ${
                  searchInput ? "block" : "hidden"
                }`}
                onClick={() => {
                  setSearchInput("");
                  setQuery("");
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 space-y-8 p-4 pb-48 min-h-screen overflow-auto sidebar bg-white dark:bg-mountain-950">
          {(blogs ?? []).length === 0 ? (
            <p className="text-mountain-500 dark:text-mountain-400 text-center">
              No blogs found.
            </p>
          ) : (
            (blogs ?? []).map((b) => (
              <BlogItem
                key={b.id}
                blogId={String(b.id)}
                title={b.title}
                content={b.content}
                thumbnail={
                  Array.isArray(b.pictures) && b.pictures[0]
                    ? b.pictures[0]
                    : "https://placehold.co/600x400"
                }
                author={{
                  username: b.user.username,
                  avatar: b.user.profile_picture_url ?? "",
                }}
                category={b.categories?.[0]?.name ?? ""}
                timeReading={`${Math.ceil((b.content ? b.content.split(/\s+/).length : 0) / 200)}m reading`}
                dateCreated={b.created_at}
                like_count={b.like_count}
                comment_count={b.comment_count}
                view_count={b.view_count}
              />
            ))
          )}
          {/* <div className="flex justify-center">
            <Stack spacing={2}>
              <Pagination count={10} page={page} onChange={handlePageChange} />
            </Stack>
          </div> */}
        </div>
      </div>
      <div className="z-10 shadow-sm p-4 w-[25%] bg-gray-50 dark:bg-mountain-900 border-l border-gray-200 dark:border-mountain-700">
        <div className="flex space-x-4">
          <Button
            variant="contained"
            className="dark:bg-mountain-800 dark:hover:bg-mountain-700 w-12 min-w-0 h-12"
            onClick={(e) => {
              setAnchorPop(e.currentTarget);
              setOpenPop((o) => !o);
            }}
          >
            <Ellipsis />
          </Button>
          <DataPopper
            open={openPop}
            anchorEl={anchorPop}
            onClose={() => setOpenPop(false)}
            onSave={setSelectedCategories}
            selectedData={selectedCategories}
            data={categoriesData}
            placement="bottom-start"
            renderItem="category"
          />
          <Button
            variant={selectedCategories.length ? "outlined" : "contained"}
            className="flex items-center gap-2 p-2 rounded-lg dark:bg-mountain-800 dark:hover:bg-mountain-700 dark:text-white dark:border-mountain-600"
            onClick={clearCategories}
          >
            <LoaderPinwheel size={16} />
            All Channels
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-6">
          {categoriesData.map((c) => {
            const active = selectedCategories.includes(c.name);
            return (
              <div
                key={c.name}
                onClick={() => toggleCategory(c.name)}
                className={`px-6 py-2 rounded-2xl cursor-pointer bg-white dark:bg-mountain-800 shadow hover:scale-105 duration-300 ease-in-out border transition-colors ${
                  active
                    ? "border-blue-500 dark:border-blue-400 shadow text-blue-600 dark:text-blue-400"
                    : "border-gray-200 dark:border-mountain-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-mountain-600"
                }`}
              >
                {c.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(BrowseBlogs);
