export interface PaginatedResponse<T> {
    data: T[]
    total: number
    perPage: number;
    page: number;
}