// src/pages/dashboard/admin/video/upload.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { VideoForm } from '@/components/video/VideoForm';
import {
  useCreateClassRecording,
  useUpdateClassRecording,
  useGetSpecificClassRecording,
  useDeleteClassRecording,
  useActivateClassRecording,
} from '@/hooks/api/video';
import { notifications } from '@mantine/notifications';
import { Title, Modal, Button, Progress, Box, Text, Group, Stack } from '@mantine/core';
import { paths } from '@/routes/paths';
import { useState } from 'react';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { Video } from './types';
import { formDataToObject } from '@/utilities/form-data';
import axios from 'axios';
import { modals } from '@mantine/modals';
import { PiArrowLeft } from 'react-icons/pi';

export default function VideoUploadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [previewVideo, setPreviewVideo] = useState<Video | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Fetch video data when in edit mode
  const {
    data: videoData,
    isLoading: isLoadingVideo,
    error: isError,
  } = isEdit
    ? useGetSpecificClassRecording({ route: { id } })
    : { data: null, isLoading: false, error: null };

  // Extract the actual video data from the response
  const videoDetails = isEdit && videoData?.data ? videoData.data : null;
  // console.log('videoDetails', videoDetails);
  if (isError) {
    notifications.show({
      message: 'Failed to fetch video details',
      color: 'red',
    });
    return null; // or handle error state appropriately
  }
  const createMutation = useCreateClassRecording();
  const updateMutation = useUpdateClassRecording();
  const deleteMutation = useDeleteClassRecording();
  const activateMutation = useActivateClassRecording();
  const handleSubmit = (formData: FormData) => {
    // ✅ DEBUG: Log the FormData contents before sending to backend
    // logFormData(formData, 'FormData contents before submit');

    if (isEdit && id) {
      updateMutation.mutate(
        { variables: formDataToObject(formData), route: { id } },
        {
          onSuccess: () => {
            notifications.show({ message: 'Video updated successfully' });
            navigate(paths.dashboard.admin.video.root);
          },
        }
      );
    } else {
      const file = formData.get('file');
      //@ts-ignore
      const fileName = file?.name || '';

      const toSendObject = formDataToObject(formData);
      toSendObject.file = { originalName: toSendObject.title + '.' + fileName.split('.')[1] };
      delete toSendObject.title;
      // console.log('toSendObject', toSendObject);

      setIsUploading(true);
      setUploadProgress(0);

      createMutation.mutate(
        { variables: toSendObject },
        {
          onSuccess: async (response) => {
            // Extract presigned URL and recording data from response
            // Accessing data structure correctly
            const presignedUrl = response?.presignedUrl;
            const recordingData = response?.recording;

            if (!presignedUrl) {
              console.error('No presigned URL found in the response:', response);
              setIsUploading(false);

              notifications.show({
                message: 'Failed to get upload URL',
                color: 'red',
              });
              return;
            }

            // Upload the file to S3 using the presigned URL
            //@ts-ignore
            await uploadFileToS3(file, presignedUrl, recordingData);
          },
          onError: (error) => {
            setIsUploading(false);
          },
        }
      );
    }
  };

  const uploadFileToS3 = async (file: File, presignedUrl: string, recordingData: any) => {
    try {
      // console.log('Uploading file to S3:', {
      //   fileName: file.name,
      //   presignedUrl,
      //   recordingData,
      //   type: file.type,
      //   file: file,
      // });

      // Create a new instance of axios with specific config to handle CORS
      const axiosInstance = axios.create();

      // S3 presigned URLs don't need CORS headers from the client
      // The important part is to NOT send credentials and let the presigned URL handle auth
      await axiosInstance.put(presignedUrl, file, {
        // Don't send cookies or credentials with the request
        withCredentials: false,
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        },
      });

      // Upload completed successfully

      notifications.show({
        message: 'Video uploaded successfully!',
        color: 'green',
      });

      //activate the video after upload
      activateMutation.mutate({ route: { id: recordingData._id } });

      setUploadComplete(true);
      setIsUploading(false);
      // Navigate to the video list after a short delay
      setTimeout(() => {
        navigate(paths.dashboard.admin.video.root);
      }, 1500);
    } catch (error) {
      setIsUploading(false);
      console.error('Error uploading to S3:', error);
      notifications.show({
        message: 'Failed to upload video to storage',
        color: 'red',
      });
    }
  };

  const handleDelete = () => {
    if (!id) return;
    modals.openConfirmModal({
      title: `Delete ${videoDetails.title}?`,
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this particular video?</Text>,
      labels: { confirm: 'Delete Video', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteMutation.mutate({ route: { id: videoDetails._id } }),
      onWaiting: () => modals.openContextModal('Deleting Video...' as any),
    });
  };

  const handlePreview = () => {
    if (videoDetails) {
      setPreviewVideo(videoDetails);
    }
  };

  return (
    <div>
      {/* <Title mb="xl">{isEdit ? 'Edit Video' : 'Add New Video'}</Title> */}

      <Group gap="xl" justify="space-between" mb="lg">
        <Button variant="subtle" onClick={() => navigate(paths.dashboard.admin.video.root)}>
          <PiArrowLeft size="lg" strokeWidth={8} />
          <Title order={3} mx="sm">
            Videos
          </Title>
        </Button>
      </Group>
      {isUploading && (
        <Box mb="xl">
          <Text mb="xs" fw={500}>
            Uploading video to cloud storage...
          </Text>
          <Progress
            value={uploadProgress}
            striped
            animated={uploadProgress < 100}
            color={uploadComplete ? 'green' : 'blue'}
            size="md"
            radius="md"
          />
          <Text mt="xs" size="sm" c="dimmed">
            {uploadProgress < 100 ? `${uploadProgress}% complete` : 'Upload complete!'}
          </Text>
        </Box>
      )}
      {!isLoadingVideo && (
        <VideoForm
          initialValues={videoDetails}
          onPreview={handlePreview}
          onSubmit={handleSubmit}
          onDelete={isEdit ? handleDelete : undefined}
          isLoading={
            (createMutation.isPending || updateMutation.isPending || isLoadingVideo) && !isUploading
          }
          isDeleting={deleteMutation.isPending}
          isEdit={isEdit}
          isDisabled={isUploading}
        />
      )}

      <Modal
        opened={!!previewVideo}
        onClose={() => setPreviewVideo(null)}
        size="xl"
        title={previewVideo?.title}
      >
        {previewVideo && <VideoPlayer video={previewVideo} onClose={() => setPreviewVideo(null)} />}
      </Modal>
    </div>
  );
}
