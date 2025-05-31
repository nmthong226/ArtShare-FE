import { IoBookOutline, IoFilter, IoTrashBinOutline } from "react-icons/io5";
import { MdOutlineAdd } from "react-icons/md";
import { TbListNumbers } from "react-icons/tb";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect, useRef, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import {
  CircularProgress,
  DialogContentText,
  Input,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { IoMdMore } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Blog } from "@/types/blog";
import { fetchMyBlogs } from "./api/get-all-documents";
import ReactTimeAgo from "react-time-ago";
import { MiniTiptapPreview } from "./components/PreviewDocument";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { FiEdit } from "react-icons/fi";
import { deleteBlog } from "./api/delete-document";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { FaBlogger } from "react-icons/fa6";
import { RiFileWordFill } from "react-icons/ri";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { BiEdit } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { updateDocName } from "./api/edit-document";

const DocumentDashboard = () => {
  const navigate = useNavigate();
  const [openChangeTitleDialog, setOpenChangeTitleDialog] = useState(false);
  const queryClient = useQueryClient();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Blog | null>(null);
  const [order, setOrder] = React.useState<
    "today" | "last7days" | "last30days"
  >("today");
  const handleChange = (event: SelectChangeEvent) => {
    setOrder(event.target.value as "today" | "last7days" | "last30days");
  };
  const [alignment, setAlignment] = React.useState("doc");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (openChangeTitleDialog && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openChangeTitleDialog]);

  const { showSnackbar } = useSnackbar();

  const handleTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  const {
    data: myBlogs,
    isLoading,
    isError,
  } = useQuery<Blog[], Error>({
    queryKey: ["myBlogs"],
    queryFn: fetchMyBlogs,
    select: (data) => (Array.isArray(data) ? data : []),
    refetchOnWindowFocus: "always",
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    staleTime: 0,
  });

  const { mutate: handleDeleteBlog, isPending: isDeleting } = useMutation({
    mutationFn: (blogId: number) => deleteBlog(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBlogs"] });
      showSnackbar("Delete Document Successfully", "success");
    },
    onError: (error) => {
      console.error("Delete failed", error);
      alert("Failed to delete the blog");
    },
  });

  const { mutate: updateTitle, isPending: isUpdating } = useMutation({
    mutationFn: ({ docId, newTitle }: { docId: number; newTitle: string }) =>
      updateDocName(docId, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBlogs"] });
      showSnackbar("Title updated successfully", "success");
      setOpenChangeTitleDialog(false);
    },
    onError: () => {
      showSnackbar("Failed to update title", "error");
    },
  });

  const handleNavigateToEdit = (selectedDocId: number) => {
    navigate(`/docs/${selectedDocId}/edit`, { replace: true });
  };

  const handleOpenChangeTitleDialog = (blog: Blog) => {
    setSelectedDoc(blog);
    setNewTitle(blog.title);
    setOpenChangeTitleDialog(true);
  };

  const handleCloseChangeTitleDialog = () => {
    setOpenChangeTitleDialog(false);
  };

  const handleChangeTitleConfirmed = () => {
    if (!selectedDoc) return;
    updateTitle({ docId: selectedDoc.id, newTitle });
  };

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load your blogs.
      </div>
    );

  return (
    <div className="flex flex-col items-center h-screen overflow-auto sidebar">
      <div className="flex justify-center border-mountain-50 border-b-1 w-full h-fit">
        <div className="flex flex-col justify-center items-center space-y-2 p-4 w-fit h-full">
          <div className="flex space-x-4 h-full">
            <Link
              to="/docs/new"
              className="flex flex-col justify-center space-y-4"
            >
              <div className="flex justify-center items-center bg-mountain-50 border-1 border-white hover:border-indigo-600 w-42 h-48">
                <div className="flex justify-center items-center bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full w-16 h-16">
                  <MdOutlineAdd className="size-10" />
                </div>
              </div>
              <p className="text-mountain-800 text-sm">Blank Document</p>
            </Link>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex justify-center items-center bg-mountain-50 border-1 border-white hover:border-indigo-600 w-42 h-48">
                <div className="flex justify-center items-center bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full w-16 h-16">
                  <IoBookOutline className="size-8" />
                </div>
              </div>
              <p className="text-mountain-800 text-sm">Tutorial Template</p>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex justify-center items-center bg-mountain-50 border-1 border-white hover:border-indigo-600 w-42 h-48">
                <div className="flex justify-center items-center bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full w-16 h-16">
                  <TbListNumbers className="size-8" />
                </div>
              </div>
              <p className="text-mountain-800 text-sm">Sale Template</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-6 w-full">
        <div className="top-0 sticky flex justify-between items-center bg-white shadow-md px-4 rounded-t-3xl w-full h-fit">
          <p className="font-medium text-lg">Recent projects</p>
          <div className="flex items-center">
            <div className="flex">
              <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleTypeChange}
                aria-label="Platform"
              >
                <ToggleButton
                  value="doc"
                  className="px-4 rounded-l-full h-10 font-normal text-base capitalize"
                >
                  Document
                </ToggleButton>
                <ToggleButton
                  value="blog"
                  className="px-4 rounded-r-full h-10 font-normal text-base capitalize"
                >
                  Blog
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
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
        {isLoading ? (
          <div className="flex justify-center items-center space-x-4 h-20 font-thin text-sm">
            <CircularProgress size={36} />
          </div>
        ) : myBlogs && myBlogs.length > 0 ? (
          <div className="items-start gap-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 p-6 pb-96 min-h-[calc(100vh-4rem)]">
            {myBlogs.map((blog, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center space-y-4 bg-white pb-2 border border-mountain-200 hover:border-indigo-600 rounded-lg"
              >
                <div
                  onClick={() => handleNavigateToEdit(blog.id)}
                  className="flex justify-center items-end bg-mountain-50 border border-mountain-50 rounded-t-lg w-full aspect-square overflow-hidden"
                >
                  <div className="bg-white shadow-inner p-2 rounded w-[70%] h-[80%] overflow-hidden">
                    <MiniTiptapPreview content={blog.content} />
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start space-y-0.5 w-full">
                  <p className="bg-white px-2 w-full text-mountain-800 text-sm text-left line-clamp-1 select-none">
                    {blog.title}
                  </p>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-1 px-2 w-full h-6 text-mountain-800 text-xs text-left truncate select-none">
                      {blog.is_published ? (
                        <Tooltip title="Blog Type" arrow placement="bottom">
                          <div>
                            <FaBlogger className="size-5 text-purple-600" />
                          </div>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Document Type" arrow placement="bottom">
                          <div>
                            <RiFileWordFill className="size-5 text-indigo-600" />
                          </div>
                        </Tooltip>
                      )}
                      <span>•</span>
                      <p>
                        <ReactTimeAgo
                          date={new Date(blog.created_at)}
                          locale="en-US"
                          timeStyle={"mini"}
                        />
                        {" ago"}
                      </p>
                    </div>
                    <Popover>
                      <PopoverTrigger className="bg-white hover:bg-mountain-50 mr-2 rounded-full w-6 h-6 text-mountain-600 cursor-pointer">
                        <IoMdMore className="size-5" />
                      </PopoverTrigger>
                      <PopoverContent className="mt-2 mr-20 p-0 border-mountain-200 w-48 font-thin text-sm">
                        <div
                          onClick={() => handleOpenChangeTitleDialog(blog)}
                          className="flex items-center space-x-2 hover:bg-mountain-50 px-3 py-2 cursor-pointer"
                        >
                          <FiEdit />
                          <p>Rename</p>
                        </div>
                        <hr className="flex border-mountain-200 border-t-1 w-full" />
                        <div
                          onClick={() => {
                            setConfirmDialogOpen(true);
                            setSelectedBlogId(blog.id);
                          }}
                          className="flex items-center space-x-2 hover:bg-mountain-50 px-3 py-2 cursor-pointer"
                        >
                          <IoTrashBinOutline />
                          <p>
                            Delete this{" "}
                            {blog.is_published ? "blog" : "document"}
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-20 font-thin text-mountain-600 text-sm">
            No document found.
          </div>
        )}
      </div>
      <Dialog
        open={openChangeTitleDialog}
        onClose={handleCloseChangeTitleDialog}
      >
        <DialogTitle className="flex items-center space-x-2">
          <BiEdit />
          <p>Rename</p>
        </DialogTitle>
        <DialogContent className="space-y-4 w-108">
          <DialogContentText>Please Input For This Field:</DialogContentText>
          <Input
            ref={inputRef}
            placeholder="Your document's title"
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full"
            value={newTitle}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseChangeTitleDialog}
            className="bg-mountain-200 hover:bg-mountain-200/80 text-mountain-950"
          >
            Cancel
          </Button>
          <Button
            onClick={handleChangeTitleConfirmed}
            autoFocus
            className="bg-indigo-600 hover:bg-indigo-600/80 cursor-pointer"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <CircularProgress size={8} />
                <p>Saving...</p>
              </>
            ) : (
              <p>Change Title</p>
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(!confirmDialogOpen)}
      >
        <DialogTitle className="flex items-center space-x-2">
          <IoTrashBinOutline />
          <p>Delete This Document</p>
        </DialogTitle>
        <DialogContent className="space-y-4 w-108">
          <DialogContentText>
            Delete this document permanently. Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            className="bg-mountain-200 hover:bg-mountain-200/80 text-mountain-950"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedBlogId !== null) {
                handleDeleteBlog(selectedBlogId);
              }
              setConfirmDialogOpen(false);
              setSelectedBlogId(null);
            }}
            autoFocus
            className="bg-red-600 hover:bg-red-600/80 cursor-pointer"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <CircularProgress size={8} />
                <p>Deleting...</p>
              </>
            ) : (
              <p>Yes, delete it</p>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DocumentDashboard;
