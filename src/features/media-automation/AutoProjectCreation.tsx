import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useMemo, useRef, useState } from 'react';

import { FaInfoCircle, FaSave } from 'react-icons/fa';
import {
  FaCalendar,
  FaChevronLeft,
  FaChevronRight,
  FaPenFancy,
} from 'react-icons/fa6';
import { ProjectFormRef } from './components/ProjectForm';
import CreateProjectTab from './components/tabs/CreateProjectTab';
import ProjectPostCreateForm from './components/tabs/ProjectEditPostsTab';
import ProjectGenPostsTab from './components/tabs/ProjectGenPostsTab';
import { useCreateProject } from './hooks/useCreateProject';
import { ProjectFormValues } from './types';

const AutoProjectCreation = () => {
  const steps = useMemo(
    () => [
      {
        id: 1,
        key: 'project-info' as CreateStep,
        label: 'Project Info',
        icon: FaInfoCircle,
      },
      {
        id: 2,
        key: 'build-posts' as CreateStep,
        label: 'Build Posts',
        icon: FaPenFancy,
      },
      {
        id: 3,
        key: 'scheduling' as CreateStep,
        label: 'Scheduling',
        icon: FaCalendar,
      },
    ],
    [],
  );

  const projectFormRef = useRef<ProjectFormRef>(null);
  const [currentStep, setCurrentStep] = useState<CreateStep>('project-info');
  const [projectName, setProjectName] = useState('');
  const [platformName, setPlatformName] = useState<string | null>(null);

  const isCurrentlyFirstStep = useMemo(
    () => currentStep === steps[0].key,
    [currentStep, steps],
  );
  const isCurrentlyLastStep = useMemo(
    () => currentStep === steps[steps.length - 1].key,
    [currentStep, steps],
  );

  const handleStepChange = (stepKey: string) => {
    setCurrentStep(stepKey as CreateStep);
  };

  const goToNextStep = () => {
    if (currentStep === 'project-info') {
      projectFormRef.current?.submitForm();
      return;
    }
    if (isCurrentlyLastStep) {
      return;
    }

    const currentIndex = steps.findIndex((s) => s.key === currentStep);
    const nextStep = steps[currentIndex + 1];
    setCurrentStep(nextStep.key);
  };

  const goToPreviousStep = () => {
    if (isCurrentlyFirstStep) {
      return;
    }
    const currentIndex = steps.findIndex((s) => s.key === currentStep);
    const prevStep = steps[currentIndex - 1];
    setCurrentStep(prevStep.key);
  };

  const { mutate: createProject } = useCreateProject({
    onSuccess: () => setCurrentStep('build-posts'),
  });

  const handleSubmitCreateProject = async (values: ProjectFormValues) => {
    createProject(values);

    setProjectName(values.projectName);
    setPlatformName(values.platform.name);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh)]">
      {/* Step Progress Bar */}
      <div className="flex justify-center items-center space-x-2 px-4 h-[8%]">
        <button
          onClick={goToPreviousStep}
          disabled={isCurrentlyFirstStep}
          className="flex justify-center items-center space-x-2 bg-white disabled:opacity-50 shadow-sm hover:brightness-105 border border-mountain-200 rounded-full w-48 h-10 text-mountain-950 duration-300 ease-in-out cursor-pointer disabled:cursor-default transform"
        >
          <FaChevronLeft className="size-5" />
          <p className="">Previous</p>
        </button>
        <button
          onClick={goToNextStep}
          disabled={isCurrentlyLastStep}
          className="flex justify-center items-center space-x-2 bg-indigo-50 disabled:opacity-50 shadow-sm hover:brightness-105 border border-mountain-200 rounded-full w-48 h-10 text-mountain-950 duration-300 ease-in-out cursor-pointer disabled:cursor-default transform"
        >
          <p className="">Next</p>
          <FaChevronRight className="size-5" />
        </button>
        <div className="relative flex justify-between items-center shadow-sm rounded-full w-full">
          {steps.map((s, index) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className={cn(
                  'z-10 relative flex items-center bg-mountain-50 shadow-md space-x-2 h-10 px-2 w-1/3',
                  index === 0 && 'rounded-l-full',
                  index === steps.length - 1 && 'rounded-r-full',
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 flex items-center justify-center rounded-full',
                    currentStep === s.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-300 text-gray-600',
                  )}
                >
                  <Icon className="text-xs" />
                </div>
                <span
                  className={cn(
                    'text-center capitalize font-thin',
                    currentStep === s.key
                      ? 'text-indigo-600'
                      : 'text-muted-foreground',
                  )}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center items-center space-x-2 bg-white hover:bg-mountain-50 bg-gradient-to-b from-white via-mountain-50 to-indigo-50 shadow-sm hover:brightness-105 border border-mountain-200 rounded-md w-48 h-10 duration-300 ease-in-out cursor-pointer transform shrink-0">
          <FaSave className="size-5 text-indigo-600" />
          <p className="inline-block bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 font-medium text-transparent">
            Save Project
          </p>
        </div>
      </div>
      {/* Form Tabs */}
      <Tabs
        value={currentStep}
        onValueChange={(key) => handleStepChange(key as CreateStep)}
        className="flex w-full h-[87%]"
      >
        <TabsList className="hidden" />
        <TabsContent
          value="project-info"
          className="flex justify-center items-center w-full"
        >
          <CreateProjectTab
            ref={projectFormRef}
            onSubmit={handleSubmitCreateProject}
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
              <strong>PlatformName:</strong> {platformName}
            </p>
            <div className="flex justify-between mt-4">
              <button
                className="btn"
                onClick={() => handleStepChange('create-posts')}
              >
                Back
              </button>
              <button
                className="btn"
                onClick={() => handleStepChange('launch')}
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
              Project <strong>{projectName}</strong> is ready to launch on:
              <br />
              {platformName}
            </p>
            <button
              className="mt-6 btn"
              onClick={() => alert('Workflow Launched')}
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

type CreateStep = 'project-info' | 'build-posts' | 'scheduling';
