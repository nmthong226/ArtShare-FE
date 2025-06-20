import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Newspaper, Plus, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import fb_icon from '/public/fb_icon.png';
import ins_icon from '/public/ins_icon.png';
import linkedin_icon from '/public/linkedin_icon.png';
import { PiArrowsClockwise } from 'react-icons/pi';
import { MdLogout } from 'react-icons/md';
import dayjs from 'dayjs';
import UserGuide from '../components/UserGuide';

const SocialLinksPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Facebook');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogUserGuideOpen, setDialogUserGuideOpen] = useState<boolean>(false);
  const platforms = ['Facebook', 'Instagram', 'LinkedIn', 'Twitter'];
  const facebookProfile = {
    name: 'Travelaro Tralala',
    profilePicture: 'https://i.pravatar.cc/150?img=37',
  };
  const facebookPages = [
    {
      id: 1,
      platform: 'Facebook',
      name: 'John’s Page',
      post: 15,
      status: 'Connected',
      expiredAt: dayjs().add(30, 'day').format('MMM D, YYYY'),
    },
    {
      id: 4,
      platform: 'Facebook',
      name: 'Backup Page',
      post: 2,
      status: 'Connected',
      expiredAt: dayjs().add(30, 'day').format('MMM D, YYYY'),
    },
    {
      id: 2,
      platform: 'Facebook',
      name: 'John’s Page',
      post: 15,
      status: 'Connected',
      expiredAt: dayjs().add(30, 'day').format('MMM D, YYYY'),
    },
    {
      id: 3,
      platform: 'Facebook',
      name: 'John’s Page',
      post: 15,
      status: 'Connected',
      expiredAt: dayjs().add(30, 'day').format('MMM D, YYYY'),
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
  const filteredAccounts = facebookPages.filter((acc) => acc.platform === selectedPlatform);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full h-[calc(100vh-4rem)]">
      <div className="flex gap-4 w-full h-full">
        {/* Filter Panel */}
        <div className="flex flex-col gap-2 space-y-2 bg-white border border-mountain-200 rounded-3xl w-1/4 h-full">
          <div className="flex items-center p-2 border-mountain-200 border-b-1 w-full h-20">
            <div
              onClick={() => setDialogOpen(!dialogOpen)}
              className="flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 opacity-50 hover:brightness-105 p-2 border border-mountain-200 rounded-xl rounded-t-3xl w-full h-full text-white cursor-pointer transform"
            >
              <Plus />
              <p>Connect Platform</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2 px-4">
            {platforms.map((platform) => {
              const isDisabled = platform !== 'Facebook';
              const isSelected = selectedPlatform === platform;
              return (
                <button
                  key={platform}
                  onClick={() => {
                    if (!isDisabled) setSelectedPlatform(platform);
                  }}
                  disabled={isDisabled}
                  className={`relative px-4 border border-mountain-200 py-2 text-left rounded-lg transition-all w-full
                    ${isSelected ? 'bg-indigo-100 font-medium' : 'hover:bg-indigo-50 text-gray-700'}
                    ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}
                  `}
                >
                  {platform}
                  {isDisabled && (
                    <span className="top-1/2 right-3 absolute text-gray-500 text-sm -translate-y-1/2 transform">
                      Coming soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {/* Accounts Panel */}
        <div className="flex flex-col bg-white border border-mountain-200 rounded-3xl w-3/4 h-full overflow-y-auto">
          <div className="z-50 flex justify-between items-center shadow-md p-4 border-mountain-200 border-b-1 w-full h-20 shrink-0">
            <div className='flex items-center space-x-2'>
              <img src={fb_icon} className="size-8" />
              <div className='flex flex-col'>
                <p className="font-semibold text-sm">{selectedPlatform} Account</p>
                <span className="text-gray-500 text-xs">Manage your {selectedPlatform} accounts</span>
              </div>
            </div>
            <div className="relative flex items-center">
              <Button onClick={() => { setDialogUserGuideOpen(!dialogUserGuideOpen) }} className='flex items-center gap-2 shadow-sm px-4 border border-mountain-200 rounded-lg h-10 font-medium text-mountain-800'>
                <Newspaper className='size-4' />
                <p className='text-sm'>User Guide</p>
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4 p-4 pr-2 w-full h-full sidebar">
            {facebookProfile ? (
              <>
                <div className='relative flex flex-col justify-center items-center space-y-2 bg-gradient-to-r from-indigo-50 to-indigo-100 p-2 rounded-lg w-full h-64 shrink-0'>
                  <img src={facebookProfile?.profilePicture} className="rounded-full size-24" />
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-medium text-indigo-600 text-xl'>{facebookProfile.name}</p>
                  </div>
                  <span className='text-sm'>{filteredAccounts.length} Facebook Page{filteredAccounts.length > 1 ? 's' : ''}</span>
                  <div className='top-2 right-2 absolute flex items-center space-x-2 h-10'>
                    <Button className='flex justify-center items-center gap-2 bg-white shadow-md hover:brightness-105 px-4 py-2 rounded-lg h-full font-normal text-mountain-950'>
                      <MdLogout className='size-5' />
                    </Button>
                  </div>
                  <div className='right-2 bottom-2 absolute flex items-center space-x-2 h-10'>
                    <div className='flex justify-center items-center space-x-2 bg-white shadow-md px-2 rounded-lg w-fit h-full text-mountain-800 cursor-pointer select-none'>
                      <PiArrowsClockwise />
                      <span>Reconnect</span>
                    </div>
                  </div>
                </div>
                {filteredAccounts.length === 0 ? (
                  <p className="text-gray-500 italic">Your facebook account needs to have at least 1 page to create the new post automation workflow.</p>
                ) : (
                  filteredAccounts.map((account) => (
                    <div className="relative flex items-center space-x-2 shadow-md px-4 py-2 border border-gray-200 rounded-xl w-full">
                      <div className='flex items-center space-x-2 border-mountain-200 border-r-1 w-[30%] shrink-0'>
                        <img
                          src={getPlatformIcon(account.platform)!}
                          className="size-8"
                        />
                        <div key={account.id} className="flex flex-col">
                          <span className="text-base line-clamp-1">{account.name}</span>
                          <span className="text-mountain-600 text-xs">
                            {account.platform}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center space-x-2 bg-mountain-50 p-2 px-4 rounded-full shrink-0'>
                        <span className="text-mountain-600 text-sm">
                          {account.post} Post{account.post > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className='top-1/2 right-2 absolute flex items-center space-x-2 -translate-y-1/2'>
                        <div className='flex items-center space-x-2 px-4 border border-mountain-200 rounded-full w-fit h-10 text-mountain-600 text-sm cursor-pointer select-none'>
                          <span>Expires at: </span>
                          <span>{account.expiredAt}</span>
                        </div>
                        <Button className="flex justify-center items-center bg-mountain-100/60 px-2 rounded-lg w-fit h-10 text-mountain-800 cursor-pointer select-none">
                          <Trash2Icon className='size-5' />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </>

            ) : (
              <div className='flex flex-col justify-center items-center space-y-2 bg-gradient-to-r from-indigo-50 to-indigo-100 p-2 rounded-lg w-full h-full shrink-0'>
                <p className='text-gray-500'>No Facebook account connected</p>
                <Button onClick={() => setDialogOpen(!dialogOpen)} className='bg-blue-600 hover:brightness-105 px-4 py-2 rounded-lg text-white'>
                  Connect Facebook Account
                </Button>
              </div>
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
      <UserGuide dialogUserGuideOpen={dialogUserGuideOpen} setDialogUserGuideOpen={setDialogUserGuideOpen} />
    </div >
  );
};

export default SocialLinksPage;
