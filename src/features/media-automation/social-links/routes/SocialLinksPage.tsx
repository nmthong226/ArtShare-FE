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
      <div className="flex w-full h-full gap-4">
        {/* Filter Panel */}
        <div className="flex flex-col w-1/4 h-full gap-2 space-y-2 bg-white border border-mountain-200 rounded-3xl">
          <div className="flex items-center w-full h-20 p-2 border-mountain-200 border-b-1">
            <div
              onClick={() => setDialogOpen(!dialogOpen)}
              className="flex items-center justify-center w-full h-full gap-2 p-2 text-white transform border opacity-50 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-105 border-mountain-200 rounded-xl rounded-t-3xl"
            >
              <Plus />
              <p>Connect Platform</p>
            </div>
          </div>
          <div className="flex flex-col px-4 space-y-2">
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
                    <span className="absolute text-sm text-gray-500 transform -translate-y-1/2 top-1/2 right-3">
                      Coming soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {/* Accounts Panel */}
        <div className="flex flex-col w-3/4 h-full overflow-y-auto bg-white border border-mountain-200 rounded-3xl">
          <div className="z-50 flex items-center justify-between w-full h-20 p-4 shadow-md border-mountain-200 border-b-1 shrink-0">
            <div className='flex items-center space-x-2'>
              <img src={fb_icon} className="size-8" />
              <div className='flex flex-col'>
                <p className="text-sm font-semibold">{selectedPlatform} Account</p>
                <span className="text-xs text-gray-500">Manage your {selectedPlatform} accounts</span>
              </div>
            </div>
            <div className="relative flex items-center">
              <Button onClick={() => { setDialogUserGuideOpen(!dialogUserGuideOpen) }} className='flex items-center h-10 gap-2 px-4 font-medium border rounded-lg shadow-sm border-mountain-200 text-mountain-800'>
                <Newspaper className='size-4' />
                <p className='text-sm'>User Guide</p>
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center w-full h-full p-4 pr-2 space-y-4 sidebar">
            {facebookProfile ? (
              <>
                <div className='relative flex flex-col items-center justify-center w-full h-64 p-2 space-y-2 rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100 shrink-0'>
                  <img src={facebookProfile?.profilePicture} className="rounded-full size-24" />
                  <div className='flex flex-col items-center justify-center'>
                    <p className='text-xl font-medium text-indigo-600'>{facebookProfile.name}</p>
                  </div>
                  <span className='text-sm'>{filteredAccounts.length} Facebook Page{filteredAccounts.length > 1 ? 's' : ''}</span>
                  <div className='absolute flex items-center h-10 space-x-2 top-2 right-2'>
                    <Button className='flex items-center justify-center h-full gap-2 px-4 py-2 font-normal bg-white rounded-lg shadow-md hover:brightness-105 text-mountain-950'>
                      <MdLogout className='size-5' />
                    </Button>
                  </div>
                  <div className='absolute flex items-center h-10 space-x-2 right-2 bottom-2'>
                    <div className='flex items-center justify-center h-full px-2 space-x-2 bg-white rounded-lg shadow-md cursor-pointer select-none w-fit text-mountain-800'>
                      <PiArrowsClockwise />
                      <span>Reconnect</span>
                    </div>
                  </div>
                </div>
                {filteredAccounts.length === 0 ? (
                  <p className="italic text-gray-500">Your facebook account needs to have at least 1 page to create the new post automation workflow.</p>
                ) : (
                  filteredAccounts.map((account) => (
                    <div className="relative flex items-center w-full px-4 py-2 space-x-2 border border-gray-200 shadow-md rounded-xl">
                      <div className='flex items-center space-x-2 border-mountain-200 border-r-1 w-[30%] shrink-0'>
                        <img
                          src={getPlatformIcon(account.platform)!}
                          className="size-8"
                        />
                        <div key={account.id} className="flex flex-col">
                          <span className="text-base line-clamp-1">{account.name}</span>
                          <span className="text-xs text-mountain-600">
                            {account.platform}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center p-2 px-4 space-x-2 rounded-full bg-mountain-50 shrink-0'>
                        <span className="text-sm text-mountain-600">
                          {account.post} Post{account.post > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className='absolute flex items-center space-x-2 -translate-y-1/2 top-1/2 right-2'>
                        <div className='flex items-center h-10 px-4 space-x-2 text-sm border rounded-full cursor-pointer select-none border-mountain-200 w-fit text-mountain-600'>
                          <span>Expires at: </span>
                          <span>{account.expiredAt}</span>
                        </div>
                        <Button className="flex items-center justify-center h-10 px-2 rounded-lg cursor-pointer select-none bg-mountain-100/60 w-fit text-mountain-800">
                          <Trash2Icon className='size-5' />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </>

            ) : (
              <div className='flex flex-col items-center justify-center w-full h-full p-2 space-y-2 rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100 shrink-0'>
                <p className='text-gray-500'>No Facebook account connected</p>
                <Button onClick={() => setDialogOpen(!dialogOpen)} className='px-4 py-2 text-white bg-blue-600 rounded-lg hover:brightness-105'>
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
        <DialogContent className="flex p-4 space-x-8 bg-white h-fit">
          <div className="relative flex flex-col items-center justify-center duration-300 ease-in-out transform rounded-lg cursor-pointer bg-indigo-50 w-36 h-36 hover:scale-105">
            <img src={fb_icon} className="size-10" />
            <p>Facebook</p>
            <span className="absolute text-xs bottom-2 text-mountain-400">
              Click to connect
            </span>
          </div>
          <div className="relative flex flex-col items-center justify-center rounded-lg select-none bg-indigo-50 brightness-95 w-36 h-36">
            <img src={ins_icon} className="size-10" />
            <p>Instagram</p>
            <span className="absolute text-xs bottom-2 text-mountain-400">
              Coming soon
            </span>
          </div>
          <div className="relative flex flex-col items-center justify-center rounded-lg select-none bg-indigo-50 brightness-95 w-36 h-36">
            <img src={linkedin_icon} className="size-10" />
            <p>Linkedin</p>
            <span className="absolute text-xs bottom-2 text-mountain-400">
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
