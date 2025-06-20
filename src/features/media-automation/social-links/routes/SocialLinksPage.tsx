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
  const [dialogOpen, setDialogOpen] = useState(false);

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
        return fb_icon;
      case 'instagram':
        return ins_icon;
      case 'linkedin':
        return linkedin_icon;
      default:
        return null;
    }
  };
  // Filter accounts based on selected platform
  const filteredAccounts =
    selectedPlatform === 'All'
      ? socialAccounts
      : socialAccounts.filter((acc) => acc.platform === selectedPlatform);

  const submitSearch = () => {};

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full h-[calc(100vh-4rem)]">
      <div className="flex gap-4 w-full h-full">
        {/* Filter Panel */}
        <div className="flex flex-col gap-2 space-y-2 bg-white border border-mountain-200 rounded-3xl w-1/4 h-full">
          <div className="flex items-center p-2 border-mountain-200 border-b-1 w-full h-20">
            <div
              onClick={() => setDialogOpen(!dialogOpen)}
              className="flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-105 p-2 border border-mountain-200 rounded-xl rounded-t-3xl w-full h-full text-white cursor-pointer transform"
            >
              <Plus />
              <p>New Connect</p>
            </div>
          </div>
          <div className="flex flex-col px-4">
            <h3 className="mb-2 font-semibold text-sm">Platforms</h3>
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-2 text-left rounded-lg transition-all ${
                  selectedPlatform === platform
                    ? 'bg-indigo-100  font-semibold'
                    : 'hover:bg-indigo-50 text-gray-700'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
        {/* Accounts Panel */}
        <div className="flex flex-col bg-white border border-mountain-200 rounded-3xl w-3/4 h-full overflow-y-auto">
          <div className="z-50 flex justify-between items-center shadow-md p-4 border-mountain-200 border-b-1 w-full h-20 shrink-0">
            <p className="font-semibold text-sm">{selectedPlatform} Platform</p>
            <div className="relative flex items-center">
              <FiSearch className="left-2 absolute w-5 h-5" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
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
              />
            </div>
          </div>
          <div className="flex flex-col space-y-4 p-4 pr-2 h-full sidebar">
            {filteredAccounts.length === 0 ? (
              <p className="text-gray-500 italic">No accounts connected.</p>
            ) : (
              filteredAccounts.map((account) => (
                <div className="relative flex items-center space-x-2 bg-gray-50 shadow-sm p-4 border border-gray-200 rounded-xl">
                  <img
                    src={getPlatformIcon(account.platform)!}
                    className="size-8"
                  />
                  <div key={account.id} className="flex flex-col w-[30%]">
                    <span className="text-base">{account.name}</span>
                    <span className="text-mountain-600 text-xs">
                      {account.platform}
                    </span>
                  </div>
                  <div
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
                    ) : (
                      <X className="size-4" />
                    )}
                    <p>{account.status}</p>
                  </div>
                  <span className="text-mountain-600 text-sm">
                    {account.post} Posts
                  </span>
                  <div className="right-2 absolute flex justify-center items-center space-x-1 bg-mountain-100/60 px-2 rounded-lg w-fit h-10 text-mountain-800 cursor-pointer select-none">
                    <Trash2Icon />
                    <p className="text-sm">Disconnect</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(!dialogOpen)}>
        <DialogTitle className="flex items-center space-x-2">
          <p>Connect Social</p>
        </DialogTitle>
        <DialogContent className="flex space-x-8 bg-white p-4 h-fit">
          <div className="relative flex flex-col justify-center items-center bg-indigo-50 rounded-lg w-36 h-36 hover:scale-105 duration-300 ease-in-out cursor-pointer transform">
            <img src={fb_icon} className="size-10" />
            <p>Facebook</p>
            <span className="bottom-2 absolute text-mountain-400 text-xs">
              Click to connect
            </span>
          </div>
          <div className="relative flex flex-col justify-center items-center bg-indigo-50 brightness-95 rounded-lg w-36 h-36 select-none">
            <img src={ins_icon} className="size-10" />
            <p>Instagram</p>
            <span className="bottom-2 absolute text-mountain-400 text-xs">
              Coming soon
            </span>
          </div>
          <div className="relative flex flex-col justify-center items-center bg-indigo-50 brightness-95 rounded-lg w-36 h-36 select-none">
            <img src={linkedin_icon} className="size-10" />
            <p>Linkedin</p>
            <span className="bottom-2 absolute text-mountain-400 text-xs">
              Coming soon
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialLinksPage;
