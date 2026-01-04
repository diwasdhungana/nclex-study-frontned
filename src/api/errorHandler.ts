import { Mutation, Query, QueryKey } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { removeClientAccessToken, setClientTokens } from './axios';
import { client } from './axios';
import { app } from '../config';

let isRefreshing = false;
const failedQueue: {
  query?: Query<unknown, unknown, unknown, QueryKey>;
  mutation?: Mutation<unknown, unknown, unknown, unknown>;
  variables?: unknown;
}[] = [];

export async function getNewAccessToken() {
  return await client
    .post('/auth/refresh-token', {
      refreshToken: localStorage.getItem(app.refreshTokenStoreKey),
    })
    .then((response) => {
      //   console.log('this is response.data.data : ', response.data.data);
      return response.data.data;
    });
}

const processFailedQueue = () => {
  failedQueue.forEach(({ query, mutation, variables }) => {
    // console.log('processing failed queue');

    if (query) {
      //   console.log('processing failed query');
      query.fetch();
    }
    if (mutation) {
      mutation.execute(variables);
    }
  });
};

const refreshTokenAndRetry = async (
  query?: Query<unknown, unknown, unknown, QueryKey>,
  mutation?: Mutation<unknown, unknown, unknown, unknown>,
  variables?: unknown
) => {
  try {
    if (!isRefreshing) {
      isRefreshing = true;
      failedQueue.push({ query, mutation, variables });
      const token = await getNewAccessToken();
      setClientTokens(token);
      //   console.log('failedQueue : ', failedQueue);
      processFailedQueue();
      isRefreshing = false;
    } else {
      failedQueue.push({ query, mutation, variables });
    }
  } catch {
    removeClientAccessToken();
  }
};

const errorHandler = (
  error: any,
  query?: Query<unknown, unknown, unknown, QueryKey>,
  mutation?: Mutation<unknown, unknown, unknown, unknown>,
  variables?: unknown
) => {
  //   console.log('this is error : ', error);
  const { messages } = error;
  if (messages[0] === 'Bad Token') {
    if (query) refreshTokenAndRetry(query);
    if (mutation) refreshTokenAndRetry(undefined, mutation, variables);
  }
};

export const queryErrorHandler = (
  error: unknown,
  query: Query<unknown, unknown, unknown, QueryKey>
) => {
  errorHandler(error, query, undefined, undefined);
};

export const mutationErrorHandler = (
  error: unknown,
  variables: unknown,
  _context: unknown,
  mutation: Mutation<unknown, unknown, unknown, unknown>
) => {
  errorHandler(error, undefined, mutation, variables);
};
