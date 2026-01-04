import { z } from 'zod';
import { notifications } from '@mantine/notifications';

import {
  createDeleteMutationHook,
  createGetQueryHook,
  createPatchMutationHook,
  createPostMutationHook,
  createPutMutationHook,
} from '@/api/helpers';
import { queryClient } from '@/api/query-client';
import { InvalidateQueryFilters } from '@tanstack/react-query';

export const useCreateStudents = createPostMutationHook({
  endpoint: '/users/students',
  rMutationParams: {
    onSuccess: (data) => {
      notifications.show({ title: 'Students added successfully!', message: 'New Users created.' });
      queryClient.invalidateQueries(['users'] as InvalidateQueryFilters);
      return data;
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});

export const useCreateAdmins = createPostMutationHook({
  endpoint: '/users/admins',
  rMutationParams: {
    onSuccess: (data) => {
      notifications.show({ title: 'Admin added successfully!', message: 'New Users created.' });
      queryClient.invalidateQueries(['users'] as InvalidateQueryFilters);
      return data;
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});
export const useEditMyProfile = createPutMutationHook({
  endpoint: '/users/profile',
  rMutationParams: {
    onSuccess: (data) => {
      notifications.show({
        title: 'Changes Saved Successfully!',
        message: 'Login again to view changes.',
      });
      return data;
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});

export const useEditSpecificProfile = createPutMutationHook({
  endpoint: '/users/profile/:id',
  rMutationParams: {
    onSuccess: (data) => {
      notifications.show({ title: 'User Profile Edited!', message: '' });
      queryClient.invalidateQueries(['users'] as InvalidateQueryFilters);
      return data;
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});

export const useDeleteUser = createPatchMutationHook({
  endpoint: '/users/:id',
  rMutationParams: {
    onSuccess: (data) => {
      notifications.show({ title: 'User Disabled!', message: '' });
      queryClient.invalidateQueries(['users'] as InvalidateQueryFilters);
      return data;
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});
export const useUnDeleteUser = createPatchMutationHook({
  endpoint: '/users/:id',
  rMutationParams: {
    onSuccess: (data) => {
      notifications.show({ title: 'User Enabled!', message: '' });
      queryClient.invalidateQueries(['users'] as InvalidateQueryFilters);
      return data;
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});

export const useGetUsers = createGetQueryHook({
  endpoint: '/users',
  rQueryParams: {
    queryKey: ['users'],
  },
});

export const usePostLogoutUser = createPostMutationHook({
  endpoint: '/auth/logout-user',
  rMutationParams: {
    onSuccess: (data) => {
      notifications.show({ title: 'User logged out successfully', message: '' });
      queryClient.invalidateQueries(['users'] as InvalidateQueryFilters);
      return data;
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});
