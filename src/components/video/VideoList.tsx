// src/components/VideoList.tsx
import { useNavigate } from 'react-router-dom';
import { Table, Text, ActionIcon, Group } from '@mantine/core';
import { Video } from '@/pages/dashboard/admin/video/types';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { Modal } from '@mantine/core';

interface VideoListProps {
  videos: Video[];
  onSelect?: (video: Video) => void;
  search: string;
  onSearchChange?: (value: string) => void;
  isAdmin?: boolean;
  onEdit?: (video: Video) => void;
  onDelete?: (video: Video) => void;
  indexFrom?: number; // Optional prop to set the starting index for numbering
}

export const VideoList = ({
  videos,
  onSelect,
  search,
  onSearchChange,
  isAdmin = false,
  onEdit,
  onDelete,
  indexFrom = 1,
}: VideoListProps) => {
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>Video Title</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Subject</Table.Th>
            {isAdmin && <Table.Th>Actions </Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredVideos.map((video, idx) => (
            <Table.Tr
              key={video._id}
              onClick={() => {
                !isAdmin && setPreviewVideo(video);
              }}
            >
              <Table.Td>{indexFrom - idx + 9}</Table.Td>
              <Table.Td>{video.title}</Table.Td>
              <Table.Td>{formatDate(video.createdAt)}</Table.Td>
              <Table.Td>
                <Text>
                  {typeof video.subject === 'object' &&
                  video.subject !== null &&
                  'name' in video.subject
                    ? video.subject.name
                    : 'N/A'}
                </Text>
              </Table.Td>
              {isAdmin && (
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => setPreviewVideo(video)}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                    {isAdmin && onEdit && (
                      <ActionIcon variant="subtle" color="orange" onClick={() => onEdit(video)}>
                        <IconEdit size={16} />
                      </ActionIcon>
                    )}
                    {isAdmin && onDelete && (
                      <ActionIcon variant="subtle" color="red" onClick={() => onDelete(video)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    )}
                  </Group>
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={!!previewVideo}
        onClose={() => setPreviewVideo(null)}
        size="xl"
        title={previewVideo?.title}
      >
        {previewVideo && <VideoPlayer video={previewVideo} onClose={() => setPreviewVideo(null)} />}
      </Modal>
    </>
  );
};
