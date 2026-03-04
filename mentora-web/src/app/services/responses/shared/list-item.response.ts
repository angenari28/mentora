export interface ListItem<T> {
  items: T[];
  meta: Meta;
}

export interface Meta {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
