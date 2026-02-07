

export interface PlaylistArticle {
  id: number;
  name: string;
  image: string;
  color: string;
  articles?: Article[];
}
export interface Article {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  author?: string;
  feedCategory?: string;

  hasAudio?: boolean;
  audio?: {
    streamUrl: string;
    duration?: number;
  };
}

export interface ArticleDetail {
  _id: string;
  title: string;
  description: string;
  summary?: string;
  fullContent?: string;
  paragraphs?: string[];
  imageUrl?: string;
  author?: string;
  pubDate: string;
  category: string;
  tags?: string[];
  hasAudio: boolean;
}


