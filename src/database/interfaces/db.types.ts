export interface IBaseDAO<T> {
  create(item: T): Promise<T>;
  getByUuid(uuid: string): Promise<T | null>;
  update(uuid: string, item: Partial<T>): Promise<T | null>;
  delete(uuid: string): Promise<boolean>;
  getAll(page: number, limit: number): Promise<IDataPaginator<T>>;
}

export interface IDataPaginator<T> {
  success: boolean;
  data: T[];
  page: number;
  limit: number;
  count: number;
  totalCount: number;
  totalPages: number;
}
