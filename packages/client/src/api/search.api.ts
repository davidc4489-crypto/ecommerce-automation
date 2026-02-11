import { apiPost } from './client.js';

export interface SearchRequest {
  query: string;
  maxPrice?: number;
  category?: string;
}

export interface SearchResponse {
  runId: string;
  status: string;
}

export function startSearch(params: SearchRequest): Promise<SearchResponse> {
  return apiPost<SearchResponse>('/search', params);
}
