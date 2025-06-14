import { Button } from "@mui/material"
import { BiEdit } from "react-icons/bi"
import { PauseIcon } from "lucide-react"
import ProjectItemTable from "./components/ProjectItemTable"
import { useLocation } from "react-router-dom"

const AutomationProjectDetails = () => {
    const { state } = useLocation();
    const row = state?.row;
    return (
        <div className="flex flex-col items-center space-y-6 p-4 w-full h-screen text-sm">
            <div className="relative flex items-end gap-6 pb-4 border-mountain-200 border-b w-full">
                <div className="flex flex-col space-y-1 w-96">
                    <p className="text-muted-foreground text-sm">Automation Project</p>
                    <p className="bg-indigo-200 py-1 pl-2 rounded-lg h-9 font-medium text-lg line-clamp-1">{row.projectName}</p>
                </div>
                <div className="flex flex-col space-y-1 w-52">
                    <p className="text-muted-foreground text-sm">Platforms</p>
                    <p className="bg-amber-200 py-1 pl-2 border-1 border-white rounded-lg h-9 font-medium text-lg line-clamp-1">{row.platforms.join(', ')}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <p className="text-muted-foreground text-sm">Status</p>
                    <div className="flex items-center space-x-4 bg-mountain-50 px-2 py-1 border-[1px] border-mountain-200 rounded-lg h-9 text-sm">
                        <div
                            className={`w-2 h-2 rounded-full ${row.status === 'draft'
                                ? 'bg-gray-500'
                                : row.status === 'scheduled'
                                    ? 'bg-yellow-500'
                                    : row.status === 'active'
                                        ? 'bg-green-500'
                                        : row.status === 'canceled'
                                            ? 'bg-red-500'
                                            : 'bg-gray-300'
                                }`}
                        />
                        <span className="font-medium text-lg capitalize">{row.status}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2 ml-auto">
                    <Button className="flex px-4 py-2 border-1 border-mountain-200 font-normal">
                        <BiEdit className="mr-2 size-6" />
                        <span>Edit Project</span>
                    </Button>
                    <Button className="flex px-4 py-2 border-1 border-mountain-200 font-normal">
                        <PauseIcon className="mr-2 size-6" />
                        <span>Pause</span>
                    </Button>
                </div>
            </div>
            <div className="flex w-full">
                <p>Number Of Posts: {row.numberOfPosts}</p>
            </div>
            <div className="flex w-full h-full">
                <ProjectItemTable selectedRow={row} />
            </div>
        </div>
    )
}

export default AutomationProjectDetails