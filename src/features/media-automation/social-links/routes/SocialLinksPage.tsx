import api from '@/api/baseApi';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Check, LoaderPinwheel, Plus, Trash2Icon, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { TiDeleteOutline } from 'react-icons/ti';
import { PlatformStatus } from '../../types';
import { useDisconnectPlatform } from '../hooks/useDisconnectPlatform';
import { usePlatforms } from '../hooks/usePlatforms';
import fb_icon from '/fb_icon.png';
import ins_icon from '/ins_icon.png';
import linkedin_icon from '/linkedin_icon.png';

const SocialLinksPage = () => {
  const { data: platforms = [], isLoading, error } = usePlatforms();
  const {
    mutate: disconnect,
    isPending: isDisconnecting,
    variables: disconnectingId,
  } = useDisconnectPlatform();

  const [selectedPlatformFilter, setSelectedPlatformFilter] =
    useState<string>('All');
  const [searchInput, setSearchInput] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const handleFacebookConnect = async () => {
    try {
      setConnectError(null);
      const currentPageUrl = window.location.href;
      const encodedRedirectUrl = encodeURIComponent(currentPageUrl);
      const response = await api.get(
        `/facebook-integration/initiate-connection-url?successUrl=${encodedRedirectUrl}&errorUrl=${encodedRedirectUrl}`,
      );
      const { facebookLoginUrl } = response.data;
      if (facebookLoginUrl) {
        window.location.href = facebookLoginUrl;
      }
    } catch (err) {
      console.error('Failed to get reconnection URL', err);
      setConnectError(
        'Could not initiate reconnection. Please try again later.',
      );
    }
  };

  const onDisconnectClick = (platformId: number) => {
    if (window.confirm('Are you sure you want to disconnect this account?')) {
      disconnect(platformId);
    }
  };

  const getPlatformIcon = (platformName: string) => {
    switch (platformName.toLowerCase()) {
      case 'facebook':
        return fb_icon;
      case 'instagram':
        return ins_icon;
      case 'linkedin':
        return linkedin_icon;
      default:
        return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }
  };

  const formatExpiryDate = (dateString: string | null) => {
    if (!dateString) return 'Token does not expire';
    const date = new Date(dateString);
    return `Expires: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  const filteredPlatforms = useMemo(() => {
    return platforms
      .filter(
        (acc) =>
          selectedPlatformFilter === 'All' ||
          acc.name.toLowerCase() === selectedPlatformFilter.toLowerCase(),
      )
      .filter((acc) =>
        acc.config.page_name.toLowerCase().includes(searchInput.toLowerCase()),
      );
  }, [platforms, selectedPlatformFilter, searchInput]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full h-[calc(100vh-4rem)]">
      <div className="flex w-full h-full gap-4">
        {/* Filter Panel */}
        <div className="flex flex-col w-1/4 h-full gap-2 space-y-2 bg-white border border-mountain-200 rounded-3xl">
          <div className="flex items-center w-full h-20 p-2 border-b border-mountain-200">
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
            {['All', 'Facebook', 'Instagram'].map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatformFilter(platform)}
                className={`px-4 py-2 text-left rounded-lg transition-all ${
                  selectedPlatformFilter === platform
                    ? 'bg-indigo-100 font-semibold'
                    : 'hover:bg-indigo-50 text-gray-700'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Accounts Panel */}
        <div className="flex flex-col w-3/4 h-full overflow-y-auto bg-white border border-mountain-200 rounded-3xl">
          <div className="z-10 flex items-center justify-between w-full h-20 p-4 border-b shadow-md shrink-0">
            <p className="text-sm font-semibold">
              {selectedPlatformFilter} Platform
            </p>
            <div className="relative flex items-center">
              <FiSearch className="absolute w-5 h-5 text-gray-400 left-2" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by page name..."
                className="w-64 pl-8 pr-8 shadow-inner rounded-2xl"
              />
              {searchInput && (
                <TiDeleteOutline
                  className="absolute w-5 h-5 text-gray-500 cursor-pointer right-2"
                  onClick={() => setSearchInput('')}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col h-full p-4 pr-2 space-y-4 sidebar">
            {isLoading ? (
              <p className="text-gray-500">Loading connections...</p>
            ) : error ? (
              <p className="italic text-red-500">Error: {error.message}</p>
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
                    className={`flex items-center pl-2 space-x-2 rounded-lg w-auto px-3 py-1 text-sm ${account.status === PlatformStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {account.status === PlatformStatus.ACTIVE ? (
                      <Check className="size-4" />
                    ) : (
                      <X className="size-4" />
                    )}
                    <p>
                      {account.status === PlatformStatus.ACTIVE
                        ? 'Connected'
                        : 'Inactive'}
                    </p>
                  </div>
                  <span className="text-sm text-mountain-600">
                    {formatExpiryDate(account.token_expires_at)}
                  </span>
                  <div
                    onClick={() => onDisconnectClick(account.id)}
                    className={`right-4 absolute flex justify-center items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${isDisconnecting && disconnectingId === account.id ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-mountain-100/60 hover:bg-red-100 text-mountain-800 hover:text-red-700 cursor-pointer select-none'}`}
                  >
                    {isDisconnecting && disconnectingId === account.id ? (
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

      {/* Dialog remains the same */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Connect a New Social Platform</DialogTitle>
        <DialogContent className="flex flex-wrap gap-4 p-4 bg-white">
          <div
            onClick={handleFacebookConnect}
            className="relative flex flex-col items-center justify-center w-32 h-32 duration-300 ease-in-out transform rounded-lg cursor-pointer bg-indigo-50 md:w-36 md:h-36 hover:scale-105 hover:shadow-lg"
          >
            <img src={fb_icon} className="size-10" alt="Facebook Icon" />
            <p className="font-semibold">Facebook</p>
            <span className="absolute text-xs text-blue-600 bottom-2">
              Click to connect
            </span>
          </div>
          <div className="relative flex flex-col items-center justify-center w-32 h-32 bg-gray-200 rounded-lg select-none brightness-95 md:w-36 md:h-36">
            <img src={ins_icon} className="size-10" alt="Instagram Icon" />
            <p>Instagram</p>
            <span className="absolute text-xs text-gray-500 bottom-2">
              Coming soon
            </span>
          </div>
          {connectError && (
            <p className="w-full text-sm italic text-red-500">{connectError}</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialLinksPage;
