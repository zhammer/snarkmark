export interface JstorArticle {
  item_id: string;
  title: string;
  published_date: string;
  creators_string: string;
  url: string;
  content_type: string;
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
