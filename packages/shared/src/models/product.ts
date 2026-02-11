export interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  productURL: string;
  imageURL?: string;
  source: string;
}

export interface SearchQuery {
  query: string;
  maxPrice?: number;
  category?: string;
}

export interface SearchResult {
  products: Product[];
  query: SearchQuery;
  searchDurationMs: number;
  timestamp: string;
}
