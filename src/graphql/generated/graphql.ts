import { useMutation, useQuery, useInfiniteQuery, UseMutationOptions, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/react-query';
import { customFetcher } from '@/app/lib/customFetcher';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type EditUserInput = {
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Metadata = {
  __typename?: 'Metadata';
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  deleteUser: Scalars['Boolean']['output'];
  editUser: User;
  login: AuthPayload;
  logout: Scalars['Boolean']['output'];
  register: AuthPayload;
};


export type MutationCreateUserArgs = {
  country: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  role: Scalars['String']['input'];
  status: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEditUserArgs = {
  id: Scalars['ID']['input'];
  input: EditUserInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type PaginationInput = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  users: UsersResponse;
};


export type QueryUsersArgs = {
  filters?: InputMaybe<UserFilters>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<SortInput>;
};

export type RegisterInput = {
  country: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
};

export type SortInput = {
  field?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  country?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  password?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  registrationDate?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type UserFilters = {
  email?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  data: Array<User>;
  metadata: Metadata;
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, name: string, email: string, role?: string | null, status?: string | null, phone?: string | null, country?: string | null, registrationDate?: string | null } } };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, name: string, email: string, role?: string | null, status?: string | null, phone?: string | null, country?: string | null, registrationDate?: string | null } | null };

export type GetUsersQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filters?: InputMaybe<UserFilters>;
  sort?: InputMaybe<SortInput>;
}>;


export type GetUsersQuery = { __typename?: 'Query', users: { __typename?: 'UsersResponse', data: Array<{ __typename?: 'User', id: string, name: string, email: string, role?: string | null, status?: string | null, registrationDate?: string | null, phone?: string | null, country?: string | null }>, metadata: { __typename?: 'Metadata', total: number, page: number, pageSize: number } } };

export type CreateUserMutationVariables = Exact<{
  name: Scalars['String']['input'];
  email: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  country: Scalars['String']['input'];
  role: Scalars['String']['input'];
  status: Scalars['String']['input'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, name: string, email: string, role?: string | null, status?: string | null, phone?: string | null, country?: string | null, registrationDate?: string | null } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type EditUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: EditUserInput;
}>;


export type EditUserMutation = { __typename?: 'Mutation', editUser: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, country?: string | null, role?: string | null, status?: string | null, registrationDate?: string | null } };



export const LoginDocument = `
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      name
      email
      role
      status
      phone
      country
      registrationDate
    }
  }
}
    `;

export const useLoginMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<LoginMutation, TError, LoginMutationVariables, TContext>) => {
    
    return useMutation<LoginMutation, TError, LoginMutationVariables, TContext>(
      {
    mutationKey: ['Login'],
    mutationFn: (variables?: LoginMutationVariables) => customFetcher<LoginMutation, LoginMutationVariables>(LoginDocument, variables)(),
    ...options
  }
    )};


useLoginMutation.fetcher = (variables: LoginMutationVariables, options?: RequestInit['headers']) => customFetcher<LoginMutation, LoginMutationVariables>(LoginDocument, variables, options);

export const GetCurrentUserDocument = `
    query GetCurrentUser {
  me {
    id
    name
    email
    role
    status
    phone
    country
    registrationDate
  }
}
    `;

export const useGetCurrentUserQuery = <
      TData = GetCurrentUserQuery,
      TError = unknown
    >(
      variables?: GetCurrentUserQueryVariables,
      options?: Omit<UseQueryOptions<GetCurrentUserQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetCurrentUserQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetCurrentUserQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetCurrentUser'] : ['GetCurrentUser', variables],
    queryFn: customFetcher<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, variables),
    ...options
  }
    )};

useGetCurrentUserQuery.getKey = (variables?: GetCurrentUserQueryVariables) => variables === undefined ? ['GetCurrentUser'] : ['GetCurrentUser', variables];

export const useInfiniteGetCurrentUserQuery = <
      TData = InfiniteData<GetCurrentUserQuery>,
      TError = unknown
    >(
      variables: GetCurrentUserQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetCurrentUserQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetCurrentUserQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetCurrentUserQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? variables === undefined ? ['GetCurrentUser.infinite'] : ['GetCurrentUser.infinite', variables],
      queryFn: (metaData) => customFetcher<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetCurrentUserQuery.getKey = (variables?: GetCurrentUserQueryVariables) => variables === undefined ? ['GetCurrentUser.infinite'] : ['GetCurrentUser.infinite', variables];


useGetCurrentUserQuery.fetcher = (variables?: GetCurrentUserQueryVariables, options?: RequestInit['headers']) => customFetcher<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, variables, options);

export const GetUsersDocument = `
    query GetUsers($pagination: PaginationInput, $filters: UserFilters, $sort: SortInput) {
  users(pagination: $pagination, filters: $filters, sort: $sort) {
    data {
      id
      name
      email
      role
      status
      registrationDate
      phone
      country
    }
    metadata {
      total
      page
      pageSize
    }
  }
}
    `;

export const useGetUsersQuery = <
      TData = GetUsersQuery,
      TError = unknown
    >(
      variables?: GetUsersQueryVariables,
      options?: Omit<UseQueryOptions<GetUsersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetUsersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetUsersQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetUsers'] : ['GetUsers', variables],
    queryFn: customFetcher<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, variables),
    ...options
  }
    )};

useGetUsersQuery.getKey = (variables?: GetUsersQueryVariables) => variables === undefined ? ['GetUsers'] : ['GetUsers', variables];

export const useInfiniteGetUsersQuery = <
      TData = InfiniteData<GetUsersQuery>,
      TError = unknown
    >(
      variables: GetUsersQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetUsersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetUsersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetUsersQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? variables === undefined ? ['GetUsers.infinite'] : ['GetUsers.infinite', variables],
      queryFn: (metaData) => customFetcher<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetUsersQuery.getKey = (variables?: GetUsersQueryVariables) => variables === undefined ? ['GetUsers.infinite'] : ['GetUsers.infinite', variables];


useGetUsersQuery.fetcher = (variables?: GetUsersQueryVariables, options?: RequestInit['headers']) => customFetcher<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, variables, options);

export const CreateUserDocument = `
    mutation CreateUser($name: String!, $email: String!, $phone: String!, $country: String!, $role: String!, $status: String!) {
  createUser(
    name: $name
    email: $email
    phone: $phone
    country: $country
    role: $role
    status: $status
  ) {
    id
    name
    email
    role
    status
    phone
    country
    registrationDate
  }
}
    `;

export const useCreateUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateUserMutation, TError, CreateUserMutationVariables, TContext>) => {
    
    return useMutation<CreateUserMutation, TError, CreateUserMutationVariables, TContext>(
      {
    mutationKey: ['CreateUser'],
    mutationFn: (variables?: CreateUserMutationVariables) => customFetcher<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, variables)(),
    ...options
  }
    )};


useCreateUserMutation.fetcher = (variables: CreateUserMutationVariables, options?: RequestInit['headers']) => customFetcher<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, variables, options);

export const DeleteUserDocument = `
    mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)
}
    `;

export const useDeleteUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteUserMutation, TError, DeleteUserMutationVariables, TContext>) => {
    
    return useMutation<DeleteUserMutation, TError, DeleteUserMutationVariables, TContext>(
      {
    mutationKey: ['DeleteUser'],
    mutationFn: (variables?: DeleteUserMutationVariables) => customFetcher<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, variables)(),
    ...options
  }
    )};


useDeleteUserMutation.fetcher = (variables: DeleteUserMutationVariables, options?: RequestInit['headers']) => customFetcher<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, variables, options);

export const EditUserDocument = `
    mutation EditUser($id: ID!, $input: EditUserInput!) {
  editUser(id: $id, input: $input) {
    id
    name
    email
    phone
    country
    role
    status
    registrationDate
  }
}
    `;

export const useEditUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<EditUserMutation, TError, EditUserMutationVariables, TContext>) => {
    
    return useMutation<EditUserMutation, TError, EditUserMutationVariables, TContext>(
      {
    mutationKey: ['EditUser'],
    mutationFn: (variables?: EditUserMutationVariables) => customFetcher<EditUserMutation, EditUserMutationVariables>(EditUserDocument, variables)(),
    ...options
  }
    )};


useEditUserMutation.fetcher = (variables: EditUserMutationVariables, options?: RequestInit['headers']) => customFetcher<EditUserMutation, EditUserMutationVariables>(EditUserDocument, variables, options);
