import { useNavigate } from 'react-router-dom';
import { Video } from './types';
import { useGetClassRecordings, useDeleteClassRecording } from '@/hooks/api/video';
import { Button, Group, Stack, Title, Pagination, TextInput, Text, Paper } from '@mantine/core';
import { PiArrowLeft, PiPlus } from 'react-icons/pi';
import { VideoList } from '@/components/video/VideoList';
import { paths } from '@/routes/paths';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import css from '@/pages/dashboard/everything.module.css';
import { modals } from '@mantine/modals';
import { Page } from '@/components/page';

export default function AdminVideoPage() {
  const navigate = useNavigate();

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Number of items per page
  const [jumpToPage, setJumpToPage] = useState('');

  const { data: videoData, refetch } = useGetClassRecordings({
    query: {
      // getAll: true,
      page,
      limit,
    },
  });

  const deleteMutation = useDeleteClassRecording();
  const videos = videoData?.data?.docs || [];
  const totalPages = videoData?.data?.totalPages || 1;
  const totalItems = videoData?.data?.totalDocs || 0;

  // Handle jump to page
  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPage);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setPage(pageNumber);
      window.scrollTo(0, 0);
      setJumpToPage('');
    }
  };

  const handleDelete = (video: Video) => {
    modals.openConfirmModal({
      title: `Delete ${video.title}?`,
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this particular video?</Text>,
      labels: { confirm: 'Delete Video', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteMutation.mutate({ route: { id: video._id } }),
      onWaiting: () => modals.openContextModal('Deleting Video...' as any),
    });
  };

  return (
    <Page title="Manage Recordings" className={css.root}>
      <Stack>
        <Group gap="xl">
          <Button variant="subtle" onClick={() => navigate(paths.dashboard.admin.root)}>
            <PiArrowLeft size="xl" strokeWidth={10} /> {'  '}
            <Title order={3} mx="sm">
              Home
            </Title>
          </Button>
        </Group>

        <Paper shadow="xs" p="lg" radius="lg">
          <Group justify="space-between">
            <Title order={2}>Manage Recordings</Title>
            <Button
              leftSection={<PiPlus size={18} />}
              onClick={() => navigate(paths.dashboard.admin.video.upload)}
            >
              Add Recording
            </Button>
          </Group>

          <VideoList
            videos={videos}
            search=""
            onEdit={(video) => navigate(paths.dashboard.admin.video.edit.replace(':id', video._id))}
            onDelete={handleDelete}
            isAdmin={true}
            indexFrom={totalItems - page * limit + 1}
          />

          <Group justify="space-between" py="md">
            <Group></Group>
            <Pagination
              className={css.paginationControls}
              value={page}
              onChange={(newPage) => {
                setPage(newPage);
                window.scrollTo(0, 0);
              }}
              total={totalPages}
              size="sm"
              radius="xs"
            />
            <Group>
              Jump to page
              <TextInput
                w="80px"
                type="number"
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleJumpToPage();
                  }
                }}
              />
              <Button size="sm" onClick={handleJumpToPage}>
                Go
              </Button>
            </Group>
          </Group>
        </Paper>
      </Stack>
    </Page>
  );
}
