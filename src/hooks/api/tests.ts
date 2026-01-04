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

export const useCreateTest = createPostMutationHook({
  endpoint: '/tests/new',
  rMutationParams: {
    onSuccess: (data) => {
      window.location.href = '/dashboard/student/active-test';
      notifications.show({ message: 'Test created successfully', color: 'green' });
      queryClient.invalidateQueries(['mytests'] as InvalidateQueryFilters);
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});
export const useCreateArcherTest = createPostMutationHook({
  endpoint: '/archer/tests',
  rMutationParams: {
    onSuccess: (data) => {
      window.location.href = '/dashboard/student/archer/active-test';
      notifications.show({ message: 'Test created successfully', color: 'green' });
      queryClient.invalidateQueries(['myarchertests'] as InvalidateQueryFilters);
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});

export const useGetMyTests = createGetQueryHook({
  endpoint: '/tests/mine',
  rQueryParams: {
    queryKey: ['mytests'],
  },
});
export const useGetMyArcherTests = createGetQueryHook({
  endpoint: '/archer/tests/mine',
  rQueryParams: {
    queryKey: ['myarchertests'],
  },
});
export const useGetSpecificTestQuestion = createGetQueryHook({
  endpoint: '/tests/question/:testId/:index',
  rQueryParams: {
    queryKey: ['getSpecificTestQuestion'],
  },
});
export const useGetSpecificArcherTestQuestion = createGetQueryHook({
  endpoint: '/archer/tests/question/:testId/:index',
  rQueryParams: {
    queryKey: ['getSpecificArcherTestQuestion'],
  },
});
export const usePostSuspendTest = createPostMutationHook({
  endpoint: 'tests/suspend/:testId',
  rMutationParams: {
    onSuccess: (data) => {
      // goto dashboard
      window.location.href = '/dashboard';
      notifications.show({ message: 'Test suspended successfully', color: 'green' });
      queryClient.invalidateQueries(['mytests'] as InvalidateQueryFilters);
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});

export const usePostAnswer = createPostMutationHook({
  endpoint: 'tests/answer/:testId',
  rMutationParams: {
    onSuccess: (data) => {
      notifications.show({
        message: 'Answer Submitted',
        color: 'green',
      });
      return data;
      // queryClient.invalidateQueries(['getSpecificTestQuestion'] as any);
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});

export const usePostArcherAnswer = createPostMutationHook({
  endpoint: '/archer/tests/answer/:testId',
  rMutationParams: {
    onSuccess: (data) => {
      notifications.show({
        message: 'Answer Submitted',
        color: 'green',
      });
      queryClient.invalidateQueries(['getSpecificArcherTestQuestion', 'myarchertests'] as any);
      return data;
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: 'red' });
    },
  },
});
