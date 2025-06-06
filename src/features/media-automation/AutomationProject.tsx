import { MdOutlineAddBox } from "react-icons/md"
import ProjectTable from "./components/ProjectTable"
import { FaCalendarCheck, FaCalendarDays } from "react-icons/fa6"
import { FaCalendarTimes } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const AutomationProject = () => {
    const navigate = useNavigate();
    const navigateToCreateProject = () => {
        navigate("/auto/my-projects/new");
    }

    return (
        <div className="flex flex-col space-y-4 p-4 w-full h-screen">
            <div className='flex gap-x-12 w-full'>
                <div onClick={navigateToCreateProject} className='flex justify-center items-center space-x-2 bg-mountain-50 hover:bg-mountain-50/80 shadow-md p-4 rounded-3xl w-1/3 h-28 cursor-pointer'>
                    <MdOutlineAddBox className="size-8" />
                    <p className="font-medium text-lg">Create New Project</p>
                </div>
                <div className='flex justify-center items-center space-x-2 w-2/3 h-28'>
                    <div className="flex justify-between items-center bg-teal-100 p-4 rounded-3xl w-1/3 h-full">
                        <div className="flex flex-col space-y-1">
                            <p className="text-mountain-800 text-xs">Active Workflow</p>
                            <p className="font-medium text-2xl capitalize">12 projects</p>
                        </div>
                        <FaCalendarCheck className="size-10 text-teal-600" />
                    </div>
                    <div className="flex justify-between items-center bg-amber-100 p-4 rounded-3xl w-1/3 h-full">
                        <div className="flex flex-col space-y-1">
                            <p className="text-mountain-800 text-xs">Scheduled Workflows</p>
                            <p className="font-medium text-2xl capitalize">04 projects</p>
                        </div>
                        <FaCalendarDays className="size-10 text-amber-600" />
                    </div>
                    <div className="flex justify-between items-center bg-rose-100 p-4 rounded-3xl w-1/3 h-full">
                        <div className="flex flex-col space-y-1">
                            <p className="text-mountain-800 text-xs">Draft / Paused Workflows</p>
                            <p className="font-medium text-2xl capitalize">01 project</p>
                        </div>
                        <FaCalendarTimes className="size-10 text-rose-600" />
                    </div>
                </div>
            </div>
            <ProjectTable />
        </div>
    )
}

export default AutomationProject