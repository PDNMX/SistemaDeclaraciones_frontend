import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Apollo } from 'apollo-angular';

import { declaracionesMetadata, stats } from '@api/declaracion';
import { UntilDestroy, untilDestroyed } from '@core';
import { DeclaracionMetadata, DeclaracionMetadataPage } from '@models/declaracion';

import { CredentialsService } from '@app/auth/credentials.service';

import { MatDialog } from '@angular/material/dialog';
import { PreviewDeclarationComponent } from '@shared/preview-declaration/preview-declaration.component';

@UntilDestroy()
@Component({
  selector: 'app-declaraciones',
  templateUrl: './declaraciones.component.html',
  styleUrls: ['./declaraciones.component.scss'],
})
export class DeclaracionesComponent implements AfterViewInit, OnInit {
  isSuperAdmin = false;
  isRoot = false;

  @ViewChild('totalPaginator') totalPaginator: MatPaginator;
  @ViewChild('inicialPaginator') inicialPaginator: MatPaginator;
  @ViewChild('modificacionPaginator') modificacionPaginator: MatPaginator;
  @ViewChild('conclusionPaginator') conclusionPaginator: MatPaginator;

  displayedColumns = ['tipoDeclaracion', 'declaracionCompleta', 'owner', 'firmada', 'updatedAt'];
  isLoadingResults = true;
  isError = false;

  data: DeclaracionMetadata[] = [];
  dataInicial: DeclaracionMetadata[] = [];
  dataModificacion: DeclaracionMetadata[] = [];
  dataConclusion: DeclaracionMetadata[] = [];

  total = 0;
  totalInicial = 0;
  totalModificacion = 0;
  totalConclusion = 0;

  userID: string = null;

  PAGE_SIZE = 10;

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private credentialsService: CredentialsService,
    private dialog: MatDialog
  ) {
    this.isSuperAdmin = this.credentialsService.isSuperAdmin();
    this.isRoot = this.credentialsService.isRoot();
    if (this.isSuperAdmin || this.isRoot) {
      this.displayedColumns.push('actions');
    }

    this.userID = this.route.snapshot.paramMap.get('userId') || null;
  }

  async getCount() {
    try {
      const { data }: any = await this.apollo
        .query({
          query: stats,
        })
        .toPromise();

      this.total = data.stats.total || 0;
      this.totalInicial = data.stats.counters.find((d: any) => d.tipoDeclaracion === 'INICIAL')?.count || 0;
      this.totalModificacion = data.stats.counters.find((d: any) => d.tipoDeclaracion === 'MODIFICACION')?.count || 0;
      this.totalConclusion = data.stats.counters.find((d: any) => d.tipoDeclaracion === 'CONCLUSION')?.count || 0;
    } catch (error) {
      console.log(error);
    }
  }

  async ngAfterViewInit() {
    this.setTotalTable();
    this.setInicialTable();
    this.setModificacionTable();
    this.setConclusionTable();
  }

  async ngOnInit() {
    await this.getCount();
  }

  previewDeclaration(id: string, publicVersion: boolean = false) {
    const dialogRef = this.dialog.open(PreviewDeclarationComponent, {
      data: {
        id,
        publicVersion,
      },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  setInicialTable() {
    merge(this.inicialPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.apollo.query<{ declaracionesMetadata: DeclaracionMetadataPage }>({
            query: declaracionesMetadata,
            variables: {
              userID: this.userID,
              filter: {
                tipoDeclaracion: 'INICIAL',
              },
              pagination: {
                page: this.inicialPaginator.pageIndex,
                size: this.PAGE_SIZE,
              },
            },
          });
        }),
        map(({ data }) => {
          this.isLoadingResults = false;
          this.isError = false;
          return data.declaracionesMetadata.docs;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isError = true;
          return observableOf([]);
        })
      )
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.dataInicial = data));
  }

  setModificacionTable() {
    merge(this.modificacionPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.apollo.query<{ declaracionesMetadata: DeclaracionMetadataPage }>({
            query: declaracionesMetadata,
            variables: {
              userID: this.userID,
              filter: {
                tipoDeclaracion: 'MODIFICACION',
              },
              pagination: {
                page: this.modificacionPaginator.pageIndex,
                size: this.PAGE_SIZE,
              },
            },
          });
        }),
        map(({ data }) => {
          this.isLoadingResults = false;
          this.isError = false;
          return data.declaracionesMetadata.docs;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isError = true;
          return observableOf([]);
        })
      )
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.dataModificacion = data));
  }

  setConclusionTable() {
    merge(this.conclusionPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.apollo.query<{ declaracionesMetadata: DeclaracionMetadataPage }>({
            query: declaracionesMetadata,
            variables: {
              userID: this.userID,
              filter: {
                tipoDeclaracion: 'CONCLUSION',
              },
              pagination: {
                page: this.conclusionPaginator.pageIndex,
                size: this.PAGE_SIZE,
              },
            },
          });
        }),
        map(({ data }) => {
          this.isLoadingResults = false;
          this.isError = false;
          return data.declaracionesMetadata.docs;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isError = true;
          return observableOf([]);
        })
      )
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.dataConclusion = data));
  }

  setTotalTable() {
    merge(this.totalPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.apollo.query<{ declaracionesMetadata: DeclaracionMetadataPage }>({
            query: declaracionesMetadata,
            variables: {
              userID: this.userID,
              pagination: {
                page: this.totalPaginator.pageIndex,
                size: this.PAGE_SIZE,
              },
            },
          });
        }),
        map(({ data }) => {
          this.isLoadingResults = false;
          this.isError = false;
          return data.declaracionesMetadata.docs;
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
}
