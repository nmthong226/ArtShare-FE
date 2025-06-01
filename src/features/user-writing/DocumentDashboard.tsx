import { IoBookOutline, IoFilter } from "react-icons/io5";
import { MdOutlineAdd } from "react-icons/md";
import { TbListNumbers } from "react-icons/tb";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { CircularProgress, IconButton, Menu } from "@mui/material";
import { IoMdMore } from "react-icons/io";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { CreateBlogPayload, createNewBlog, deleteBlog } from "./api/blog.api";
import { fetchBlogsByUsername } from "../blog-details/api/blog";
import { useUser } from "@/contexts/UserProvider";
import { Blog } from "@/types/blog";
import { TUTORIAL_TEMPLATE_HTML } from "@/constants/template";

const DocumentDashboard = () => {
  const [order, setOrder] = React.useState<
    "today" | "last7days" | "last30days"
  >("today");
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { user } = useUser();

  // Fetch user's documents
  useEffect(() => {
    const fetchUserDocuments = async () => {
      if (!user?.username) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const blogs = await fetchBlogsByUsername(user.username);

        // Filter blogs based on the selected order
        const now = new Date();
        const filteredBlogs = blogs.filter((blog) => {
          const createdAt = new Date(blog.created_at);
          const diffInDays = Math.floor(
            (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
          );

          switch (order) {
            case "today":
              return diffInDays === 0;
            case "last7days":
              return diffInDays <= 7;
            case "last30days":
              return diffInDays <= 30;
            default:
              return true;
          }
        });

        setUserBlogs(filteredBlogs);
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
    setOrder(event.target.value as "today" | "last7days" | "last30days");
  };

  const createNewDocument = async () => {
    try {
      const newBlogPayload: CreateBlogPayload = {
        title: "Untitled Document",
        is_published: false,
        content: "Untitled Document",
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
      navigate(`/docs/${newBlog.id}`); // jump into WriteBlog
    } catch (err) {
      showSnackbar("Failed to create tutorial", "error");
      console.error(err);
    }
  };

  const handleDocumentClick = (blogId: number) => {
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (blogId: number) => {
    navigate(`/docs/${blogId}`);
  };

  const handleDelete = async (blogId: number) => {
    try {
      await deleteBlog(blogId);
      setUserBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
      showSnackbar("Document deleted successfully", "success");
    }
    catch {
      showSnackbar("Failed to delete document", "error");
      return;
    }
    finally {
      handleClose();
    }
  };

  return (
    <div className="flex flex-col items-center h-screen overflow-auto sidebar">
      <div className="flex justify-center border-mountain-50 border-b-1 w-full h-fit">
        <div className="flex flex-col justify-center items-center space-y-2 p-4 w-fit h-full">
          <div className="flex space-x-4 h-full">
            <div
              className="flex flex-col justify-center space-y-4 cursor-pointer"
              onClick={() => createNewDocument()}
            >
              <div className="flex justify-center items-center bg-mountain-50 border-1 border-white hover:border-indigo-600 w-42 h-48">
                <div className="flex justify-center items-center bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full w-16 h-16">
                  <MdOutlineAdd className="size-10" />
                </div>
              </div>
              <p className="text-mountain-800 text-sm text-center">
                Blank Document
              </p>
            </div>
            <div
              className="flex flex-col justify-center space-y-4 cursor-pointer"
              onClick={() => createTutorialDocument()}
            >
              <div className="flex justify-center items-center bg-mountain-50 border-1 border-white hover:border-indigo-600 w-42 h-48">
                <div className="flex justify-center items-center bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full w-16 h-16">
                  <IoBookOutline className="size-10" />
                </div>
              </div>
              <p className="text-mountain-800 text-sm text-center">
                Tutorial Template
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex justify-center items-center bg-mountain-50 border-1 border-white hover:border-indigo-600 w-42 h-48">
                <div className="flex justify-center items-center bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full w-16 h-16">
                  <TbListNumbers className="size-10" />
                </div>
              </div>
              <p className="text-mountain-800 text-sm text-center">
                Sale Template
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-6 w-full">
        <div className="top-0 sticky flex justify-between items-center bg-white shadow-md px-4 rounded-t-3xl w-full h-fit">
          <p className="font-medium text-lg">Recent projects</p>
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
                  }}
                  className="relative pl-8 rounded-full w-36 h-10"
                >
                  <MenuItem value={"today"}>Today</MenuItem>
                  <MenuItem value={"last7days"}>7 days</MenuItem>
                  <MenuItem value={"last30days"}>30 days</MenuItem>
                </Select>
                <IoFilter className="top-1/2 left-4 absolute -translate-y-1/2" />
              </FormControl>
            </div>
          </div>
        </div>

        <div className="items-start gap-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 p-6 pb-96 min-h-[calc(100vh-4rem)]">
          {isLoading ? (
            <div className="flex justify-center items-center col-span-full py-8">
              <CircularProgress size={32} />
              <span className="ml-2">Loading documents...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center col-span-full py-8 text-red-500">
              <span>{error}</span>
            </div>
          ) : userBlogs.length === 0 ? (
            <div className="flex justify-center items-center col-span-full py-8 text-gray-500">
              <span>No documents found for the selected time period.</span>
            </div>
          ) : (
            userBlogs.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-col justify-center items-center space-y-4 bg-white pb-2 border border-mountain-200 hover:border-indigo-600 rounded-lg cursor-pointer transition-colors duration-200"
                onClick={() => handleDocumentClick(blog.id)}
              >
                <div className="flex justify-center items-end bg-mountain-50 border border-mountain-50 rounded-t-lg w-full aspect-square">
                  <div className="flex flex-col justify-center items-center bg-white p-2 w-[70%] h-[80%] text-mountain-400">
                    <span className="text-xs select-none">My document</span>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start space-y-2 w-full">
                  <p
                    className="bg-white px-2 w-full text-mountain-800 text-sm text-left line-clamp-1 select-none"
                    title={blog.title} // Show full title on hover
                  >
                    {truncateTitle(blog.title)}
                  </p>
                  <div className="flex justify-between items-center w-full">
                    <p className="bg-white px-2 w-full text-mountain-800 text-xs text-left truncate select-none">
                      {formatDate(blog.created_at)}
                    </p>
                    <IconButton
                      onClick={handleClick}
                      className="bg-white hover:bg-mountain-50 mr-2 w-6 h-6 text-mountain-600 cursor-pointer"
                      size="small"
                    >
                      <IoMdMore className="size-5" />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      onClick={(e) => e.stopPropagation()} // prevent closing on click inside
                    >
                      <MenuItem onClick={() => handleEdit(blog.id)}>Edit</MenuItem>
                      <MenuItem onClick={() => handleDelete(blog.id)}>Delete</MenuItem>
                    </Menu>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentDashboard;
