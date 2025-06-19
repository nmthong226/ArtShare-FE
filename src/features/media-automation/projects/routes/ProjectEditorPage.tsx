import Loading from '@/components/loading/Loading';
import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';
import { useGetProjectDetails } from '../hooks/useGetProjectDetails';
import { useSaveProject } from '../hooks/useSaveProject';
import { ProjectFormValues } from '../types';

const ProjectEditorPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const isEditMode = !!projectId;

  const { data: projectToEdit, isLoading: isLoadingProject } =
    useGetProjectDetails(projectId, {
      enabled: isEditMode,
    });

  const { mutate: saveProject } = useSaveProject({
    onSuccess: (savedProject) => {
      navigate(`/auto/projects/${savedProject.id}/details`);
    },
  });

  const handleSubmitForm = async (values: ProjectFormValues) => {
    saveProject({
      values,
      id: isEditMode ? parseInt(projectId) : undefined,
    });
  };

  const initialValues = useMemo((): ProjectFormValues => {
    if (isEditMode && projectToEdit) {
      return {
        projectName: projectToEdit.title,
        description: projectToEdit.description,
        platform: projectToEdit.platform, // Assuming the shape matches
      };
    }
    return {
      projectName: '',
      description: '',
      platform: {
        id: -1,
        name: '',
      },
    };
  }, [isEditMode, projectToEdit]);

  if (isEditMode && !projectToEdit) {
    return <div>Project not found or an error occurred.</div>;
  }

  return (
    <Box className="p-3 flex-1">
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? 'Edit Project' : 'Create a New Project'}
      </Typography>

      {isLoadingProject && <Loading />}

      <ProjectForm initialValues={initialValues} onSubmit={handleSubmitForm} />
    </Box>
  );
};

export default ProjectEditorPage;
