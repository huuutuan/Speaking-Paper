const API_URL = 'http://172.20.10.4:3000/api/v1';
import { Article, ArticleDetail } from '@/type/index';
// =======================
// BASIC TYPES (inline)
// =======================



export interface ArticlesResponse {
  data: Article[];
  message: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ArticleDetailResponse {
  success: boolean;
  message: string;
  data: ArticleDetail;
}


export interface Playlist {
  id: number;
  name: string;
  image?: string;
  color?: string;
}

// =======================
// HELPER
// =======================

async function fetchJSON<T = any>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json();
}

// =======================
// API
// =======================

export const api = {
  // ===================
  // PLAYLIST
  // ===================
  getPlaylists: () =>
    fetchJSON<Playlist[]>(`${API_URL}/playlists`),

  getPlaylistDetail: (id: number) =>
    fetchJSON<{
      playlist: Playlist;
      articles: Article[];
    }>(`${API_URL}/playlists/${id}`),

  // ===================
  // ARTICLES
  // ===================
  getArticles: (params?: {
    category?: string;
    page?: number;
    limit?: number;
    hasAudio?: boolean;
  }) => {
    const query = new URLSearchParams();

    if (params?.category) query.set('category', params.category);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.hasAudio !== undefined) {
      query.set('hasAudio', String(params.hasAudio));
    }

    const qs = query.toString();

    return fetchJSON<ArticlesResponse>(
      `${API_URL}/articles${qs ? `?${qs}` : ''}`
    );
  },

  // ===================
  // ARTICLE DETAIL
  // ===================
  getArticleDetail: (id: string) =>
    fetchJSON<ArticleDetailResponse>(`${API_URL}/articles/${id}`),

  // ===================
  // AUDIO
  // ===================
  getArticleAudioUrl: (articleId: string) =>
    `${API_URL}/articles/audios/${articleId}/stream`,
};
