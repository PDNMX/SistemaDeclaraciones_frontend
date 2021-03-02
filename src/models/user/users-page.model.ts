import { User } from './user.model';

export interface UsersPage {
  totalDocs: number | null;
  limit: number | null;
  totalPages: number | null;
  page: number | null;
  pagingCounter: number | null;
  hasPrevPage: boolean | null;
  hasNextPage: boolean | null;
  prevPage: number | null;
  nextPage: number | null;
  hasMore: boolean | null;
  docs: User[];
}
