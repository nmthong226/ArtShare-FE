<<<<<<< HEAD:src/features/media-automation/LinkSocial.tsx
import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Check, LoaderPinwheel, Plus, Trash2Icon, X } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import { AxiosError } from "axios";
import fb_icon from "/fb_icon.png";
import ins_icon from "/ins_icon.png";
import linkedin_icon from "/linkedin_icon.png";
import { Input } from "@/components/ui/input";
import { PlatformStatus } from "./enums/platform.enum";
import api from "@/api/baseApi";

const LinkSocial = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedPlatformFilter, setSelectedPlatformFilter] =
    useState<string>("All");
  const [searchInput, setSearchInput] = useState<string>("");
=======
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Check, Clock, Plus, Trash2Icon, X } from 'lucide-react';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { TiDeleteOutline } from 'react-icons/ti';
import fb_icon from '/public/fb_icon.png';
import ins_icon from '/public/ins_icon.png';
import linkedin_icon from '/public/linkedin_icon.png';

const SocialLinksPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [searchInput, setSearchInput] = useState<string>('');
>>>>>>> feat/automation:src/features/media-automation/social-links/routes/SocialLinksPage.tsx
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<number | null>(null);

<<<<<<< HEAD:src/features/media-automation/LinkSocial.tsx
  const platformFilterOptions = ["All", "Facebook", "Instagram"];

  const fetchPlatforms = async () => {
    try {
      setLoading(true);

      const response = await api.get<Platform[]>("/platforms");

      setPlatforms(response.data);
      setError(null);
    } catch (err) {
      const error = err as AxiosError | Error;
      setError(error.message);
      setPlatforms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const handleFacebookConnect = async () => {
    try {
      const currentPageUrl = window.location.href;
      const encodedRedirectUrl = encodeURIComponent(currentPageUrl);

      console.log(
        `Initiating reconnection. Will redirect to: ${currentPageUrl}`,
      );

      const response = await api.get(
        `/facebook-integration/initiate-connection-url?successUrl=${encodedRedirectUrl}&errorUrl=${encodedRedirectUrl}`,
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

  const handleDisconnect = async (platformId: number) => {
    if (window.confirm("Are you sure you want to disconnect this account?")) {
      // Set the loading state for the specific platform being disconnected
      setDisconnectingId(platformId);
      try {
        await api.delete(`/platforms/${platformId}`);
        // Refresh the list after a successful disconnect
        await fetchPlatforms();
      } catch (error) {
        alert("Failed to disconnect account. Please try again.");
        console.error(error);
      } finally {
        // Always reset the loading state, whether the request succeeded or failed
        setDisconnectingId(null);
      }
    }
  };

  const getPlatformIcon = (platformName: string) => {
    switch (platformName.toLowerCase()) {
      case "facebook":
=======
  // Sample platform list
  const platforms = ['All', 'Facebook', 'Instagram', 'LinkedIn', 'Twitter'];

  // Dummy accounts data
  const socialAccounts = [
    {
      id: 1,
      platform: 'Facebook',
      name: 'John’s Page',
      post: 15,
      status: 'Connected',
    },
    {
      id: 2,
      platform: 'Instagram',
      name: 'ArtShare IG',
      post: 0,
      status: 'Connected',
    },
    {
      id: 3,
      platform: 'LinkedIn',
      name: 'Company Profile',
      post: 12,
      status: 'Pending',
    },
    {
      id: 4,
      platform: 'Facebook',
      name: 'Backup Page',
      post: 2,
      status: 'Connected',
    },
    {
      id: 1,
      platform: 'Facebook',
      name: 'John’s Page',
      post: 15,
      status: 'Connected',
    },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
>>>>>>> feat/automation:src/features/media-automation/social-links/routes/SocialLinksPage.tsx
        return fb_icon;
      case 'instagram':
        return ins_icon;
      case 'linkedin':
        return linkedin_icon;
      default:
        return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    }
  };
<<<<<<< HEAD:src/features/media-automation/LinkSocial.tsx
=======
  // Filter accounts based on selected platform
  const filteredAccounts =
    selectedPlatform === 'All'
      ? socialAccounts
      : socialAccounts.filter((acc) => acc.platform === selectedPlatform);
>>>>>>> feat/automation:src/features/media-automation/social-links/routes/SocialLinksPage.tsx

  const formatExpiryDate = (dateString: string | null) => {
    if (!dateString) return "Token does not expire";
    const date = new Date(dateString);
    return `Expires: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  const filteredPlatforms = useMemo(() => {
    return platforms
      .filter((acc) => {
        if (selectedPlatformFilter === "All") return true;
        return acc.name.toLowerCase() === selectedPlatformFilter.toLowerCase();
      })
      .filter((acc) =>
        acc.config.page_name.toLowerCase().includes(searchInput.toLowerCase()),
      );
  }, [platforms, selectedPlatformFilter, searchInput]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full h-[calc(100vh-4rem)]">
      <div className="flex w-full h-full gap-4">
        {/* Filter Panel */}
        <div className="flex flex-col w-1/4 h-full gap-2 space-y-2 bg-white border border-mountain-200 rounded-3xl">
          <div className="flex items-center w-full h-20 p-2 border-mountain-200 border-b-1">
            <div
              onClick={() => setDialogOpen(true)}
              className="flex items-center justify-center w-full h-full gap-2 p-2 text-white border cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-105 rounded-xl"
            >
              <Plus />
              <p>New Connect</p>
            </div>
          </div>
          <div className="flex flex-col px-4">
            <h3 className="mb-2 text-sm font-semibold">Platforms</h3>
            {platformFilterOptions.map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatformFilter(platform)}
                className={`px-4 py-2 text-left rounded-lg transition-all ${
<<<<<<< HEAD:src/features/media-automation/LinkSocial.tsx
                  selectedPlatformFilter === platform
                    ? "bg-indigo-100 font-semibold"
                    : "hover:bg-indigo-50 text-gray-700"
=======
                  selectedPlatform === platform
                    ? 'bg-indigo-100  font-semibold'
                    : 'hover:bg-indigo-50 text-gray-700'
>>>>>>> feat/automation:src/features/media-automation/social-links/routes/SocialLinksPage.tsx
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
        {/* Accounts Panel */}
        <div className="flex flex-col w-3/4 h-full overflow-y-auto bg-white border border-mountain-200 rounded-3xl">
          <div className="z-50 flex items-center justify-between w-full h-20 p-4 border-b shadow-md shrink-0">
            <p className="text-sm font-semibold">
              {selectedPlatformFilter} Platform
            </p>
            <div className="relative flex items-center">
              <FiSearch className="absolute w-5 h-5 text-gray-400 left-2" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
<<<<<<< HEAD:src/features/media-automation/LinkSocial.tsx
                placeholder="Search by page name..."
                className="w-64 pl-8 pr-8 shadow-inner rounded-2xl"
=======
                onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
                placeholder="Search account"
                className="shadow-inner pr-8 pl-8 rounded-2xl w-64 placeholder:text-mountain-400"
              />
              <TiDeleteOutline
                className={`absolute right-2 w-5 h-5 text-mountain-600 ${
                  searchInput ? 'block' : 'hidden'
                }`}
                onClick={() => {
                  setSearchInput('');
                }}
>>>>>>> feat/automation:src/features/media-automation/social-links/routes/SocialLinksPage.tsx
              />
              {searchInput && (
                <TiDeleteOutline
                  className="absolute w-5 h-5 text-gray-500 cursor-pointer right-2"
                  onClick={() => setSearchInput("")}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col h-full p-4 pr-2 space-y-4 sidebar">
            {loading ? (
              <p className="text-gray-500">Loading connections...</p>
            ) : error ? (
              <p className="italic text-red-500">Error: {error}</p>
            ) : filteredPlatforms.length === 0 ? (
              <p className="italic text-gray-500">
                No accounts connected matching your criteria.
              </p>
            ) : (
              filteredPlatforms.map((account) => (
                <div
                  key={account.id}
                  className="relative flex items-center p-4 space-x-4 border border-gray-200 shadow-sm bg-gray-50 rounded-xl"
                >
                  <img
                    src={getPlatformIcon(account.name)}
                    alt={`${account.name} icon`}
                    className="size-8"
                  />
                  <div className="flex flex-col w-[30%]">
                    <span className="text-base font-medium">
                      {account.config.page_name}
                    </span>
                    <span className="text-xs capitalize text-mountain-600">
                      {account.name.toLowerCase()}
                    </span>
                  </div>
                  <div
<<<<<<< HEAD:src/features/media-automation/LinkSocial.tsx
                    className={`flex items-center pl-2 space-x-2 rounded-lg w-auto px-3 py-1 text-sm ${
                      account.status === PlatformStatus.ACTIVE
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {account.status === PlatformStatus.ACTIVE ? (
                      <Check className="size-4" />
=======
                    className={`flex items-center pl-2 space-x-2 rounded-lg w-48 h-full text-sm ${
                      account.status === 'Connected'
                        ? 'bg-green-100 text-green-800'
                        : account.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : account.status === 'Disconnected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {account.status === 'Connected' ? (
                      <Check className="size-4" />
                    ) : account.status === 'Pending' ? (
                      <Clock className="size-4" />
>>>>>>> feat/automation:src/features/media-automation/social-links/routes/SocialLinksPage.tsx
                    ) : (
                      <X className="size-4" />
                    )}
                    <p>
                      {account.status === PlatformStatus.ACTIVE
                        ? "Connected"
                        : "Inactive"}
                    </p>
                  </div>
                  <span className="text-sm text-mountain-600">
                    {formatExpiryDate(account.token_expires_at)}
                  </span>
                  <div
                    onClick={() =>
                      disconnectingId !== account.id &&
                      handleDisconnect(account.id)
                    }
                    className={`right-4 absolute flex justify-center items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      disconnectingId === account.id
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-mountain-100/60 hover:bg-red-100 text-mountain-800 hover:text-red-700 cursor-pointer select-none"
                    }`}
                  >
                    {disconnectingId === account.id ? (
                      <>
                        <LoaderPinwheel size={16} className="animate-spin" />
                        <p className="text-sm">Disconnecting...</p>
                      </>
                    ) : (
                      <>
                        <Trash2Icon className="size-4" />
                        <p className="text-sm">Disconnect</p>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Connect a New Social Platform</DialogTitle>
        <DialogContent className="flex flex-wrap gap-4 p-4 bg-white">
          <div
            onClick={handleFacebookConnect}
            className="relative flex flex-col items-center justify-center duration-300 ease-in-out transform rounded-lg cursor-pointer bg-indigo-50 w-36 h-36 hover:scale-105 hover:shadow-lg"
          >
            <img src={fb_icon} className="size-10" alt="Facebook Icon" />
            <p className="font-semibold">Facebook</p>
            <span className="absolute text-xs text-blue-600 bottom-2">
              Click to connect
            </span>
          </div>
          <div className="relative flex flex-col items-center justify-center bg-gray-200 rounded-lg select-none brightness-95 w-36 h-36">
            <img src={ins_icon} className="size-10" alt="Instagram Icon" />
            <p>Instagram</p>
            <span className="absolute text-xs text-gray-500 bottom-2">
              Coming soon
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialLinksPage;
