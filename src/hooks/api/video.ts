import { z } from 'zod';
import { notifications } from '@mantine/notifications';
import {
  createGetQueryHook,
  createPostMutationHook,
  createDeleteMutationHook,
  createPutMutationHook,
  createPatchMutationHook,
} from '@/api/helpers';
import { queryClient } from '@/api/query-client';
import { InvalidateQueryFilters } from '@tanstack/react-query';

// Schema validation for video data
const VideoSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  link: z.string().url(),
  createdAt: z.string().datetime(),
});

const VideoListSchema = z.object({
  docs: z.array(VideoSchema),
  totalDocs: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  page: z.number(),
  pagingCounter: z.number(),
  hasPrevPage: z.boolean(),
  hasNextPage: z.boolean(),
  prevPage: z.number().nullable(),
  nextPage: z.number().nullable(),
});

// API hooks
export const useGetClassRecordings = createGetQueryHook({
  endpoint: '/class-recording',
  rQueryParams: {
    queryKey: ['class-recordings'],
  },
});

export const useGetSpecificClassRecording = createGetQueryHook({
  endpoint: '/class-recording/:id',
  rQueryParams: {
    queryKey: ['class-recordings'],
  },
});

export const useCreateClassRecording = createPostMutationHook({
  endpoint: '/class-recording/info',
  rMutationParams: {
    onSuccess: (data) => {
      //   notifications.show({
      //     title: 'Recording uploaded!',
      //     message: 'New class recording added successfully',
      //   });
      queryClient.invalidateQueries(['class-recordings'] as InvalidateQueryFilters);
      return data;
    },
    onError: (error) => {
      notifications.show({
        message: error.messages[0] || 'Failed to upload recording',
        color: '#ff4136',
      });
    },
  },
});

export const useUpdateClassRecording = createPutMutationHook({
  endpoint: '/class-recording/:id',
  rMutationParams: {
    onSuccess: (data) => {
      notifications.show({
        title: 'Recording updated!',
        message: 'Class recording modified successfully',
      });
      queryClient.invalidateQueries(['class-recordings'] as InvalidateQueryFilters);
      return data;
    },
    onError: (error) => {
      notifications.show({
        message: error.messages[0] || 'Failed to update recording',
        color: '#ff4136',
      });
    },
  },
});

export const useActivateClassRecording = createPatchMutationHook({
  endpoint: '/class-recording/:id',
  rMutationParams: {
    onSuccess: (data) => {
      notifications.show({
        title: 'Recording activated!',
        message: 'Class recording is now active',
      });
      queryClient.invalidateQueries(['class-recordings'] as InvalidateQueryFilters);
      return data;
    },
    onError: (error) => {
      notifications.show({
        message: error.messages[0] || 'Failed to activate recording',
        color: '#ff4136',
      });
    },
  },
});

export const useDeleteClassRecording = createDeleteMutationHook({
  endpoint: '/class-recording/:id',
  rMutationParams: {
    onSuccess: (data) => {
      notifications.show({
        title: 'Recording deleted!',
        message: 'Class recording removed successfully',
      });
      queryClient.invalidateQueries(['class-recordings'] as InvalidateQueryFilters);
      return data;
    },
    onError: (error) => {
      notifications.show({
        message: error.messages[0] || 'Failed to delete recording',
        color: '#ff4136',
      });
    },
  },
});
