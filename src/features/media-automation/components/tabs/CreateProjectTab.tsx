import { forwardRef } from 'react';
import { ProjectFormValues } from '../../types';
import ProjectForm, { ProjectFormRef } from '../ProjectForm';

interface CreateProjectTabProps {
  onSubmit: (
    values: ProjectFormValues,
    // formikActions: FormikHelpers<ProjectFormValues>,
  ) => Promise<void>;
}

const CreateProjectTab = forwardRef<ProjectFormRef, CreateProjectTabProps>(
  ({ onSubmit }, ref) => {
    return (
      <ProjectForm
        ref={ref}
        initialValues={{
          projectName: '',
          description: '',
          platform: {
            id: -1,
            name: '',
          },
        }}
        onSubmit={onSubmit}
      />
    );
  },
);

export default CreateProjectTab;
