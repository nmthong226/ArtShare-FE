import { IoBookOutline, IoFilter } from "react-icons/io5";
import { MdOutlineAdd } from "react-icons/md";
import { TbListNumbers } from "react-icons/tb";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { IoMdMore } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { CreateBlogPayload, createNewBlog } from "./api/blog.api";

const DocumentDashboard = () => {
  const [order, setOrder] = React.useState<
    "today" | "last7days" | "last30days"
  >("today");
  const handleChange = (event: SelectChangeEvent) => {
    setOrder(event.target.value as "today" | "last7days" | "last30days");
  };
  const [alignment, setAlignment] = React.useState("web");

  const handleTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const createNewDocument = async () => {
    try {
      const newBlogPayload: CreateBlogPayload = {
        // Use the defined payload type
        title: "Untitled Document",
        is_published: false,
        content: "Untitled Document", // Or provide a minimal default content
      };

      const createdBlog = await createNewBlog(newBlogPayload);
      navigate(`/docs/${createdBlog.id}`);
    } catch (error) {
      showSnackbar("Failed to create blog", "error");
      console.error("Error creating document:", error);
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
              <p className="text-mountain-800 text-sm">Blank Document</p>
            </div>
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
                  value="android"
                  className="px-4 rounded-l-full h-10 font-normal text-base capitalize"
                >
                  Document
                </ToggleButton>
                <ToggleButton
                  value="ios"
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
        <div className="items-start gap-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 p-6 pb-96 min-h-[calc(100vh-4rem)]">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center space-y-4 bg-white pb-2 border border-mountain-200 hover:border-indigo-600 rounded-lg"
            >
              <div className="flex justify-center items-end bg-mountain-50 border border-mountain-50 rounded-t-lg w-full aspect-square">
                <div className="flex flex-col justify-center items-center bg-white p-2 w-[70%] h-[80%] text-mountain-400">
                  <span className="text-xs select-none">My document</span>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start space-y-2 w-full">
                <p className="bg-white px-2 w-full text-mountain-800 text-sm text-left line-clamp-1 select-none">
                  {index === 0
                    ? "My darkest memory about some"
                    : "Blank Document"}
                </p>
                <div className="flex justify-between items-center w-full">
                  <p className="bg-white px-2 w-full text-mountain-800 text-xs text-left truncate select-none">
                    24/05/2025
                  </p>
                  <Button className="bg-white hover:bg-mountain-50 mr-2 w-6 h-6 text-mountain-600 cursor-pointer">
                    <IoMdMore className="size-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentDashboard;
