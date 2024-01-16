export class IPaginatedResponse<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
}
