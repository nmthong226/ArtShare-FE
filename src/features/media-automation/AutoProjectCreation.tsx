import { useState } from "react";
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ProjectInfoForm from "./components/tabs/ProjectInfoTab";
import ProjectPostCreateForm from "./components/tabs/ProjectEditPostsTab";
import ProjectGenPostsTab from "./components/tabs/ProjectGenPostsTab";
import { FaInfoCircle, FaSave } from "react-icons/fa";
import {
  FaCalendar,
  FaChevronLeft,
  FaChevronRight,
  FaPenFancy,
} from "react-icons/fa6";

const AutoProjectCreation = () => {
  const steps = [
    { id: 1, key: "project-info", label: "Project Info", icon: FaInfoCircle },
    { id: 2, key: "build-posts", label: "Build Posts", icon: FaPenFancy },
    { id: 3, key: "scheduling", label: "Scheduling", icon: FaCalendar },
  ];

  const [step, setStep] = useState(steps[0]);

  //Project Info
  const [projectName, setProjectName] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const handleStepChange = (
    stepKey: string,
    data?: { projectName?: string; selectedPlatform?: Platform[] },
  ) => {
    const newStep = steps.find((s) => s.key === stepKey);
    if (newStep) setStep(newStep);
    if (data?.projectName) setProjectName(data.projectName);
    if (data?.selectedPlatform) setPlatforms(data.selectedPlatform);
  };

  const goToNextStep = () => {
    const currentIndex = steps.findIndex((s) => s.key === step.key);
    const nextStep = steps[currentIndex + 1];
    if (nextStep) setStep(nextStep);
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.findIndex((s) => s.key === step.key);
    const prevStep = steps[currentIndex - 1];
    if (prevStep) setStep(prevStep);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh)]">
      {/* Step Progress Bar */}
      <div className="flex justify-center items-center space-x-2 px-4 h-[8%]">
        <button
          onClick={goToPreviousStep}
          disabled={step.id === 1}
          className="flex justify-center items-center space-x-2 bg-white disabled:opacity-50 shadow-sm hover:brightness-105 border border-mountain-200 rounded-full w-48 h-10 text-mountain-950 duration-300 ease-in-out cursor-pointer disabled:cursor-default transform"
        >
          <FaChevronLeft className="size-5" />
          <p className="">Previous</p>
        </button>
        <button
          onClick={goToNextStep}
          disabled={step.id === steps.length}
          className="flex justify-center items-center space-x-2 bg-indigo-50 disabled:opacity-50 shadow-sm hover:brightness-105 border border-mountain-200 rounded-full w-48 h-10 text-mountain-950 duration-300 ease-in-out cursor-pointer disabled:cursor-default transform"
        >
          <p className="">Next</p>
          <FaChevronRight className="size-5" />
        </button>
        <div className="relative flex justify-between items-center shadow-sm rounded-full w-full">
          {steps.map((s, index) => {
            const isFirst = index === 0;
            const isLast = index === steps.length - 1;
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className={cn(
                  "z-10 relative flex items-center bg-mountain-50 shadow-md space-x-2 h-10 px-2 w-1/3",
                  isFirst && "rounded-l-full",
                  isLast && "rounded-r-full",
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-full",
                    step.key === s.key
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-300 text-gray-600",
                  )}
                >
                  <Icon className="text-xs" />
                </div>
                <span
                  className={cn(
                    "text-center capitalize font-thin",
                    step.key === s.key
                      ? "text-indigo-600"
                      : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center items-center space-x-2 bg-white hover:bg-mountain-50 bg-gradient-to-b from-white via-mountain-50 to-indigo-50 shadow-sm hover:brightness-105 border border-mountain-200 rounded-md w-48 h-10 duration-300 ease-in-out cursor-pointer shrink-0 transform">
          <FaSave className="size-5 text-indigo-600" />
          <p className="inline-block bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 font-medium text-transparent">
            Save Project
          </p>
        </div>
      </div>
      {/* Form Tabs */}
      <Tabs
        value={step.key}
        onValueChange={(key) => handleStepChange(key)}
        className="flex w-full h-[87%]"
      >
        <TabsList className="hidden" />
        <TabsContent
          value="project-info"
          className="flex justify-center items-center w-full"
        >
          <ProjectInfoForm
            handleStepChange={(
              _step: string,
              data?: { projectName?: string; selectedPlatform?: Platform[] },
            ) => handleStepChange("generate-posts", data)}
          />
        </TabsContent>
        <TabsContent value="build-posts">
          <ProjectGenPostsTab handleStepChange={handleStepChange} />
        </TabsContent>
        <TabsContent value="edit-posts">
          <ProjectPostCreateForm handleStepChange={handleStepChange} />
        </TabsContent>
        <TabsContent value="review">
          <div className="bg-white shadow p-6 rounded-md h-full">
            <h2 className="mb-2 font-semibold text-lg">Review & Confirm</h2>
            <p className="mb-4 text-muted-foreground text-sm">
              <strong>Project:</strong> {projectName} <br />
              <strong>Platforms:</strong> {platforms.join(", ")}
            </p>
            <div className="flex justify-between mt-4">
              <button
                className="btn"
                onClick={() => handleStepChange("create-posts")}
              >
                Back
              </button>
              <button
                className="btn"
                onClick={() => handleStepChange("launch")}
              >
                Next
              </button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="launch">
          <div className="bg-white shadow p-6 rounded-md h-full">
            <h2 className="mb-2 font-semibold text-lg">Launch Workflow</h2>
            <p className="text-muted-foreground text-sm">
              Project <strong>{projectName}</strong> is ready to launch on:{" "}
              <br />
              {platforms.join(", ")}
            </p>
            <button
              className="mt-6 btn"
              onClick={() => alert("Workflow Launched")}
            >
              Launch
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutoProjectCreation;
