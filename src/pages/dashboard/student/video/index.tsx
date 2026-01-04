import { useNavigate } from 'react-router-dom';
import { Video } from '../../admin/video/types';
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

  const handleDeletes = (video: Video) => {
    deleteMutation.mutate(
      { route: { id: video._id } },
      {
        onSuccess: () => {
          notifications.show({ message: 'Video deleted successfully' });
          refetch();
        },
        onError: () => {
          notifications.show({ message: 'Error deleting video', color: 'red' });
        },
      }
    );
  };

  return (
    <Page title="Class Recordings" className={css.root}>
      <Stack>
        <Group gap="xl">
          <Button variant="subtle" onClick={() => navigate(paths.dashboard.student.root)}>
            <PiArrowLeft size="xl" strokeWidth={10} /> {'  '}
            <Title order={3} mx="sm">
              Home
            </Title>
          </Button>
        </Group>
      </Stack>
      <Paper shadow="xs" p="lg" radius="lg">
        <Stack ml="md">
          <Title order={2}>Class Recordings</Title>

          <VideoList
            videos={videos}
            search=""
            isAdmin={false}
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
        </Stack>
      </Paper>
    </Page>
  );
}
