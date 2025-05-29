import React from 'react'

//Api/Hooks

//Components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

//Icons
import { BsChevronExpand } from "react-icons/bs";
import { TbChessQueenFilled } from 'react-icons/tb';
// import { getDisplayPlanName, useSubscriptionInfo } from '@/hooks/useSubscription';
// import AsyncWrapper from '../AsyncWrapper';

type UserPlan = {
    expand: boolean
}

const UserPlan: React.FC<UserPlan> = ({ expand }) => {
    // const {
    //     data: subscriptionInfo,
    //     isLoading: loadingSubscriptionInfo,
    //     isError: isSubscriptionError,
    // } = useSubscriptionInfo();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='flex justify-center items-center mt-4 w-full h-12 hover:cursor-pointer'>
                <div className={`${!expand ? 'hidden' : "px-4"} duration-500 ease-in-out flex items-center justify-between bg-indigo-50 rounded-lg h-full w-full`}>
                    <div className={`flex items-center space-x-2`}>
                        <TbChessQueenFilled className='flex-none shrink-0' />
                        <p className={`transition-all duration-300 font-normal flex items-center space-x-4 origin-left ${expand ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'} line-clamp-1 text-sm`}>
                            User Help
                            {/* <AsyncWrapper loading={loadingSubscriptionInfo} error={isSubscriptionError}>
                                <span className='text-mountain-400'> - {subscriptionInfo && getDisplayPlanName(subscriptionInfo.plan)}</span>
                            </AsyncWrapper> */}
                        </p>
                    </div>
                    <BsChevronExpand />
                </div>
                <p className={`${expand ? 'opacity-0 w-0' : 'opacity-100 w-fit'} px-2 py-2 border text-white from-indigo-600 to-purple-600  bg-gradient-to-br border-mountain-100 rounded-lg shadow-sm text-sm`}>Plan</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mb-2 ml-2 border-mountain-100 w-56" side='right'>
                <DropdownMenuLabel className="flex flex-col space-y-1">
                    <p>ArtShare - Beta</p>
                    <p className="font-normal text-moutain-600 text-xs">v1.4.0</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className='text-mountain-600 hover:text-mountain-950 duration-200 transform'>
                        <span className='line-clamp-1'>29/04/25 - Rework Layout</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='text-mountain-600 hover:text-mountain-950 duration-200 transform'>
                        <span className='line-clamp-1'>28/04/25 - Image Editor</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserPlan