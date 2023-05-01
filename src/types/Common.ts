export interface Pagination {
    page: number;
    pageSize: number;
}

export interface Sorting {
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}
