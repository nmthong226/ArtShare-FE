import { useState } from "react";
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ProjectInfoForm from "./components/ProjectInfoTab";
import ProjectPostCreateForm from "./components/ProjectEditPostsTab";
import ProjectGenPostsTab from "./components/ProjectGenPostsTab";

const AutoProjectCreation = () => {
    const steps = [
        { id: 1, key: "project-info", label: "Project Info" },
        { id: 2, key: "generate-posts", label: "Generate Posts" },
        { id: 3, key: "edit-posts", label: "Edit Posts" },
        { id: 4, key: "review", label: "Review & Confirm" },
    ];

    const [step, setStep] = useState(steps[0]);
    const [projectName, setProjectName] = useState("");
    const [platforms, setPlatforms] = useState<Platform[]>([]);

    const handleStepChange = (
        stepKey: string,
        data?: { projectName?: string; selectedPlatform?: Platform[] }
    ) => {
        const newStep = steps.find((s) => s.key === stepKey);
        if (newStep) setStep(newStep);
        if (data?.projectName) setProjectName(data.projectName);
        if (data?.selectedPlatform) setPlatforms(data.selectedPlatform);
    };

    const progress = ((step.id - 1) / (steps.length - 1)) * 100;

    return (
        <div className="flex flex-col space-y-4 p-4 w-full h-[calc(100vh-4rem)]">
            {/* Step Progress Bar */}
            <div className="relative flex justify-between items-start bg-mountain-50 shadow-sm p-3 rounded-lg w-full">
                <div className="top-[18px] right-16 left-14 z-0 absolute bg-mountain-200 h-0.5">
                    <div
                        className={cn("h-full transition-all", "bg-indigo-400")}
                        style={{ width: `calc(${progress}% - 1rem)` }}
                    />
                </div>
                {steps.map((s) => (
                    <div key={s.id} className="z-10 relative flex flex-col items-center min-w-[80px]">
                        <div
                            className={cn(
                                "w-4 h-4 rounded-full mb-1",
                                step.key === s.key ? "bg-indigo-600" : "bg-gray-300"
                            )}
                        />
                        <span
                            className={cn(
                                "text-center capitalize font-thin",
                                step.key === s.key ? "text-indigo-600" : "text-muted-foreground"
                            )}
                        >
                            {s.label}
                        </span>
                    </div>
                ))}
            </div>
            {/* Form Tabs */}
            <Tabs value={step.key} onValueChange={(key) => handleStepChange(key)} className="flex w-full h-full">
                <TabsList className="hidden" />
                <TabsContent value="project-info" className="flex justify-center items-center w-full">
                    <ProjectInfoForm
                        handleStepChange={(_step: string, data?: { projectName?: string; selectedPlatform?: Platform[] }) =>
                            handleStepChange("generate-posts", data)
                        }
                    />
                </TabsContent>
                <TabsContent value="generate-posts">
                    <ProjectGenPostsTab handleStepChange={handleStepChange}/>
                </TabsContent>
                <TabsContent value="edit-posts">
                    <ProjectPostCreateForm handleStepChange={handleStepChange}/>
                    {/* <div className="bg-white shadow p-6 rounded-md h-full">
                        <h2 className="mb-2 font-semibold text-lg">Create & Schedule Posts</h2>
                        <div className="flex justify-between mt-4">
                            <button className="btn" onClick={() => handleStepChange("project-info")}>Back</button>
                            <button className="btn" onClick={() => handleStepChange("review")}>Next</button>
                        </div>
                    </div> */}
                </TabsContent>
                <TabsContent value="review">
                    <div className="bg-white shadow p-6 rounded-md h-full">
                        <h2 className="mb-2 font-semibold text-lg">Review & Confirm</h2>
                        <p className="mb-4 text-muted-foreground text-sm">
                            <strong>Project:</strong> {projectName} <br />
                            <strong>Platforms:</strong> {platforms.join(", ")}
                        </p>
                        <div className="flex justify-between mt-4">
                            <button className="btn" onClick={() => handleStepChange("create-posts")}>Back</button>
                            <button className="btn" onClick={() => handleStepChange("launch")}>Next</button>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="launch">
                    <div className="bg-white shadow p-6 rounded-md h-full">
                        <h2 className="mb-2 font-semibold text-lg">Launch Workflow</h2>
                        <p className="text-muted-foreground text-sm">
                            Project <strong>{projectName}</strong> is ready to launch on: <br />
                            {platforms.join(", ")}
                        </p>
                        <button className="mt-6 btn" onClick={() => alert("Workflow Launched")}>Launch</button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AutoProjectCreation;
