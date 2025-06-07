import { useEffect, useState } from "react";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/api/baseApi";
import { CreateAutoProjectPayload } from "../types/automation-project";
import { AxiosError } from "axios";
import { SharePlatformName } from "../enums/platform.enum";
import { Menu, MenuItem } from "@mui/material";
import { FiRepeat } from "react-icons/fi";

interface ProjectInfoProp {
  handleStepChange: (
    step: string,
    data?: {
      projectName: string;
      selectedPlatform: Platform;
    },
  ) => void;
}

const ProjectInfoForm: React.FC<ProjectInfoProp> = ({ handleStepChange }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatformType, setSelectedPlatformType] = useState<
    string | null
  >(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null,
  );
  const allAvailablePlatformTypes: SharePlatformName[] = [
    "FACEBOOK",
    "INSTAGRAM",
  ];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenuPlatform, setCurrentMenuPlatform] =
    useState<Platform | null>(null);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await api.get<Platform[]>(`/platforms`);
        setPlatforms(response.data);
      } catch (err) {
        setError("Failed to fetch connected platforms.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    platform: Platform,
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);

    setCurrentMenuPlatform(platform);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMenuPlatform(null);
  };

  const handleReconnectClick = () => {
    if (currentMenuPlatform) {
      console.log(
        `Reconnecting platform: ${currentMenuPlatform.config.page_name}`,
      );

      handleReconnect(currentMenuPlatform);
    }
    handleMenuClose();
  };

  const handleReconnect = async (platform?: Platform) => {
    try {
      if (platform) {
        console.log(
          `Initiating reconnection for ${platform.name} page: ${platform.config.page_name}`,
        );
      }
      const currentPageUrl = window.location.href;
      const encodedRedirectUrl = encodeURIComponent(currentPageUrl);

      console.log(
        `Initiating reconnection. Will redirect to: ${currentPageUrl}`,
      );

      const response = await api.get(
        `/facebook-integration/initiate-connection-url?redirectUrl=${encodedRedirectUrl}`,
      );
      const { facebookLoginUrl } = response.data;
      if (facebookLoginUrl) {
        window.location.href = facebookLoginUrl;
      }
    } catch (error) {
      console.error("Failed to get reconnection URL", error);
      setError("Could not initiate reconnection. Please try again later.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPlatform) {
      alert("Please choose an account for your project.");
      return;
    }

    const payload: CreateAutoProjectPayload = {
      title: projectName,
      description: description,
      platform_id: selectedPlatform.id,
      auto_post_meta_list: [],
    };

    try {
      await api.post("/auto-project", payload);

      handleStepChange("create-posts", {
        projectName,
        selectedPlatform,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error("Failed to create project:", err);
      alert(
        `Error creating project: ${err.response?.data?.message || "An unexpected error occurred."}`,
      );
    }
  };

  const filteredAccounts = selectedPlatformType
    ? platforms.filter((p) => p.name === selectedPlatformType)
    : [];

  const isTokenExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col items-center w-full h-full p-2 bg-white"
    >
      <div className="flex gap-6">
        {/* General Info Section */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-lg font-semibold capitalize">🧠 General Info</h2>
          <div className="flex flex-col items-center space-y-4 w-xl">
            <label
              htmlFor="projectName"
              className="flex w-full mb-1 font-medium text-left"
            >
              Project Name
              <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="projectName"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mountain-500"
              placeholder="Enter your project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
            <label
              htmlFor="description"
              className="flex items-center w-full mb-1 space-x-2 font-medium text-left"
            >
              <p>Description</p>
              <span className="text-sm font-normal text-mountain-600">
                (optional)
              </span>
            </label>
            <textarea
              id="description"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mountain-500 w-full h-[220px] max-h-[220px] resize-none"
              placeholder="Enter your project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="flex bg-mountain-200 w-0.5 h-full" />

        {/* Platform Integration Section */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-lg font-semibold capitalize">
            🌐 Platform Integration
          </h2>
          <div className="flex flex-col w-xl">
            <label className="block mb-1 font-medium">
              Select Platform
              <span className="text-red-600">*</span>
            </label>
            <Select
              onValueChange={(value: SharePlatformName) => {
                setSelectedPlatformType(value);
                setSelectedPlatform(null);
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px] data-[size=default]:h-10">
                <SelectValue placeholder="Choose Platform" />
              </SelectTrigger>
              <SelectContent className="border-mountain-100">
                {/* Now mapping over the static list of all possible types */}
                {allAvailablePlatformTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label className="block mt-6 mb-1 font-medium">
              Choose Account
              <span className="text-red-600">*</span>
            </label>

            {/* Conditional Rendering Logic */}
            {isLoading && <p>Loading platforms...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!isLoading && !error && selectedPlatformType === "INSTAGRAM" && (
              <div className="relative flex flex-col items-center justify-center p-4 text-center bg-gray-100 border cursor-not-allowed group h-36 rounded-3xl opacity-80">
                <FaInstagram className="w-10 h-10 mb-2 text-gray-500" />
                <p className="text-sm font-semibold text-gray-700">
                  Instagram integration is coming soon!
                </p>
                <p className="text-xs text-gray-500">
                  Please select another platform to continue.
                </p>
              </div>
            )}

            {!isLoading && !error && selectedPlatformType === "FACEBOOK" && (
              <>
                {filteredAccounts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {filteredAccounts.map((platform) => {
                      const expired = isTokenExpired(platform.token_expires_at);
                      return (
                        <button
                          type="button"
                          key={platform.id}
                          className={`border group relative justify-between bg-mountain-50/60 h-36 p-4 items-start rounded-3xl flex flex-col hover:shadow-md transition ${
                            selectedPlatform?.id === platform.id
                              ? "ring-2 ring-mountain-500 border-mountain-500"
                              : "border-gray-300"
                          }`}
                          onClick={() => setSelectedPlatform(platform)}
                        >
                          <div className="flex flex-col items-start space-y-1">
                            {platform.name === "FACEBOOK" && (
                              <FaFacebookSquare className="text-blue-700 size-10" />
                            )}
                          </div>
                          <span className="font-medium line-clamp-1">
                            {platform.config.page_name}
                          </span>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-2 h-2 rounded-full ${expired ? "bg-red-500" : "bg-green-500"}`}
                              />
                              <span className="text-xs capitalize">
                                {expired
                                  ? "Expired"
                                  : platform.status.toLowerCase()}
                              </span>
                            </div>
                            {platform.token_expires_at && !expired && (
                              <span className="text-xs">
                                Expires{" "}
                                {new Date(
                                  platform.token_expires_at,
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <div
                            onClick={(e) => handleMenuOpen(e, platform)}
                            className="absolute flex invisible duration-300 ease-in-out transform bg-white border rounded-md opacity-0 cursor-pointer group-hover:visible top-4 right-4 group-hover:opacity-100 border-mountain-100"
                          >
                            <IoMdMore className="size-6 text-mountain-600" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-6 text-center border-2 border-gray-300 border-dashed rounded-lg">
                    <p className="font-semibold">No Facebook Pages Found</p>
                    <p className="mb-3 text-sm text-gray-600">
                      You haven't connected any Facebook pages yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleReconnect()}
                      className="mt-2 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                      Connect a Page
                    </button>
                  </div>
                )}
              </>
            )}

            {!isLoading && !selectedPlatformType && (
              <p className="text-sm text-mountain-600">
                Please select a platform to continue.
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 flex space-x-4 -translate-x-1/2 left-1/2">
        <button
          type="button"
          disabled
          className="flex items-center justify-center w-48 px-2 py-2 mt-4 transition rounded-md cursor-default bg-mountain-200 hover:bg-mountain-300/80 disabled:bg-mountain-100 text-mountain-950 disabled:text-mountain-600"
        >
          Previous Step
        </button>
        <button
          type="submit"
          className="flex items-center justify-center w-48 px-6 py-2 mt-4 transition bg-indigo-200 rounded-md cursor-pointer hover:bg-indigo-300/80 disabled:bg-gray-300 disabled:cursor-not-allowed text-mountain-950"
          disabled={!projectName || !selectedPlatform || isLoading}
        >
          Next Step
        </button>
      </div>

      {/* More Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleReconnectClick}>
          <FiRepeat className="mr-2" />
          Refresh connection
        </MenuItem>
        {/* Add other menu items here if needed */}
      </Menu>
    </form>
  );
};

export default ProjectInfoForm;
