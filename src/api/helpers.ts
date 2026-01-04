import { useState } from 'react';
import {
  MutationOptions,
  QueryClient,
  QueryOptions,
  UndefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { z, ZodError } from 'zod';
import { client } from './axios';

interface EnhancedMutationParams<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
> extends Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationFn' | 'onSuccess' | 'onError' | 'onSettled'
  > {
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: TContext,
    queryClient: QueryClient
  ) => unknown;
  onError?: (
    error: TError,
    variables: TVariables,
    context: TContext | undefined,
    queryClient: QueryClient
  ) => unknown;
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
    context: TContext | undefined,
    queryClient: QueryClient
  ) => unknown;
}

/**
 * Create a URL with query parameters and route parameters
 *
 * @param base - The base URL with route parameters
 * @param queryParams - The query parameters
 * @param routeParams - The route parameters
 * @returns The URL with query parameters
 * @example
 * createUrl('/api/users/:id', { page: 1 }, { id: 1 });
 * // => '/api/users/1?page=1'
 */
function createUrl(
  base: string,
  queryParams?: Record<string, string | number | undefined | (string | number)[]>,
  routeParams?: Record<string, string | number | undefined>
) {
  // Ensure routeParams is a proper object before processing
  const url = Object.entries(routeParams ?? {}).reduce(
    (acc, [key, value]) => acc.replaceAll(`:${key}`, String(value)), // Replace dynamic params in the base URL
    base
  );

  if (!queryParams) return url;

  const query = new URLSearchParams();

  // Append valid query parameters to the URL
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    // Handle case where value is an array (like multiple filters)
    if (Array.isArray(value)) {
      value.forEach((val) => query.append(key, String(val)));
    } else {
      query.append(key, String(value));
    }
  });

  const finalUrl = query.toString() ? `${url}?${query.toString()}` : url;
  return finalUrl;
}

type QueryKey = [string] | [string, Record<string, string | number | undefined>];

function getQueryKey(
  queryKey: QueryKey,
  route: Record<string, string | number | undefined> = {},
  query: Record<string, string | number | undefined> = {}
) {
  // Ensure that queryKey is an array with the main key and the merged query params
  const [mainKey, otherKeys = {}] = queryKey;

  // Return the final query key which is always an array
  return [mainKey, { ...otherKeys, ...route, ...query }];
}

/** Handle request errors */
function handleRequestError(error: unknown) {
  if (isAxiosError(error)) {
    throw error.response?.data;
  }

  if (error instanceof ZodError) {
    console.error(error.format());
  }

  console.log(error);

  throw error;
}

export function createGetQueryHook<
  RouteParams extends Record<string, string | number | undefined> = {},
  QueryParams extends Record<string, string | number | undefined> = {},
>({ endpoint, rQueryParams }: { endpoint: string; rQueryParams?: QueryOptions<any, any, any> }) {
  // Function to handle the API request
  const queryFn = async (params?: { query?: QueryParams; route?: RouteParams }) => {
    const url = createUrl(endpoint, params?.query, params?.route);
    return client
      .get(url)
      .then((response) => response.data)
      .catch(handleRequestError);
  };

  // The hook that will use the query function
  return (
    params?: { query?: QueryParams; route?: RouteParams },
    options?: QueryOptions<any, any, any>
  ) => {
    // Ensure that the queryKey is always an array
    const queryKey = Array.isArray(rQueryParams?.queryKey)
      ? (rQueryParams?.queryKey as QueryKey)
      : ([rQueryParams?.queryKey || endpoint] as QueryKey); // Use endpoint if queryKey is not provided

    // Get the final query key including the route and query params
    const finalQueryKey = getQueryKey(queryKey, params?.route, params?.query);

    return useQuery({
      ...rQueryParams, // Default options
      queryKey: finalQueryKey, // Pass the final query key
      queryFn: () => queryFn(params), // Function to call the API
      ...options, // Override default options with custom options (like `enabled`)
    });
  };
}

/* ---------------------------------- POST ---------------------------------- */

export function createPostMutationHook<
  RouteParams extends Record<string, string | number | undefined> = {},
  QueryParams extends Record<string, string | number | undefined> = {},
>({
  endpoint,
  rMutationParams,
  options,
}: {
  endpoint: string;
  rMutationParams?: MutationOptions<any, any, any>; // Any type for mutation params
  options?: { isMultipart?: boolean }; // Optional multipart option
}) {
  return (params?: { query?: QueryParams; route?: RouteParams }) => {
    const baseUrl = createUrl(endpoint, params?.query, params?.route);

    const mutationFn = async ({
      variables,
      route,
      query,
    }: {
      variables: any; // No schema validation for variables
      query?: QueryParams;
      route?: RouteParams;
    }) => {
      const url = createUrl(baseUrl, query, route);

      const config = options?.isMultipart
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;
      return client
        .post(url, variables, config) // No bodySchema validation here
        .then((response) => {
          return response.data.data; // No responseSchema validation
        })
        .catch(handleRequestError);
    };

    return useMutation({
      ...rMutationParams,
      mutationFn,
      onSuccess: (data, variables, context) =>
        rMutationParams?.onSuccess?.(data, variables, context),
      onError: (error, variables, context) => rMutationParams?.onError?.(error, variables, context),
      onSettled: (data, error, variables, context) =>
        rMutationParams?.onSettled?.(data, error, variables, context),
    });
  };
}

/* ----------------------------------- PUT ---------------------------------- */

/**
 * Create a custom hook for performing PUT requests with react-query and Zod validation
 *
 * @example
 * const useUpdateUser = createPutMutationHook<typeof updateUserSchema, typeof userSchema, { id: string }>({
 *  endpoint: '/api/users/:id',
 *  bodySchema: updateUserSchema,
 *  responseSchema: userSchema,
 *  rMutationParams: { onSuccess: () => queryClient.invalidateQueries('getUsers') },
 * });
 */
export function createPutMutationHook<
  RouteParams extends Record<string, string | number | undefined> = {},
  QueryParams extends Record<string, string | number | undefined> = {},
>({
  endpoint,
  rMutationParams,
  options,
}: {
  endpoint: string;
  rMutationParams?: MutationOptions<any, any, any>; // Any type for mutation params
  options?: { isMultipart?: boolean }; // Optional multipart option
}) {
  return (params?: { query?: QueryParams; route?: RouteParams }) => {
    const queryClient = useQueryClient();

    // Base URL based on endpoint and optional query/route params
    const baseUrl = createUrl(endpoint, params?.query, params?.route);

    // Mutation function
    const mutationFn = async ({
      variables,
      query,
      route,
    }: {
      variables: any;
      query?: QueryParams;
      route?: RouteParams;
    }) => {
      // Create final URL by combining base URL with any additional query/route params
      const url = createUrl(baseUrl, query, route);

      // Set configuration based on whether the request is multipart
      const config = options?.isMultipart
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;

      // Send PUT request with variables and configuration
      return client
        .put(url, variables, config) // No need to parse variables; it's passed directly
        .then((response) => {
          return response.data.data;
        }) // Parse response
        .catch(handleRequestError); // Handle any errors
    };

    // Return the useMutation hook with provided mutation function and lifecycle hooks
    return useMutation({
      ...rMutationParams,
      mutationFn, // Use the mutation function we just defined
      onSuccess: (data, variables, context) =>
        rMutationParams?.onSuccess?.(data, variables, context),
      onError: (error, variables, context) => rMutationParams?.onError?.(error, variables, context),
      onSettled: (data, error, variables, context) =>
        rMutationParams?.onSettled?.(data, error, variables, context),
    });
  };
}

/* --------------------------------- DELETE --------------------------------- */

export function createDeleteManyMutationHook<
  RouteParams extends Record<string, string | number | undefined> = {},
  QueryParams extends Record<string, string | number | undefined> = {},
>({
  endpoint,
  rMutationParams,
  options,
}: {
  endpoint: string;
  rMutationParams?: MutationOptions<any, any, any>; // Any type for mutation params
  options?: { isMultipart?: boolean }; // Optional multipart option
}) {
  return (params?: { query?: QueryParams; route?: RouteParams }) => {
    const baseUrl = createUrl(endpoint, params?.query, params?.route);

    const mutationFn = async ({
      variables,
      route,
      query,
    }: {
      variables: any; // No schema validation for variables
      query?: QueryParams;
      route?: RouteParams;
    }) => {
      const url = createUrl(baseUrl, query, route);

      const config = options?.isMultipart
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;
      return client
        .delete(url, { data: variables }) // No bodySchema validation here
        .then((response) => {
          return response.data.data; // No responseSchema validation
        })
        .catch(handleRequestError);
    };

    return useMutation({
      ...rMutationParams,
      mutationFn,
      onSuccess: (data, variables, context) =>
        rMutationParams?.onSuccess?.(data, variables, context),
      onError: (error, variables, context) => rMutationParams?.onError?.(error, variables, context),
      onSettled: (data, error, variables, context) =>
        rMutationParams?.onSettled?.(data, error, variables, context),
    });
  };
}

export function createDeleteMutationHook<
  RouteParams extends Record<string, string | number | undefined> = {},
  QueryParams extends Record<string, string | number | undefined> = {},
>({
  endpoint,
  rMutationParams,
}: {
  endpoint: string;
  rMutationParams?: MutationOptions<any, any, any>;
}) {
  return (params?: { query?: QueryParams; route?: RouteParams }) => {
    const queryClient = useQueryClient();
    const baseUrl = createUrl(endpoint, params?.query, params?.route);

    // Mutation function for delete
    const mutationFn = async ({ route, query }: { query?: QueryParams; route?: RouteParams }) => {
      const url = createUrl(baseUrl, query, route);
      return client
        .delete(url) // Perform DELETE request
        .catch(handleRequestError); // Handle errors
    };

    return useMutation({
      ...rMutationParams, // Default mutation options
      mutationFn, // Mutation function
      onSuccess: (data, variables, context) =>
        rMutationParams?.onSuccess?.(data, variables, context),
      onError: (error, variables, context) => rMutationParams?.onError?.(error, variables, context),
      onSettled: (data, error, variables, context) =>
        rMutationParams?.onSettled?.(data, error, variables, context),
    });
  };
}

export function createPatchMutationHook<
  RouteParams extends Record<string, string | number | undefined> = {},
  QueryParams extends Record<string, string | number | undefined> = {},
>({
  endpoint,
  rMutationParams,
}: {
  endpoint: string;
  rMutationParams?: MutationOptions<any, any, any>;
}) {
  return (params?: { query?: QueryParams; route?: RouteParams }) => {
    const queryClient = useQueryClient();
    const baseUrl = createUrl(endpoint, params?.query, params?.route);

    // Mutation function for patch
    const mutationFn = async ({ route, query }: { query?: QueryParams; route?: RouteParams }) => {
      const url = createUrl(baseUrl, query, route);
      return client
        .patch(url) // Perform PATCH request
        .catch(handleRequestError); // Handle errors
    };

    return useMutation({
      ...rMutationParams, // Default mutation options
      mutationFn, // Mutation function
      onSuccess: (data, variables, context) =>
        rMutationParams?.onSuccess?.(data, variables, context),
      onError: (error, variables, context) => rMutationParams?.onError?.(error, variables, context),
      onSettled: (data, error, variables, context) =>
        rMutationParams?.onSettled?.(data, error, variables, context),
    });
  };
}

export function createPatchMutationHookWithBody<
  RouteParams extends Record<string, string | number | undefined> = {},
  QueryParams extends Record<string, string | number | undefined> = {},
>({
  endpoint,
  rMutationParams,
}: {
  endpoint: string;
  rMutationParams?: MutationOptions<any, any, any>;
}) {
  return (params?: { query?: QueryParams; route?: RouteParams }) => {
    const queryClient = useQueryClient();
    const baseUrl = createUrl(endpoint, params?.query, params?.route);

    // Mutation function for patch
    const mutationFn = async ({
      variables,
      route,
      query,
    }: {
      variables: any;
      query?: QueryParams;
      route?: RouteParams;
    }) => {
      const url = createUrl(baseUrl, query, route);
      return client
        .patch(url, variables) // Perform PATCH request
        .catch(handleRequestError); // Handle errors
    };

    return useMutation({
      ...rMutationParams, // Default mutation options
      mutationFn, // Mutation function
      onSuccess: (data, variables, context) =>
        rMutationParams?.onSuccess?.(data, variables, context),
      onError: (error, variables, context) => rMutationParams?.onError?.(error, variables, context),
      onSettled: (data, error, variables, context) =>
        rMutationParams?.onSettled?.(data, error, variables, context),
    });
  };
}

/* ------------------------------- PAGINATION ------------------------------- */

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export function usePagination(params?: PaginationParams) {
  const [page, setPage] = useState(params?.page ?? 1);
  const [limit, setLimit] = useState(params?.limit ?? 15);

  const onChangeLimit = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  return { page, limit, setPage, setLimit: onChangeLimit };
}

export const PaginationMetaSchema = z.object({
  total: z.number().int().min(0),
  perPage: z.number().int().positive(),
  currentPage: z.number().int().positive().nullable(),
  lastPage: z.number().int().positive(),
  firstPage: z.number().int().positive(),
  firstPageUrl: z.string(),
  lastPageUrl: z.string(),
  nextPageUrl: z.string().nullable(),
  previousPageUrl: z.string().nullable(),
});

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

interface CreatePaginationQueryHookArgs<DataSchema extends z.ZodType> {
  /** The endpoint for the GET request */
  endpoint: string;
  /** The Zod schema for the data attribute in response */
  dataSchema: DataSchema;
  /** The query parameters for the react-query hook */
  rQueryParams: Omit<UndefinedInitialDataOptions, 'queryFn' | 'queryKey'> & {
    queryKey: QueryKey;
  };
}

export type SortableQueryParams = {
  sort?: `${string}:${'asc' | 'desc'}`;
};

/**
 * Create a custom hook for performing paginated GET requests with react-query and Zod validation
 *
 * @example
 * const useGetUsers = createPaginatedQueryHook<typeof userSchema>({
 *  endpoint: '/api/users',
 *  dataSchema: userSchema,
 *  queryParams: { queryKey: 'getUsers' },
 * });
 */
export function createPaginationQueryHook<
  QueryParams extends Record<string, string | number | undefined> = SortableQueryParams,
  RouteParams extends Record<string, string | number | undefined> = {},
>({
  endpoint,
  rQueryParams,
}: {
  endpoint: string;
  rQueryParams?: QueryOptions<any, any, any>; // General query options without schema validation
}) {
  const queryFn = async (params: {
    query?: QueryParams & PaginationParams;
    route?: RouteParams;
  }) => {
    const url = createUrl(endpoint, params?.query, params?.route);

    return client
      .get(url)
      .then((response) => response.data) // Removed schema validation
      .catch(handleRequestError);
  };

  return (params?: { query: QueryParams & PaginationParams; route?: RouteParams }) => {
    const query = { page: 1, limit: 25, ...params?.query } as unknown as QueryParams;
    const route = params?.route ?? ({} as RouteParams);

    // Ensure that the queryKey is properly constructed
    const queryKey = Array.isArray(rQueryParams?.queryKey)
      ? (rQueryParams.queryKey as QueryKey)
      : ([rQueryParams?.queryKey || endpoint] as QueryKey); // Default to endpoint if queryKey is not provided

    // Build the query key with the current route and query parameters
    const finalQueryKey = getQueryKey(queryKey, route, query);

    return useQuery({
      ...rQueryParams,
      queryKey: finalQueryKey,
      queryFn: () => queryFn({ query, route }),
    });
  };
}
