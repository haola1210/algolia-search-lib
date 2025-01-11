export interface Category {
  id: string;
  name: string;
  full_hierarchy: string;
}

export interface HighlightResult {
  value: string;
  matchLevel: string;
  matchedWords: string[];
}

export interface HighlightedCategory {
  id: HighlightResult;
  name: HighlightResult;
}

export interface HighlightResults {
  title: HighlightResult;
  manufacturer: HighlightResult;
  sku: HighlightResult;
  manufacturerPartNumber: HighlightResult;
  categories: HighlightedCategory[];
}

export interface HitDto {
  url: string;
  id: string;
  title: string;
  image: string;
  hide: number;
  manufacturer: string;
  sku: string;
  manufacturerPartNumber: string;
  previous_item_numbers: string;
  featured: boolean;
  is_spotlight: boolean;
  custom_flag1: boolean;
  custom_flag2: boolean;
  custom_flag3: boolean;
  retail: number;
  price: number;
  sale_price: number;
  stock: number;
  product_status: string;
  reviews_count: number;
  available: number;
  reviews_average: number;
  salesRank: number;
  categories: Category[];
  objectID: string;
  _highlightResult: HighlightResults;
  attr_width: null | number;
  attr_height: null | number;
  attr_depth: null | number;
  attr_dimension: null | string;
}
