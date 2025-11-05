export interface IBaseDAO<T> {
  create(item: T): Promise<any>;
  getByUuid(uuid: string): Promise<any | null>;
  update(uuid: string, item: Partial<T>): Promise<any | null>;
  delete(uuid: string): Promise<boolean>;
  getAll(page: number, limit: number): Promise<IDataPaginator<any>>;
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
