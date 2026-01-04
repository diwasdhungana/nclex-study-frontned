import {
  createDeleteManyMutationHook,
  createDeleteMutationHook,
  createGetQueryHook,
  createPostMutationHook,
  createPutMutationHook,
} from '@/api/helpers';
import { queryClient } from '@/api/query-client';
import { notifications } from '@mantine/notifications';
import { InvalidateQueryFilters } from '@tanstack/react-query';

export const useFileUpload = createPostMutationHook({
  endpoint: '/upload',
  rMutationParams: {
    onSuccess: (data) => {
      notifications.show({ message: 'Image saved Uploaded' });
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
  options: {
    isMultipart: true,
  },
});

export const useDeleteOneUser = createDeleteMutationHook({
  endpoint: '/users/:userId',
  rMutationParams: {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['getSpecificUser'] as InvalidateQueryFilters);
      notifications.show({ title: 'User Deleted', message: 'done.' });
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});

export const useDeleteManyDocument = createDeleteManyMutationHook({
  endpoint: '/documents/bulk',
  rMutationParams: {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['getDocument'] as InvalidateQueryFilters);
      notifications.show({ title: 'Documents Deleted', message: 'done.' });
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});

export const useEditDocuments = createPutMutationHook({
  endpoint: '/documents/:documentId',
  rMutationParams: {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['getDocument'] as InvalidateQueryFilters);
      notifications.show({ title: 'document Edited!', message: 'done.' });
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});

export const useEditDocumentNotify = createPutMutationHook({
  endpoint: '/documents/:documentId',
  rMutationParams: {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['getDocumentNotify'] as InvalidateQueryFilters);
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});

export const usePostDocument = createPostMutationHook({
  endpoint: '/documents',
  rMutationParams: {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['getDocument'] as InvalidateQueryFilters);
      notifications.show({ message: 'Document Uploaded' });
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});
