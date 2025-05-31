import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ProjectDialogProps } from "../types/types"
import { Button } from "@mui/material"
import { BiEdit } from "react-icons/bi"
import { PauseIcon } from "lucide-react"
import ProjectItemTable from "./ProjectItemTable"

const ProjectDetailsModal: React.FC<ProjectDialogProps> = ({ selectedRow, openDiaLog, setOpenDialog }) => {
    return (
        <Dialog open={openDiaLog} onOpenChange={setOpenDialog}>
            <DialogContent className="flex flex-col items-center border-mountain-200 min-w-7xl h-[700px]">
                <DialogHeader hidden>
                    <DialogTitle>Project Details</DialogTitle>
                    <DialogDescription>
                        Here are the details of the selected project.
                    </DialogDescription>
                </DialogHeader>
                {selectedRow && (
                    <div className="flex flex-col items-center space-y-6 w-full text-sm">
                        <div className="relative flex items-end gap-6 pb-4 border-mountain-200 border-b w-full">
                            <div className="flex flex-col space-y-1 w-96">
                                <p className="text-muted-foreground text-sm">Automation Project</p>
                                <p className="bg-indigo-200 py-1 pl-2 rounded-lg font-medium text-lg line-clamp-1">{selectedRow.projectName}</p>
                            </div>
                            <div className="flex flex-col space-y-1 w-52">
                                <p className="text-muted-foreground text-sm">Platforms</p>
                                <p className="bg-amber-200 py-1 pl-2 border-1 border-white rounded-lg font-medium text-lg line-clamp-1">{selectedRow.platforms.join(', ')}</p>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <p className="text-muted-foreground text-sm">Status</p>
                                <div className="flex items-center space-x-4 bg-mountain-50 px-2 py-1 border-[1px] border-mountain-200 rounded-lg text-sm">
                                    <div
                                        className={`w-2 h-2 rounded-full ${selectedRow.status === 'draft'
                                            ? 'bg-gray-500'
                                            : selectedRow.status === 'scheduled'
                                                ? 'bg-yellow-500'
                                                : selectedRow.status === 'active'
                                                    ? 'bg-green-500'
                                                    : selectedRow.status === 'canceled'
                                                        ? 'bg-red-500'
                                                        : 'bg-gray-300'
                                            }`}
                                    ></div>
                                    <span className="font-medium text-lg capitalize">{selectedRow.status}</span>
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
                            <p>Number Of Posts: {selectedRow.numberOfPosts}</p>
                            <div>

                            </div>
                        </div>
                        <div className="flex w-full h-full">
                            <ProjectItemTable selectedRow={selectedRow}/>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ProjectDetailsModal