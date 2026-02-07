// import { useQuery } from '@tanstack/react-query';
// import { api } from '@/services/api';
// import { PlaylistArticle, Article } from '@/type/index';

// interface PlaylistDetailResponse {
//   playlist: PlaylistArticle;
//   songs: Article[];
// }

// export function usePlaylistDetail(id: number) {
//   return useQuery<PlaylistDetailResponse>({
//     queryKey: ['playlist', id],
//     queryFn: () => api.getPlaylistDetail(id),
//     enabled: !!id,
//   });
// }