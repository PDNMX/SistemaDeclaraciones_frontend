import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { PreviewDeclarationComponent } from '@shared/preview-declaration/preview-declaration.component';

import { declaracionesMetadata, deleteDeclaracion } from '@api/declaracion';
import { DeclaracionMetadata, TipoDeclaracion } from '@models/declaracion';

import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-mis-declaraciones',
  templateUrl: './mis-declaraciones.component.html',
  styleUrls: ['./mis-declaraciones.component.scss'],
})
export class MisDeclaracionesComponent implements OnInit {
  currentTab: TipoDeclaracion = 'INICIAL';
  listaDeclaraciones: DeclaracionMetadata[] = [];

  constructor(private apollo: Apollo, private dialog: MatDialog, private router: Router) {}

  confirmDeleteDeclaration(id: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: '¿Eliminar declaración?',
        message: 'No podrás deshacer esta acción',
        trueText: 'Eliminar',
        falseText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteDeclaration(id);
      }
    });
  }

  async deleteDeclaration(id: string) {
    try {
      const result = await this.apollo
        .mutate({
          mutation: deleteDeclaracion,
          variables: {
            id,
          },
        })
        .toPromise();

      this.presentAlert('Tu declaración ha sido eliminada', '');
    } catch (error) {
      console.log(error);
      this.presentAlert('Error', 'No se pudo eliminar la declaración');
    } finally {
      this.getList(this.currentTab);
    }
  }

  editDeclaration(declaracion: DeclaracionMetadata) {
    const tipoDeclaracion = declaracion.tipoDeclaracion.toLocaleLowerCase();
    const url = declaracion.declaracionCompleta
      ? `/${tipoDeclaracion}/situacion-patrimonial`
      : `/${tipoDeclaracion}/simplificada/situacion-patrimonial`;

    this.router.navigate([url], { replaceUrl: true });
  }

  async getList(tipoDeclaracion: TipoDeclaracion = null) {
    try {
      const { data }: any = await this.apollo
        .query({
          query: declaracionesMetadata,
          variables: {
            filter: {
              tipoDeclaracion,
            },
          },
        })
        .toPromise();

      this.listaDeclaraciones = data.declaracionesMetadata.docs || [];
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    this.getList(this.currentTab);
  }

  onTabChanged(event: any) {
    const tabName = event.tab.textLabel;

    const tipoDeclaracionMap = {
      Inicial: 'INICIAL',
      Modificación: 'MODIFICACION',
      Conclusión: 'CONCLUSION',
    };
    this.currentTab = tipoDeclaracionMap[tabName];
    this.getList(tipoDeclaracionMap[tabName]);
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

  previewDeclaration(id: string, publicVersion: boolean = false) {
    const dialogRef = this.dialog.open(PreviewDeclarationComponent, {
      data: {
        id,
        publicVersion,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
}
