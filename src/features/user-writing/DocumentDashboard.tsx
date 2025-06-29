import { TUTORIAL_TEMPLATE_HTML } from "@/constants/template";
import { useUser } from "@/contexts/UserProvider";
import { useSnackbar } from "@/hooks/useSnackbar";
import { Blog } from "@/types/blog";
import { CircularProgress, IconButton, Menu } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect, useState } from "react";
import { IoMdMore } from "react-icons/io";
import { IoBookOutline, IoFilter } from "react-icons/io5";
import { MdOutlineAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchBlogsByUsername } from "../blog-details/api/blog";
import { CreateBlogPayload, createNewBlog } from "./api/blog.api";
import { BlogDeleteConfirmDialog } from "./components/BlogDeleteConfirmDialog";
import { useDeleteBlog } from "./hooks/useDeleteBlog";

// Define a type for the sort order
type BlogSortOrder = "latest" | "oldest" | "last7days" | "last30days";

const DocumentDashboard = () => {
  // Set "latest" as the default order
  const [order, setOrder] = React.useState<BlogSortOrder>("latest");
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { user } = useUser();

  const [menuState, setMenuState] = useState<{
    anchorEl: null | HTMLElement;
    currentBlogId: null | number;
  }>({ anchorEl: null, currentBlogId: null });

  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    open: boolean;
    blogId: number | null;
    blogTitle: string | null;
  }>({ open: false, blogId: null, blogTitle: null });

  const { mutate: deleteBlogMutation, isPending: isDeletingBlog } =
    useDeleteBlog({
      onSuccess: (blogId) => {
        setUserBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
        showSnackbar("Document deleted successfully", "success", undefined, {
          vertical: "top",
          horizontal: "center",
        });
        setDeleteConfirmState({ open: false, blogId: null, blogTitle: null });
      },
      onError: (errorMessage) => {
        showSnackbar(errorMessage, "error");
        setDeleteConfirmState({ open: false, blogId: null, blogTitle: null });
      },
    });

  // Function to get thumbnail image from blog
  const getThumbnail = (blog: Blog): string => {
    if (Array.isArray(blog.pictures) && blog.pictures[0]) {
      return blog.pictures[0];
    }
    return "https://placehold.co/600x400";
  };

  useEffect(() => {
    const fetchUserDocuments = async () => {
      if (!user?.username) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch all blogs with pagination - increase take to get more results
        const blogs = await fetchBlogsByUsername(user.username, {
          take: 100,
          skip: 0,
        });
        let processedBlogs = [...blogs]; // Create a mutable copy

        const now = new Date();

        // Apply date range filtering for "last7days" or "last30days"
        if (order === "last7days" || order === "last30days") {
          processedBlogs = processedBlogs.filter((blog) => {
            // Handle potential null updated_at
            if (!blog.updated_at) return false;

            const updatedAtDate = new Date(blog.updated_at);
            const diffInMilliseconds = now.getTime() - updatedAtDate.getTime();
            const diffInDays = Math.floor(
              diffInMilliseconds / (1000 * 60 * 60 * 24),
            );

            if (order === "last7days") {
              return diffInDays <= 7;
            }
            if (order === "last30days") {
              return diffInDays <= 30;
            }
            return true;
          });
        }

        // Apply sorting based on updated_at
        processedBlogs.sort((a, b) => {
          // IMPORTANT: Using a.updated_at and b.updated_at for sorting
          const dateA = new Date(a.updated_at || a.created_at).getTime();
          const dateB = new Date(b.updated_at || b.created_at).getTime();

          if (order === "oldest") {
            return dateA - dateB; // Ascending for oldest update
          }
          // "latest", "last7days", "last30days" will sort by most recent update first
          return dateB - dateA; // Descending for latest update
        });

        setUserBlogs(processedBlogs);
        setError(null);
      } catch (err) {
        console.error("Error fetching user documents:", err);
        setError("Failed to load documents");
        setUserBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDocuments();
  }, [user?.username, order]);

  const handleChange = (event: SelectChangeEvent) => {
    setOrder(event.target.value as BlogSortOrder);
  };

  const createNewDocument = async () => {
    try {
      const newBlogPayload: CreateBlogPayload = {
        title: "Untitled Document",
        is_published: false,
        content: "<p></p>",
      };
      const createdBlog = await createNewBlog(newBlogPayload);
      navigate(`/docs/${createdBlog.id}`);
    } catch (error) {
      showSnackbar("Failed to create blog", "error");
      console.error("Error creating document:", error);
    }
  };

  const createTutorialDocument = async () => {
    try {
      const payload: CreateBlogPayload = {
        title: "Untitled Tutorial",
        is_published: false,
        content: TUTORIAL_TEMPLATE_HTML,
      };
      const newBlog = await createNewBlog(payload);
      navigate(`/docs/${newBlog.id}`);
    } catch (err) {
      showSnackbar("Failed to create tutorial", "error");
      console.error(err);
    }
  };

  const handleDocumentClick = (blogId: number) => {
    if (menuState.anchorEl && menuState.currentBlogId === blogId) {
      handleMenuClose();
      return;
    }
    navigate(`/docs/${blogId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const truncateTitle = (title: string, maxLength: number = 30) => {
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    blogId: number,
  ) => {
    event.stopPropagation();
    setMenuState({ anchorEl: event.currentTarget, currentBlogId: blogId });
  };

  const handleMenuClose = () => {
    setMenuState({ anchorEl: null, currentBlogId: null });
  };

  const onEditMenuClick = (blogId: number) => {
    handleMenuClose();
    navigate(`/docs/${blogId}`);
  };

  const onDeleteMenuClick = async (blogId: number) => {
    handleMenuClose(); // Close menu first
    const blog = userBlogs.find((b) => b.id === blogId);
    setDeleteConfirmState({
      open: true,
      blogId,
      blogTitle: blog?.title || null,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmState.blogId) {
      deleteBlogMutation(deleteConfirmState.blogId);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmState({ open: false, blogId: null, blogTitle: null });
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-t-3xl h-screen overflow-auto sidebar">
      {/* Top Templates Section */}
      <div className="flex justify-center border-mountain-50 dark:border-mountain-700 w-full h-fit">
        <div className="flex flex-col justify-center items-center space-y-2 p-4 w-fit h-full">
          <div className="flex space-x-4 h-full">
            {/* Blank Document Template */}
            <div
              className="flex flex-col justify-center space-y-4 cursor-pointer"
              onClick={() => createNewDocument()}
            >
              <div className="flex justify-center items-center bg-mountain-50 dark:bg-mountain-800 border-1 border-white hover:border-indigo-600 dark:border-mountain-600 dark:hover:border-indigo-400 w-42 h-48 transition-colors">
                <div className="flex justify-center items-center bg-gradient-to-br from-indigo-200 dark:from-indigo-700 to-purple-200 dark:to-purple-700 rounded-full w-16 h-16">
                  <MdOutlineAdd className="size-10 text-gray-800 dark:text-gray-200" />
                </div>
              </div>
              <p className="text-mountain-800 dark:text-mountain-200 text-sm text-center">
                Blank Document
              </p>
            </div>
            {/* Tutorial Template */}
            <div
              className="flex flex-col justify-center space-y-4 cursor-pointer"
              onClick={() => createTutorialDocument()}
            >
              <div className="flex justify-center items-center bg-mountain-50 dark:bg-mountain-800 border-1 border-white hover:border-indigo-600 dark:border-mountain-600 dark:hover:border-indigo-400 w-42 h-48 transition-colors">
                <div className="flex justify-center items-center bg-gradient-to-br from-indigo-200 dark:from-indigo-700 to-purple-200 dark:to-purple-700 rounded-full w-16 h-16">
                  <IoBookOutline className="size-10 text-gray-800 dark:text-gray-200" />
                </div>
              </div>
              <p className="text-mountain-800 dark:text-mountain-200 text-sm text-center">
                Tutorial Template
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="flex flex-col space-y-6 bg-mountain-50 w-full">
        {/* Header with Filter */}
        <div className="top-0 sticky flex justify-between items-center bg-white dark:bg-mountain-800 shadow-md px-4 w-full h-fit">
          <p className="font-medium text-gray-900 dark:text-gray-100 text-lg">
            Recent projects
          </p>
          <div className="flex items-center">
            <div className="flex">
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={order}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Order By" }}
                  MenuProps={{
                    disableScrollLock: true,
                    PaperProps: {
                      sx: {
                        backgroundColor: "var(--select-bg)",
                        color: "var(--select-text)",
                        "& .MuiMenuItem-root": {
                          color: "var(--select-text)",
                          "&:hover": {
                            backgroundColor: "var(--select-hover)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "var(--select-selected)",
                          },
                        },
                      },
                    },
                  }}
                  sx={{
                    backgroundColor: "var(--select-bg)",
                    color: "var(--select-text)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--select-border)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--select-border-hover)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--select-border-focus)",
                    },
                    "& .MuiSelect-icon": {
                      color: "var(--select-text)",
                    },
                  }}
                  className="relative pl-8 rounded-full w-36 h-10"
                  style={
                    {
                      "--select-bg": "white",
                      "--select-text": "#374151",
                      "--select-border": "#d1d5db",
                      "--select-border-hover": "#9ca3af",
                      "--select-border-focus": "#6366f1",
                      "--select-hover": "#f3f4f6",
                      "--select-selected": "#e0e7ff",
                    } as React.CSSProperties
                  }
                >
                  <MenuItem value={"latest"}>Latest</MenuItem>
                  <MenuItem value={"oldest"}>Oldest</MenuItem>
                  <MenuItem value={"last7days"}>Last 7 days</MenuItem>
                  <MenuItem value={"last30days"}>Last 30 days</MenuItem>
                </Select>
                <IoFilter className="top-1/2 left-4 absolute text-gray-600 dark:text-gray-400 -translate-y-1/2" />
              </FormControl>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="items-start gap-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 p-6 pb-96 min-h-[calc(100vh-4rem)]">
          {isLoading ? (
            <div className="flex justify-center items-center col-span-full py-8">
              <CircularProgress
                size={32}
                sx={{ color: "var(--loader-color)" }}
                style={
                  { "--loader-color": "rgb(79 70 229)" } as React.CSSProperties
                }
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Loading documents...
              </span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center col-span-full py-8 text-red-500 dark:text-red-400">
              <span>{error}</span>
            </div>
          ) : userBlogs.length === 0 ? (
            <div className="flex justify-center items-center col-span-full py-8 text-gray-500 dark:text-gray-400">
              <span>No documents found for the selected criteria.</span>
            </div>
          ) : (
            userBlogs.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-col justify-center items-center space-y-4 bg-white dark:bg-mountain-800 pb-2 border border-mountain-200 hover:border-indigo-600 dark:border-mountain-600 dark:hover:border-indigo-400 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => handleDocumentClick(blog.id)}
              >
                {/* Document Thumbnail */}
                <div className="flex justify-center items-center bg-mountain-50 dark:bg-mountain-700 border border-mountain-50 dark:border-mountain-600 rounded-t-lg w-full aspect-square overflow-hidden">
                  <img
                    src={getThumbnail(blog)}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.currentTarget.src = "https://placehold.co/600x400";
                    }}
                  />
                </div>

                {/* Document Info */}
                <div className="flex flex-col justify-start items-start space-y-2 w-full">
                  <p
                    className="bg-white dark:bg-mountain-800 px-2 w-full text-mountain-800 dark:text-mountain-200 text-sm text-left line-clamp-1 select-none"
                    title={blog.title}
                  >
                    {truncateTitle(blog.title)}
                  </p>
                  <div className="flex justify-between items-center w-full">
                    <p className="bg-white dark:bg-mountain-800 px-2 w-full text-mountain-800 dark:text-mountain-300 text-xs text-left truncate select-none">
                      {formatDate(blog.created_at)}
                    </p>
                    <IconButton
                      onClick={(event) => handleMenuClick(event, blog.id)}
                      className="bg-white hover:bg-mountain-50 dark:bg-mountain-800 dark:hover:bg-mountain-700 mr-2 w-6 h-6 text-mountain-600 dark:text-mountain-400 cursor-pointer"
                      size="small"
                    >
                      <IoMdMore className="size-5" />
                    </IconButton>
                    <Menu
                      anchorEl={menuState.anchorEl}
                      open={
                        menuState.currentBlogId === blog.id &&
                        Boolean(menuState.anchorEl)
                      }
                      onClose={handleMenuClose}
                      onClick={(e) => e.stopPropagation()}
                      PaperProps={{
                        sx: {
                          backgroundColor: "var(--menu-bg)",
                          color: "var(--menu-text)",
                          border: "1px solid var(--menu-border)",
                          "& .MuiMenuItem-root": {
                            color: "var(--menu-text)",
                            "&:hover": {
                              backgroundColor: "var(--menu-hover)",
                            },
                          },
                        },
                      }}
                      style={
                        {
                          "--menu-bg": "white",
                          "--menu-text": "#374151",
                          "--menu-border": "#d1d5db",
                          "--menu-hover": "#f3f4f6",
                        } as React.CSSProperties
                      }
                    >
                      <MenuItem onClick={() => onEditMenuClick(blog.id)}>
                        Edit
                      </MenuItem>
                      <MenuItem onClick={() => onDeleteMenuClick(blog.id)}>
                        Delete
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dark mode styles for MUI components */}
      <style>{`
        .dark [style*="--select-bg"] {
          --select-bg: rgb(41 37 36) !important;
          --select-text: rgb(229 231 235) !important;
          --select-border: rgb(87 83 78) !important;
          --select-border-hover: rgb(120 113 108) !important;
          --select-border-focus: rgb(129 140 248) !important;
          --select-hover: rgb(68 64 60) !important;
          --select-selected: rgb(67 56 202) !important;
        }

        .dark [style*="--menu-bg"] {
          --menu-bg: rgb(41 37 36) !important;
          --menu-text: rgb(229 231 235) !important;
          --menu-border: rgb(87 83 78) !important;
          --menu-hover: rgb(68 64 60) !important;
        }

        .dark [style*="--loader-color"] {
          --loader-color: rgb(129 140 248) !important;
        }
      `}</style>

      {/* Delete Confirmation Dialog */}
      <BlogDeleteConfirmDialog
        open={deleteConfirmState.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        submitting={isDeletingBlog}
        blogTitle={deleteConfirmState.blogTitle || undefined}
      />
    </div>
  );
};

export default DocumentDashboard;
