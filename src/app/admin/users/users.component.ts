import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Apollo } from 'apollo-angular';
import { search, users } from '@api/user';
import { UntilDestroy, untilDestroyed } from '@core';
import { User, UsersPage } from '@models/user';
import { ROLES } from '@utils/constants';

import { ChangeRolesComponent } from '../change-roles/change-roles.component';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { CredentialsService } from '@app/auth/credentials.service';

interface Response {
  data: {
    users?: UsersPage;
    search?: UsersPage;
  };
}

@UntilDestroy()
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements AfterViewInit {
  isRoot = false;

  data: User[] = [];
  dataSearch: User[] = [];
  searchValue = '';

  displayedColumns: string[] = [
    'curp',
    'nombre',
    'primerApellido',
    'segundoApellido',
    'username',
    'createdAt',
    'roles',
    'actions',
  ];

  resultsLength = 0;
  isLoadingResults = true;
  isError = false;

  emptyResponse: Response = {
    data: {
      users: {
        totalDocs: 0,
        limit: 0,
        totalPages: 0,
        page: 0,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
        hasMore: false,
        docs: [],
      },
    },
  };

  PAGE_SIZE = 10;

  @ViewChild('usersPaginator') usersPaginator: MatPaginator;
  @ViewChild('searchPaginator') searchPaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apollo: Apollo, private credentialsService: CredentialsService, private dialog: MatDialog) {
    this.isRoot = this.credentialsService.isRoot();
  }

  changeRoles(user: User) {
    const { _id, roles, username } = user;
    const dialogRef = this.dialog.open(ChangeRolesComponent, {
      data: {
        _id,
        roles,
        username,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.presentAlert('Usuario actualizado', 'Se han guardado los cambios');
        this.clearSearch();
        this.usersPaginator.page.next({
          pageIndex: this.usersPaginator.pageIndex,
          pageSize: this.PAGE_SIZE,
          length: this.resultsLength,
        });
      }
    });
  }

  clearSearch() {
    this.searchValue = '';
    this.dataSearch = [];
    this.searchPaginator.pageIndex = 0;
  }

  ngAfterViewInit() {
    this.setUserTable();
    this.setSearchTable();
  }

  presentAlert(title: string, message: string) {
    this.dialog.open(DialogComponent, {
      data: {
        title,
        message,
        trueText: 'Aceptar',
      },
    });
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

      this.resultsLength = data.search.totalDocs;
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
              pagination: {
                page: this.searchPaginator.pageIndex,
                size: this.PAGE_SIZE,
              },
            },
          });
        }),
        map(({ data }) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isError = false;
          this.resultsLength = data.search.totalDocs || 0;

          return data.search.docs;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isError = true;
          return observableOf([]);
        })
      )
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.dataSearch = data));
  }

  setUserTable() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.pipe(untilDestroyed(this)).subscribe(() => (this.usersPaginator.pageIndex = 0));

    merge(this.sort.sortChange, this.usersPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.apollo.query<{ users: UsersPage }>({
            query: users,
            variables: {
              pagination: {
                page: this.usersPaginator.pageIndex,
                size: this.PAGE_SIZE,
              },
            },
          });
        }),
        map(({ data }) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isError = false;
          this.resultsLength = data.users.totalDocs || 0;

          return data.users.docs;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isError = true;
          return observableOf([]);
        })
      )
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.data = data));
  }

  transformRoles(roles: string[]) {
    return roles.map((r) => {
      return ROLES[r];
    });
  }
}
