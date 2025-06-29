import ConfirmationDialog from '@/components/ConfirmationDialog';
import InlineErrorMessage from '@/components/InlineErrorMessage';
import Loading from '@/components/loading/Loading';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';
import { useNumericParam } from '@/hooks/useNumericParam';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { ErrorMessage, Form, Formik, FormikHelpers } from 'formik';
import { Clock, Image } from 'lucide-react';
import { useMemo } from 'react';
import { LuCalendarClock, LuScanEye, LuTrash2 } from 'react-icons/lu';
import * as Yup from 'yup';
import { MAX_IMAGE_COUNT } from '../../constants';
import { useDeleteAutoPost } from '../../hooks/useDeleteAutoPost';
import { useEditAutoPost } from '../../hooks/useEditAutoPost';
import { useGetAutoPostDetails } from '../../hooks/useGetAutoPostDetails';
import { AutoPostFormValues, ImageState } from '../../types';
import PostContentEditor from './PostContentEditor';
import PostImagesEditor from './PostImagesEditor';
import PostScheduleEditor from './PostScheduleEditor';

// import { Link, Element } from "react-scroll";

const EditAutoPostForm = () => {
  // const navigate = useNavigate();
  const postId = useNumericParam('postId');

  const { data: postToEdit, isLoading } = useGetAutoPostDetails(postId);

  const initialValues = useMemo((): AutoPostFormValues => {
    if (postToEdit) {
      const initialImages: ImageState[] = postToEdit.image_urls.map((url) => ({
        id: url,
        status: 'existing',
        url: url,
      }));

      return {
        content: postToEdit.content,
        images: initialImages,
        scheduled_at: postToEdit.scheduled_at,
      };
    }
    return { content: '', images: [], scheduled_at: new Date() };
  }, [postToEdit]);

  const { mutate: editPost } = useEditAutoPost();

  const handleSubmit = (
    values: AutoPostFormValues,
    formikHelpers: FormikHelpers<AutoPostFormValues>,
  ) => {
    if (!postId) {
      formikHelpers.setSubmitting(false);
      return;
    }
    editPost(
      {
        id: postId,
        values,
      },
      {
        onSettled: () => formikHelpers.setSubmitting(false),
      },
    );
  };

  const {
    isDialogOpen,
    itemToConfirm: postIdToDelete,
    openDialog,
    closeDialog,
  } = useConfirmationDialog<number>();

  const { mutate: deletePost, isPending: isDeleting } = useDeleteAutoPost({
    onSuccess: () => {
      closeDialog();
    },
  });

  const handleConfirmDelete = () => {
    if (!postIdToDelete) return;
    deletePost(postIdToDelete);
  };

  if (!postToEdit) {
    return (
      <Box className="flex h-full items-center justify-center">
        <Typography variant="h6" className="text-gray-600">
          Post not found or has been deleted
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={AutoPostSchema}
      onSubmit={handleSubmit}
      enableReinitialize // This is crucial to update the form when `initialValues` change (after data fetching)
    >
      {({ values, setFieldValue, errors, touched }) => {
        return (
          <Form className="bg-mountain-50 flex h-full flex-col">
            <div className="border-mountain-200 flex w-full items-end border-b-1 bg-white p-4 pb-2">
              <div className="flex w-full items-center justify-between">
                <div className="flex space-x-4">
                  <div className="flex py-2">
                    <p className="text-lg font-medium">Post {postId}</p>
                  </div>
                  <div className="bg-mountain-200 flex h-12 w-0.5" />
                  <div className="hover:bg-mountain-50/60 border-mountain-200 flex cursor-pointer items-center space-x-2 rounded-lg border p-2">
                    <LuScanEye />
                    <div>Preview</div>
                  </div>
                  <div className="hover:bg-mountain-50/60 border-mountain-200 flex cursor-pointer items-center space-x-2 rounded-lg border p-2">
                    <Image className="size-4" />
                    <div>Images: {values.images.length}</div>
                  </div>
                  <Tooltip
                    title="This post is scheduled"
                    arrow
                    placement="bottom"
                  >
                    <div className="flex w-fit cursor-pointer items-center space-x-2 rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-800 hover:bg-blue-100/60">
                      <LuCalendarClock className="size-4 shrink-0" />
                      <div className="flex h-8 w-0.5 bg-blue-800" />
                      <p>12/06/2025</p>
                      <p>21:00</p>
                    </div>
                  </Tooltip>
                </div>
                <div className="flex space-x-2">
                  <div className="border-mountain-200 flex items-center space-x-2 rounded-lg border p-2">
                    <Clock className="size-4" />
                    <div className="relative flex flex-col text-xs select-none">
                      <p className="text-mountain-600">Created At</p>
                      <p>09/06/2025</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => openDialog(postId!)}
                    className="bg-mountain-100 hover:bg-mountain-50 border-mountain-200 flex items-center space-x-2 rounded-lg border p-2"
                  >
                    <LuTrash2 className="size-4" />
                    <div>Delete</div>
                  </Button>
                </div>
              </div>
            </div>
            <Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>

            <Box className="ml-4 flex min-h-0 flex-1 flex-col overflow-y-auto">
              <Box>
                <Typography className="border-mountain-200 flex items-center space-x-2 border-b-1 py-2 text-indigo-900">
                  <span className="mr-2">🖊️</span>Post Content
                </Typography>
                <PostContentEditor
                  value={values.content}
                  onChange={(content: string) =>
                    setFieldValue('content', content)
                  }
                />
                <ErrorMessage name="content">
                  {(msg) => <InlineErrorMessage errorMsg={msg} />}
                </ErrorMessage>
              </Box>
              <Box>
                <div className="border-mountain-200 flex items-center space-x-2 border-b-1 py-2 text-indigo-900">
                  <p>🖼️</p>
                  <p>Post Images</p>
                </div>
                <PostImagesEditor
                  images={values.images}
                  onImagesChange={(newImages) =>
                    setFieldValue('images', newImages)
                  }
                  isInvalid={!!(errors.images && touched.images)}
                />
                <ErrorMessage name="images">
                  {(msg) => <InlineErrorMessage errorMsg={msg} />}
                </ErrorMessage>
              </Box>
              <Box>
                <Typography className="border-mountain-200 flex items-center space-x-2 border-b py-2 font-medium text-indigo-900">
                  <span className="mr-2">📅</span> Post Scheduling
                </Typography>
                <PostScheduleEditor
                  value={values.scheduled_at}
                  onChange={(date) => setFieldValue('scheduled_at', date)}
                />
                <ErrorMessage name="scheduled_at">
                  {(msg) => <InlineErrorMessage errorMsg={msg} />}
                </ErrorMessage>
              </Box>
            </Box>
            <ConfirmationDialog
              open={isDialogOpen}
              onClose={closeDialog}
              onConfirm={handleConfirmDelete}
              title="Confirm Deletion"
              contentText="Are you sure you want to permanently delete this post? This action cannot be undone."
              confirmButtonText="Delete Post"
              isConfirming={isDeleting}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditAutoPostForm;

const AutoPostSchema = Yup.object().shape({
  content: Yup.string()
    .required('Post content cannot be empty.')
    .test(
      'has-text',
      'Post content cannot be empty.',
      (value) => !!value?.replace(/<[^>]+>/g, '').trim(), // Strip HTML tags for validation
    ),
  images: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required(),
        status: Yup.string().required(),
        url: Yup.string().required(),
        file: Yup.mixed().optional(),
      }),
    )
    .max(
      MAX_IMAGE_COUNT,
      `You can upload a maximum of ${MAX_IMAGE_COUNT} images.`,
    ),
  scheduled_at: Yup.date().optional().nullable(),
});
