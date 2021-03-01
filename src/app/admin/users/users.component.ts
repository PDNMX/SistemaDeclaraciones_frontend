import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Apollo } from 'apollo-angular';
import { search, users } from '@api/user';

import { User, UsersPage } from '@models/user';

import { CredentialsService } from '@app/auth/credentials.service';

interface Response {
  data: {
    users?: {
      docs: User[];
      pageNumber: number;
    };
    search?: {
      docs: User[];
      pageNumber: number;
    };
  };
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements AfterViewInit {
  isSuperAdmin = false;

  data: User[] = [];
  dataSearch: User[] = [];
  searchValue = '';

  displayedColumns: string[] = ['curp', 'nombre', 'primerApellido', 'segundoApellido', 'createdAt', 'actions'];

  resultsLength = 0;
  isLoadingResults = true;
  isError = false;

  emptyResponse: Response = {
    data: {
      users: {
        docs: [],
        pageNumber: 0,
      },
    },
  };

  @ViewChild('usersPaginator') usersPaginator: MatPaginator;
  @ViewChild('searchPaginator') searchPaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apollo: Apollo, private credentialsService: CredentialsService) {
    this.isSuperAdmin = this.credentialsService.isSuperAdmin();
  }

  changeRoles(userId: string) {}

  clearSearch() {
    this.searchValue = '';
    this.dataSearch = [];
  }

  async getDeclaraciones(userID: string) {
    /*try {
      const { data }: any = await this.apollo
        .query({
          query: gql`
            query {
              declaraciones(userID: "${userID}") {
                _id
                completa
                simplificada
                tipoDeclaracion
                owner {
                      _id
                      username
                      nombre
                      primerApellido
                      segundoApellido
                      curp
                      rfc {
                        rfc
                        homoClave
                      }
                      roles
                      createdAt
                  }
              }
            }
          `,
        })
        .toPromise();

      console.log('DECLARACIONES', data);
    } catch (error) {
      console.log(error);
    }*/
  }

  async getList() {
    try {
      const { data } = await this.apollo
        .query<{ users: UsersPage }>({
          query: users,
        })
        .toPromise();

      this.data = data.users.docs;
    } catch (error) {
      console.log(error);
    }
  }

  ngAfterViewInit() {
    this.setUserTable();
    this.setSearchTable();
  }

  async search() {
    try {
      const { data } = await this.apollo
        .query<{ search: UsersPage }>({
          query: search,
          variables: {
            keyword: this.searchValue,
          },
        })
        .toPromise();

      this.resultsLength = data.search.docs.length;
      this.dataSearch = data.search.docs;
    } catch (error) {
      console.log(error);
      this.resultsLength = 0;
      this.dataSearch = [];
    }
  }

  setSearchTable() {
    merge(this.searchPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          if (this.searchValue.length <= 1) {
            return observableOf(this.emptyResponse);
          }
          this.isLoadingResults = true;
          return this.apollo.query<{ search: UsersPage }>({
            query: search,
            variables: {
              keyword: this.searchValue,
              pageNumber: this.searchPaginator.pageIndex,
            },
          });
        }),
        map(({ data }) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isError = false;
          this.resultsLength = data.search.docs.length;

          return data.search.docs;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isError = true;
          return observableOf([]);
        })
      )
      .subscribe((data) => (this.dataSearch = data));
  }

  setUserTable() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.usersPaginator.pageIndex = 0));

    merge(this.sort.sortChange, this.usersPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.apollo.query<{ users: UsersPage }>({
            query: users,
            variables: {
              pageNumber: this.usersPaginator.pageIndex,
            },
          });
        }),
        map(({ data }) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isError = false;
          this.resultsLength = data.users.docs.length;

          return data.users.docs;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isError = true;
          return observableOf([]);
        })
      )
      .subscribe((data) => (this.data = data));
  }

  userDetail(id: string) {
    console.log('user clicked', id);
  }
}
