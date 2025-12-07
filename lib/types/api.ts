export interface JstorArticle {
  item_id: string;
  title: string;
  published_date: string;
  creators_string: string;
  url: string;
  content_type: string;
  avg_rating?: number | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export type ArticlesResponse = PaginatedResponse<JstorArticle>;

export interface Mark {
  id: number;
  item_id: string;
  user_id: number;
  note: string | null;
  rating: number | null;
  liked: boolean;
  created_at: string;
}

export interface CreateMarkRequest {
  item_id: string;
  user_id: number;
  note?: string;
  rating?: number;
  liked?: boolean;
}

export interface MarkWithUser extends Mark {
  username: string;
}

export interface RecentMark extends MarkWithUser {
  article_title: string;
  article_creators: string;
}
