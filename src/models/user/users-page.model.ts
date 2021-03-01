import { User } from './user.model';

export interface UsersPage {
  docs: User[];
  pageNumber: number;
}
