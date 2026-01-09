import {
  createDeleteManyMutationHook,
  createDeleteMutationHook,
  createGetQueryHook,
  createPostMutationHook,
  createPutMutationHook,
  createPatchMutationHook,
  createPatchMutationHookWithBody,
} from '@/api/helpers';
import { queryClient } from '@/api/query-client';
import { notifications } from '@mantine/notifications';
import { InvalidateQueryFilters } from '@tanstack/react-query';

export const useGetQuestions = createGetQueryHook({
  endpoint: '/questions',
  rQueryParams: { queryKey: ['getQuestions'] },
});
export const useGetArcherQuestions = createGetQueryHook({
  endpoint: 'archer/questions',
  rQueryParams: { queryKey: ['getArcherQuestions'] },
});
export const useGetSpecificQuestion = createGetQueryHook({
  endpoint: '/questions/:questionId',
  rQueryParams: {
    queryKey: ['getSpecificQuestion'],
  },
});
export const useGetSpecificArcherQuestion = createGetQueryHook({
  endpoint: 'archer/questions/:questionId',
  rQueryParams: {
    queryKey: ['getSpecificArcherQuestion'],
  },
});

export const useGetQuestionByHashtag = createGetQueryHook({
  endpoint: '/questions/hashtag/:hashtag',
  rQueryParams: {
    queryKey: ['getQuestionByHashtag'],
  },
});

//api for fetching question sets

export const useGetAllSets = createGetQueryHook({
  endpoint: '/archer/sets',
  rQueryParams: { queryKey: ['getAllSets'] },
});

export const useGetSpecificSet = createGetQueryHook({
  endpoint: '/archer/sets/:setId',
  rQueryParams: {
    queryKey: ['getSpecificSet'],
  },
});

export const usePostSet = createPostMutationHook({
  endpoint: '/archer/sets',
  rMutationParams: {
    onSuccess: (data) => {
      notifications.show({ message: 'Set created successfully', color: 'green' });
      queryClient.invalidateQueries(['getAllSets'] as InvalidateQueryFilters);
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: '#ff4136' });
    },
  },
});

export const usePutSetQuestions = createPutMutationHook({
  endpoint: '/sets/questions/:setId',
  rMutationParams: {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['getSets'] as InvalidateQueryFilters);
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: '#ff4136' });
    },
  },
});

export const useGetAllGroups = createGetQueryHook({
  endpoint: '/questions/groups',
  rQueryParams: { queryKey: ['getGroups'] },
});

export const useGetGroupQuestions = createGetQueryHook({
  endpoint: '/questions/groups/:groupId',
  rQueryParams: {
    queryKey: ['getGroupQuestions'],
  },
});
export const useDeleteGroup = createDeleteMutationHook({
  endpoint: '/questions/groups/:groupId',
  rMutationParams: {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['getGroups'] as InvalidateQueryFilters);
      notifications.show({ message: 'Group deleted successfully', color: 'green' });
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: '#ff4136' });
    },
  },
});

export const usePostGroup = createPostMutationHook({
  endpoint: '/questions/groups',
  rMutationParams: {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['getGroups'] as InvalidateQueryFilters);
      notifications.show({ message: 'Group created successfully', color: 'green' });
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: '#ff4136' });
    },
  },
});

export const useDeleteManyQuestions = createDeleteMutationHook({
  endpoint: '/questions/:id',
  rMutationParams: {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['getQuestions'] as InvalidateQueryFilters);
      notifications.show({ message: 'Question deleted successfully', color: 'green' });
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: '#ff4136' });
    },
  },
});
export const useDeleteManyArcherQuestions = createDeleteMutationHook({
  endpoint: 'archer/questions/:id',
  rMutationParams: {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['getArcherQuestions'] as InvalidateQueryFilters);
      notifications.show({ message: 'Question deleted successfully', color: 'green' });
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: '#ff4136' });
    },
  },
});

export const usePatchArcherSet = createPatchMutationHook({
  endpoint: '/archer/sets/:setId',
  rMutationParams: {
    onSuccess: (data: any) => {
      queryClient.invalidateQueries(['getAllSets'] as InvalidateQueryFilters);
      notifications.show({ message: 'Set updated successfully', color: 'green' });
    },
    onError: (error: any) => {
      notifications.show({ message: error.messages[0], color: '#ff4136' });
    },
  },
});
export const usePatchQuestionOrderInSet = createPatchMutationHookWithBody({
  endpoint: '/archer/sets/reorder-questions/:setId',
  rMutationParams: {
    onSuccess: (data: any) => {
      queryClient.invalidateQueries(['getAllSets'] as InvalidateQueryFilters);
      notifications.show({ message: 'Set updated successfully', color: 'green' });
    },
    onError: (error: any) => {
      notifications.show({ message: error.messages[0], color: '#ff4136' });
    },
  },
});

export const usePostQuestion = createPostMutationHook({
  endpoint: '/questions',
  rMutationParams: {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['getQuestions'] as InvalidateQueryFilters);
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: '#ff4136' });
    },
  },
});

export const usePostArcherQuestion = createPostMutationHook({
  endpoint: '/archer/questions/:setId',
  rMutationParams: {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['getQuestions'] as InvalidateQueryFilters);
    },
    onError: (error) => {
      notifications.show({ message: error.messages[0], color: '#ff4136' });
    },
  },
});
