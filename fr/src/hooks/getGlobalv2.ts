import { UseQueryOptions, useQuery } from "@tanstack/react-query";

const getGlobalv2 = <T>(
  _Tname: T,
  queryKey: string[],
  service: any,
  page = 0, // Default page number
  pageSize = 10,
  searchQuery?: string, // Default page size
  opts?: UseQueryOptions<T[], Error, any, any>,
  filters?: Record<string, any>
) => {
  const paginatedQueryKey = [...queryKey, page, pageSize, searchQuery, filters]; // Append page and pageSize to the query key

  return useQuery<T[], Error, any, any>({
    queryKey: paginatedQueryKey,
    queryFn: async () => {
      const response = await service.getalls(
        page,
        pageSize,
        searchQuery,
        filters
      );

      return response;
    },
    keepPreviousData: true,

    ...opts,
  });
};

export default getGlobalv2;
