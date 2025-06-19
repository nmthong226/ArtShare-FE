import { Button, TextField, Typography } from '@mui/material';
import { Field, Form, Formik, FormikProps } from 'formik';
import { FaSave } from 'react-icons/fa';
import { ProjectFormValues } from '../../types';
import PlatformSelection from './PlatformSelection';

export interface ProjectFormRef {
  submitForm: () => void;
}

interface ProjectFormProps {
  initialValues: ProjectFormValues;
  onSubmit: (
    values: ProjectFormValues,
    // formikActions: FormikHelpers<ProjectFormValues>,
  ) => Promise<void>;
}

const ProjectForm = ({ initialValues, onSubmit }: ProjectFormProps) => {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {(formikProps: FormikProps<ProjectFormValues>) => {
        const { values, setFieldValue } = formikProps;
        return (
          <Form className="relative flex flex-col items-center w-full h-full p-2 bg-white">
            <div className="flex gap-6">
              {/* General Info Section */}
              <div className="flex flex-col space-y-4">
                <h2 className="text-lg font-semibold capitalize">
                  🧠 General Info
                </h2>
                <div className="flex flex-col items-center space-y-4 w-xl">
                  <Typography className="flex w-full mb-1 font-medium text-left">
                    Project Name
                    <span className="text-red-600">*</span>
                  </Typography>
                  <Field
                    name="projectName" // Connects to Formik state
                    as={TextField}
                    className="w-full rounded-md focus:outline-none focus:ring-2 focus:ring-mountain-500"
                    placeholder="Enter your project name"
                    required
                  />
                  <Typography className="flex items-center w-full mb-1 space-x-2 font-medium text-left">
                    <p>Description</p>
                    <span className="text-sm font-normal text-mountain-600">
                      (optional)
                    </span>
                  </Typography>
                  <Field
                    name="description"
                    as={TextField}
                    multiline
                    rows={4}
                    className="rounded-md focus:outline-none focus:ring-2 focus:ring-mountain-500 w-full h-[220px] max-h-[220px] resize-none"
                    placeholder="Enter your project description"
                  />
                </div>
              </div>

              <div className="flex bg-mountain-200 w-0.5 h-full" />

              <PlatformSelection
                initialPlatform={values.platform}
                setFieldValue={setFieldValue}
              />
            </div>
            <Button
              type="submit"
              className={`
                  flex justify-center items-center space-x-2
                  w-48 h-10
                  bg-indigo-600 text-white font-medium
                  rounded-md shadow-sm
                  transition-colors duration-150 ease-in-out
                  hover:bg-indigo-700
                  focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-
                  active:bg-indigo-800
                `}
            >
              <FaSave className="size-5" />
              <span>Save Project</span>
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ProjectForm;
