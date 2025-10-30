import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { merge, of as observableOf, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTabGroup } from '@angular/material/tabs';

import { Apollo } from 'apollo-angular';

import { declaracionesMetadata, stats } from '@api/declaracion';
import { UntilDestroy, untilDestroyed } from '@core';
import { Catalogo, DeclaracionMetadata, DeclaracionMetadataPage } from '@models/declaracion';

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

  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChild('totalSort') totalSort: MatSort;
  @ViewChild('inicialSort') inicialSort: MatSort;
  @ViewChild('modificacionSort') modificacionSort: MatSort;
  @ViewChild('conclusionSort') conclusionSort: MatSort;

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

  pageSizeOptions = [5, 10, 25, 100];
  userInstitucion: Catalogo = null;

  // Sujetos para controlar los eventos de las tablas
  private tableUpdate$ = new Subject<void>();
  private currentPaginator: MatPaginator;
  private currentSort: MatSort;
  private currentFilterType: string | null = null;
  
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
    this.userInstitucion = this.credentialsService.credentials.user.institucion;
  }

  async getCount() {
    try {
      const { data }: any = await this.apollo
        .query({
          query: stats,
          fetchPolicy: 'no-cache', // Evita caché para tener siempre los totales actualizados
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

  ngAfterViewInit() {
    // Configura la tabla inicial
    this.updateCurrentTable(0);
    
    // Una única suscripción que reacciona a los cambios
    this.tableUpdate$
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const variables: any = {
            userID: this.userID,
            pagination: {
              page: this.currentPaginator.pageIndex,
              size: this.currentPaginator.pageSize,
              sort: this.currentSort.active,
              direction: this.currentSort.direction,
            },
          };
          if (this.currentFilterType) {
            variables.filter = { tipoDeclaracion: this.currentFilterType };
          }
          return this.apollo.query<{ declaracionesMetadata: DeclaracionMetadataPage }>({
            query: declaracionesMetadata,
            variables,
            fetchPolicy: 'no-cache', // Asegura que el ordenamiento siempre vaya al servidor
          });
        }),
        map(({ data }) => {
          this.isLoadingResults = false;
          this.isError = false;
          const docs = data.declaracionesMetadata.docs;
          // Asigna los datos al dataSource correcto
          switch (this.tabGroup.selectedIndex) {
            case 0: this.data = docs; break;
            case 1: this.dataInicial = docs; break;
            case 2: this.dataModificacion = docs; break;
            case 3: this.dataConclusion = docs; break;
          }
          // No necesitamos devolver nada aquí porque ya actualizamos el dataSource
          return;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isError = true;
          return observableOf([]);
        })
      )
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  async ngOnInit() {
    await this.getCount();
  }

  onTabChange(event: any) {
    // Espera a que la vista se actualice y luego configura la tabla
    setTimeout(() => this.updateCurrentTable(event.index));
  }

  previewDeclaration(id: string, publicVersion: boolean = false) {
    const dialogRef = this.dialog.open(PreviewDeclarationComponent, {
      data: {
        id,
        publicVersion,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      // No es necesario hacer nada después de cerrar el diálogo de vista previa.
    });
  }
  // Este método se dispara por los eventos (sortChange) y (page) del HTML
  triggerTableUpdate(event: Sort | any) {
    // Si es un evento de ordenamiento, regresa a la primera página
    if ((event as Sort).direction !== undefined) {
      this.currentPaginator.pageIndex = 0;
    }
    this.tableUpdate$.next();
  }

  private updateCurrentTable(index: number) {
    switch (index) {
      case 0:
        this.currentPaginator = this.totalPaginator;
        this.currentSort = this.totalSort;
        this.currentFilterType = null;
        break;
      case 1:
        this.currentPaginator = this.inicialPaginator;
        this.currentSort = this.inicialSort;
        this.currentFilterType = 'INICIAL';
        break;
      case 2:
        this.currentPaginator = this.modificacionPaginator;
        this.currentSort = this.modificacionSort;
        this.currentFilterType = 'MODIFICACION';
        break;
      case 3:
        this.currentPaginator = this.conclusionPaginator;
        this.currentSort = this.conclusionSort;
        this.currentFilterType = 'CONCLUSION';
        break;
    }
    // Dispara la actualización para cargar los datos de la nueva tabla
    this.tableUpdate$.next();
  }
}
