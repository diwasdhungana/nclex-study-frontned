// src/components/video/VideoForm.tsx
import {
  Button,
  Group,
  Paper,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
  FileInput,
  Text,
  Box,
  CloseButton,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { Video } from '@/pages/dashboard/admin/video/types';
import { useGetSubjects } from '@/hooks';
import { IconPlayerPlayFilled } from '@tabler/icons-react';

interface Props {
  initialValues?: Video;
  onSubmit: (data: FormData) => void;
  onDelete?: () => void;
  onPreview?: () => void;
  isLoading?: boolean;
  isDeleting?: boolean;
  isEdit?: boolean;
  isDisabled?: boolean;
}

export const VideoForm = ({
  initialValues,
  onSubmit,
  onDelete,
  onPreview,
  isLoading = false,
  isDeleting = false,
  isEdit = false,
  isDisabled = false,
}: Props) => {
  const navigate = useNavigate();
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  // Fetch subjects only
  const { data: subjectsData } = useGetSubjects({ query: { getAll: true } });

  const form = useForm({
    initialValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      subject:
        typeof initialValues?.subject === 'object' &&
        initialValues?.subject !== null &&
        'name' in initialValues.subject
          ? initialValues.subject._id
          : typeof initialValues?.subject == 'string'
            ? initialValues.subject
            : '',
      file: null as File | null,
    },
    validate: {
      title: (value) => (!value ? 'Title is required' : null),
      description: (value) => (!value ? 'Description is required' : null),
      subject: (value) => (!value ? 'Subject is required' : null),
      file: (value) => (!isEdit && !value ? 'Video file is required' : null),
    },
  });

  // Handle file preview
  useEffect(() => {
    if (form.values.file) {
      const url = URL.createObjectURL(form.values.file);
      setFilePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [form.values.file]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('title', form.values.title);
    formData.append('description', form.values.description);
    formData.append('subject', form.values.subject);
    if (!isEdit && form.values.file) {
      formData.append('file', form.values.file);
    }
    onSubmit(formData);
  };

  const handleRemoveVideo = () => {
    form.setFieldValue('file', null);
    setFilePreviewUrl(null);
  };

  // Prepare subjects select data
  const subjectsSelectData =
    subjectsData?.data?.docs.map((subject: any) => ({
      value: subject._id,
      label: subject.name,
    })) || [];

  return (
    <Paper shadow="xs" p="xl" radius="lg" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={3}>{isEdit ? 'Edit Video Details' : 'Upload New Video'}</Title>

        {isEdit && (
          <Button mb="md" onClick={onPreview} variant="outline" color="blue" disabled={isDisabled}>
            <IconPlayerPlayFilled size={20} /> Watch Video
          </Button>
        )}
      </Group>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {!isEdit && (
            <>
              <FileInput
                label="Upload Video"
                placeholder="Choose video file"
                accept="video/*"
                onChange={(file) => {
                  form.setFieldValue('file', file);
                  // set the name of the file as the title if not set
                  if (!form.values.title && file) {
                    form.setFieldValue('title', file.name.replace(/\.[^/.]+$/, ''));
                  }
                }}
                error={form.errors.file}
                withAsterisk
                disabled={isDisabled}
              />
            </>
          )}
          <TextInput
            label="Video Title"
            placeholder="Enter video title"
            disabled={isDisabled}
            {...form.getInputProps('title')}
          />

          <Textarea
            label="Description"
            placeholder="Enter a short description"
            autosize
            minRows={3}
            disabled={isDisabled}
            {...form.getInputProps('description')}
          />

          <Select
            label="Select Subject"
            placeholder="Choose a subject"
            data={subjectsSelectData}
            {...form.getInputProps('subject')}
            searchable
            clearable
            disabled={isDisabled}
          />

          {filePreviewUrl && (
            <Box mt="sm" pos="relative">
              <Text size="sm" fw={500} mb="xs">
                Video Preview:
              </Text>
              <Box
                pos="relative"
                style={{
                  borderRadius: 'var(--mantine-radius-md)',
                  overflow: 'hidden',
                  height: 300,
                  backgroundColor: '#000',
                }}
              >
                <video width="100%" height="100%" controls style={{ objectFit: 'contain' }}>
                  <source src={filePreviewUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <CloseButton
                  size="lg"
                  radius="xl"
                  variant="filled"
                  pos="absolute"
                  top={10}
                  right={10}
                  onClick={handleRemoveVideo}
                  style={{ zIndex: 1 }}
                  aria-label="Remove video"
                  disabled={isDisabled}
                />
              </Box>
            </Box>
          )}

          {isEdit && (
            <Text size="sm" c="dimmed" mt="sm">
              Note: Video file cannot be changed in edit mode.
            </Text>
          )}

          <Group justify="space-between" mt="md">
            {isEdit && (
              <Button
                color="#ff4136"
                variant="light"
                onClick={onDelete}
                loading={isDeleting}
                disabled={isDisabled}
              >
                Delete Video
              </Button>
            )}

            <Button type="submit" loading={isLoading} disabled={isDisabled}>
              {isEdit ? 'Update Video' : 'Upload Video'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};
