import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { PreviewDeclarationComponent } from '@shared/preview-declaration/preview-declaration.component';

import { declaracionesMetadata, declaracionMutation, deleteDeclaracion } from '@api/declaracion';
import { Declaracion, DeclaracionMetadata, TipoDeclaracion } from '@models/declaracion';

import { Apollo } from 'apollo-angular';

import { autorizarPublica } from '@api/declaracion';

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
      const username = sessionStorage.getItem("username");
      const { data }: any = await this.apollo
        .query({
          query: declaracionesMetadata,
          variables: {
            userID: username,
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

  autorizarPublica(d: Declaracion) {
    var s = `
    De conformidad con los artículos 29 de la Ley General de Responsabilidades Administrativas artículo 70, fracción XII de la Ley General de Transparencia y Acceso a la Información Pública así como el artículo 15, fracción XII de la Ley de Transparencia 
    y Acceso a la Información Pública para el Estado de Veracruz de Ignacio de la Llave, acepto se publique mi declaración de Situación Patrimonial y de Intereses
    en la versión pública que genera este sistema en cumplimiento a lo previsto por las leyes anteriormente referidas.`;

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Confirmar operación',
        message: s,
        trueText: 'Aceptar',
        falseText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        try {
          this.apollo.mutate({
            mutation: autorizarPublica,
            variables: {
              id: d._id,
              autoriza: true
            }
          })
          .toPromise()
          this.presentAlert('Datos guardados', 'Tu declaración ha sido marcada como autorizada para ser publicada');
          d.autorizaPublica = true;
        }
        catch(ex) {
          console.log(ex);
          this.presentAlert('Error', JSON.stringify(ex));
        }
      }
    });

    // .then(d=>{
    //   alert("Datos guardados")
    // })
    // .catch((e)=> {
    //   alert("Error :" + e);
    //   console.error("Error al autorizar");
    //   console.error(e);
    // })
    // ;
  }

  siguienteClicked(num:any) {
    console.log(num);
  }
}
