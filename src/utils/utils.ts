import { PaginatedResponse, PaginationMeta } from "../models/index.js";

export function paginate<T>(
  items: T[],
  page: number,
  limit: number
): PaginatedResponse<T> {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (currentPage - 1) * limit;
  const data = items.slice(start, start + limit);

  const pagination: PaginationMeta = {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };

  return { data, pagination };
}

export function parsePagination(
  pageStr?: string,
  limitStr?: string
): { page: number; limit: number } {
  const page = Math.max(1, parseInt(pageStr ?? "1") || 1);
  const limit = Math.min(100, Math.max(1, parseInt(limitStr ?? "10") || 10));
  return { page, limit };
}