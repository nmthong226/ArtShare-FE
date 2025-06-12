import { useState, useRef } from "react";
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import ProjectInfoForm, {
  ProjectInfoFormRef,
} from "./components/tabs/ProjectInfoTab";
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
  const [projectName, setProjectName] = useState("");
  const [platform, setPlatform] = useState<Platform | null>(null);

  const projectInfoFormRef = useRef<ProjectInfoFormRef>(null);

  const handleStepChange = (
    stepKey: string,
    data?: { projectName?: string; selectedPlatform?: Platform },
  ) => {
    const newStep = steps.find((s) => s.key === stepKey);
    if (newStep) setStep(newStep);
    if (data?.projectName) setProjectName(data.projectName);
    if (data?.selectedPlatform) setPlatform(data.selectedPlatform);
  };

  const goToNextStep = () => {
    if (step.key === "project-info") {
      projectInfoFormRef.current?.submitForm();

      return;
    }

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
          className="flex items-center justify-center w-48 h-10 space-x-2 duration-300 ease-in-out transform bg-white border rounded-full shadow-sm cursor-pointer disabled:opacity-50 hover:brightness-105 border-mountain-200 text-mountain-950 disabled:cursor-default"
        >
          <FaChevronLeft className="size-5" />
          <p className="">Previous</p>
        </button>
        <button
          onClick={goToNextStep}
          disabled={step.id === steps.length}
          className="flex items-center justify-center w-48 h-10 space-x-2 duration-300 ease-in-out transform border rounded-full shadow-sm cursor-pointer bg-indigo-50 disabled:opacity-50 hover:brightness-105 border-mountain-200 text-mountain-950 disabled:cursor-default"
        >
          <p className="">Next</p>
          <FaChevronRight className="size-5" />
        </button>
        <div className="relative flex items-center justify-between w-full rounded-full shadow-sm">
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
        <div className="flex items-center justify-center w-48 h-10 space-x-2 duration-300 ease-in-out transform bg-white border rounded-md shadow-sm cursor-pointer hover:bg-mountain-50 bg-gradient-to-b from-white via-mountain-50 to-indigo-50 hover:brightness-105 border-mountain-200 shrink-0">
          <FaSave className="text-indigo-600 size-5" />
          <p className="inline-block font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">
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
          className="flex items-center justify-center w-full"
        >
          <ProjectInfoForm
            ref={projectInfoFormRef}
            handleStepChange={(
              _step: string,
              data?: { projectName?: string; selectedPlatform?: Platform },
            ) => handleStepChange("build-posts", data)}
          />
        </TabsContent>
        <TabsContent value="build-posts">
          <ProjectGenPostsTab handleStepChange={handleStepChange} />
        </TabsContent>
        <TabsContent value="edit-posts">
          <ProjectPostCreateForm handleStepChange={handleStepChange} />
        </TabsContent>
        <TabsContent value="review">
          <div className="h-full p-6 bg-white rounded-md shadow">
            <h2 className="mb-2 text-lg font-semibold">Review & Confirm</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              <strong>Project:</strong> {projectName} <br />
              <strong>Platform:</strong> {platform?.name}
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
          <div className="h-full p-6 bg-white rounded-md shadow">
            <h2 className="mb-2 text-lg font-semibold">Launch Workflow</h2>
            <p className="text-sm text-muted-foreground">
              Project <strong>{projectName}</strong> is ready to launch on:
              <br />
              {platform?.name}
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
