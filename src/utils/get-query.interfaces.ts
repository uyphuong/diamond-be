import { SortOrder } from 'mongoose';

export interface GetQuery {
  page?: number;
  pageSize?: number;
  sort?: { [key: string]: SortOrder };
  search?: string;
  category?: string;
  trending?: boolean;
  type?: string;
  subCategory?: string;
  product?: string;
  warehouse?: string;
  size?: number;
  fromPrice?: number;
  toPrice?: number;
  fromDate?: string;
  toDate?: string;
  formAtTime?: string;
}
