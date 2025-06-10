import { useState } from "react";
import { FaFacebookSquare } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const platforms: Platform[] = [
    {
        id: 1,
        platform: "Facebook",
        accountName: "Kera Shop",
        status: "active",
        dateConnected: new Date("05/05/2025")
    },
    {
        id: 2,
        platform: "Facebook",
        accountName: "Kera Argency",
        status: "active",
        dateConnected: new Date("05/05/2025")
    },
    {
        id: 3,
        platform: "Facebook",
        accountName: "Kera Offical",
        status: "active",
        dateConnected: new Date("05/05/2025")
    },
    {
        id: 4,
        platform: "Facebook",
        accountName: "Kera Argency 1",
        status: "active",
        dateConnected: new Date("05/05/2025")
    },
    {
        id: 5,
        platform: "Facebook",
        accountName: "Kera Argency 2",
        status: "active",
        dateConnected: new Date("05/05/2025")
    },
    {
        id: 6,
        platform: "Facebook",
        accountName: "Kera Argency 3",
        status: "active",
        dateConnected: new Date("05/05/2025")
    },
    {
        id: 7,
        platform: "Instagram",
        accountName: "Kera Beauty",
        status: "active",
        dateConnected: new Date("05/05/2025")
    },
];

interface ProjectInfoProp {
    handleStepChange: (step: string, data?: { projectName?: string; selectedPlatform?: Platform[] }) => void;
}

const ProjectInfoForm: React.FC<ProjectInfoProp> = ({ handleStepChange }) => {
    const [projectName, setProjectName] = useState("");
    const [selectedPlatformType, setSelectedPlatformType] = useState<string | null>(null);
    const platformTypes = [...new Set(platforms.map(p => p.platform))];
    const [selectedPlatform, setSelectedPlatform] = useState<Platform[]>([]);

    const togglePlatform = (platform: Platform) => {
        setSelectedPlatform((prev) =>
            prev.includes(platform)
                ? prev.filter((p) => p !== platform)
                : [...prev, platform]
        );
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleStepChange("create-posts", {
            projectName,
            selectedPlatform,
        });
    };

    const filteredAccounts = selectedPlatformType
        ? platforms.filter(p => p.platform === selectedPlatformType)
        : [];

    return (
        <form
            onSubmit={handleSubmit}
            className="relative flex flex-col items-center bg-white p-2 w-full h-full"
        >
            <div className="flex gap-6 w-full h-full">
                <div className="flex flex-col space-y-4 w-1/2">
                    <h2 className="font-semibold text-lg capitalize">🧠 General Info</h2>
                    <div className="flex flex-col items-center space-y-4 w-full">
                        <label htmlFor="projectName" className="flex mb-1 w-full font-medium text-left">
                            Project Name
                            <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="projectName"
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mountain-500 w-full"
                            placeholder="Enter your project name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                        />
                        <label htmlFor="projectName" className="flex items-center space-x-2 mb-1 w-full font-medium text-left">
                            <p>Target Audience</p>
                            <span className="font-normal text-mountain-600 text-sm">(optional)</span>
                        </label>
                        <input
                            type="text"
                            id="projectName"
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mountain-500 w-full"
                            placeholder="What's the target audience?"
                            value={""}
                            onChange={() => { }}
                        />
                        <label htmlFor="projectName" className="flex items-center space-x-2 mb-1 w-full font-medium text-left">
                            <p>Description</p>
                            <span className="font-normal text-mountain-600 text-sm">(optional)</span>
                        </label>
                        <textarea
                            id="projectName"
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mountain-500 w-full h-[220px] max-h-[220px] resize-none"
                            placeholder="Enter your project description"
                            value={""}
                            onChange={() => { }}
                        />
                    </div>
                </div>
                <div className="flex bg-mountain-200 w-0.5 h-full" />
                <div className="flex flex-col space-y-4 w-1/2">
                    <h2 className="font-semibold text-lg capitalize">🌐 Platform Integration</h2>
                    <div className="flex flex-col w-full">
                        <label className="block mb-1 font-medium">
                            Select Platform
                            <span className="text-red-600">*</span>
                        </label>
                        <Select onValueChange={(value) => {
                            setSelectedPlatformType(value);
                            setSelectedPlatform([]);
                        }}>
                            <SelectTrigger className="w-[180px] data-[size=default]:h-10">
                                <SelectValue placeholder="Choose Platform" />
                            </SelectTrigger>
                            <SelectContent className="border-mountain-100">
                                {platformTypes.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <label className="block mt-6 mb-1 font-medium">
                            Choose Account
                            <span className="text-red-600">*</span>
                        </label>
                        {selectedPlatformType ? (
                            <>
                                <div className="gap-4 grid grid-cols-2 xl:grid-cols-3">
                                    {filteredAccounts.map((platform) => (
                                        <button
                                            type="button"
                                            key={platform.id}
                                            className={`border group relative justify-between bg-mountain-50/60 h-36 p-4 items-start rounded-3xl flex flex-col hover:shadow-md transition ${selectedPlatform.includes(platform)
                                                ? "ring-2 ring-mountain-500 border-mountain-500"
                                                : "border-gray-300"
                                                }`}
                                            onClick={() => togglePlatform(platform)}
                                        >
                                            <div className="flex flex-col items-start space-y-1">
                                                {platform.platform === "Facebook" &&
                                                    <>
                                                        <FaFacebookSquare className="size-10 text-blue-700" />
                                                    </>
                                                }
                                                {platform.platform === "Instagram" &&
                                                    <>
                                                        <img src={'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg'} className="w-10 h-10" />
                                                    </>
                                                }
                                            </div>
                                            <span className="font-medium line-clamp-1">{platform.accountName}</span>
                                            <div className="flex justify-between items-center w-full">
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-2 h-2 rounded-full bg-green-500`} />
                                                    <span className="text-xs capitalize">{platform.status}</span>
                                                </div>
                                                <span className="text-xs">
                                                    {platform.dateConnected.toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="invisible group-hover:visible top-4 right-4 absolute flex bg-white opacity-0 group-hover:opacity-100 border border-mountain-100 rounded-md duration-300 ease-in-out cursor-pointer transform">
                                                <IoMdMore className="size-6 text-mountain-600" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : <p className="text-mountain-600 text-sm">Choose your project platform to continue.</p>}
                    </div>
                </div>
            </div>
        </form>
    );
}

export default ProjectInfoForm;