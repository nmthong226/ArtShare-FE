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

type UserPlan = {
    expand: boolean
}

const UserPlan: React.FC<UserPlan> = ({ expand }) => {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='flex justify-center items-center mt-4 w-full h-12'>
                <div className={`${!expand ? 'hidden' : "px-2"} duration-500 ease-in-out flex items-center shadow-sm justify-between bg-white rounded-lg h-full w-full`}>
                    <div className={`flex items-center space-x-2`}>
                        <div className='flex justify-center items-center bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full w-8 h-8 text-white shrink-0'>
                            <TbChessQueenFilled className='flex-none shrink-0' />
                        </div>
                        <p className={`transition-all ease-in-out duration-300 font-normal origin-left ${expand ? 'opacity-100 scale-x-100 text-mountain-950' : 'text-indigo-50 opacity-0 scale-x-0'} line-clamp-1 text-sm`}>
                            User Plan<span className='text-mountain-400'> - Free</span>
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