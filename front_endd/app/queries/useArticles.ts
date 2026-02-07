import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Article } from '@/type';
import { ArticlesResponse } from '@/services/api';
import { keepPreviousData } from '@tanstack/react-query';

// =======================
// PARAM TYPE
// =======================
interface UseArticlesParams {
  category?: string;
  page?: number;
  limit?: number;
  hasAudio?: boolean;
}

// =======================
// HOOK
// =======================
export function useArticles(params: UseArticlesParams = {}) {
  const {
    category,
    page = 1,
    limit = 20,
    hasAudio,
  } = params;

  return useQuery<ArticlesResponse>({
    queryKey: ['articles', { category, page, limit, hasAudio }],
    queryFn: () =>
      api.getArticles({
        category,
        page,
        limit,
        hasAudio,
      }),
    placeholderData: keepPreviousData,
    staleTime: 60_000, // 1 phút
  });
}
