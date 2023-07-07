import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { declaracionesMetadata } from '@api/declaracion';
import { DialogComponent } from '@app/@shared';

@Component({
  selector: 'app-comienza-tu-declaracion',
  templateUrl: './comienza-tu-declaracion.component.html',
  styleUrls: ['./comienza-tu-declaracion.component.scss'],
})
export class ComienzaTuDeclaracionComponent implements OnInit {
  tipoDeclaracion: string;

  constructor(private apollo: Apollo, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.tipoDeclaracion = this.router.url.split('/')[1];
  }

  //Validar que no se pueda iniciar una declaracion simplificada o completa si ya se tiene una que no se ha terminado
  async iniciarDeclaracion(tipo: String, modo: String) {
    //obtener la ultima declaracion
    if (tipo == 'CONCLUSION' && !(await this.validarDeclaracionDeConclusion())) {
      return;
    }

    this.validarDeclaracionIniciada(tipo, modo);

    //15/07/2021 --> Cuando inicia una declaración, copiar los datos de la última declaracion que tenga hecha para
    // que se muestren en la declaración

    //this.copiarUltimaDeclaracion();
  }


  async validarDeclaracionDeConclusion() {
    const tieneIncial = await this.tieneDeclaracionFinalizada('INICIAL');
    const tieneModificacion = await this.tieneDeclaracionFinalizada('MODIFICACION');

    if (!tieneIncial && !tieneModificacion) {
      this.dialog.open(DialogComponent, {
        data: {
          title: 'Error',
          message:
            'Para poder realizar una declaración de conclusión, es necesario tener una declaración inicial o de modificación concluida',
          trueText: 'Aceptar',
        },
      });

      return false;
    }

    return true;
  }

  async tieneDeclaracionFinalizada(tipo: String) {
    // si van a hacer una de conclusión, debe tener una inicial o de modificación terminada
    return await this.apollo
      .query({
        query: declaracionesMetadata,
        variables: {
          filter: {
            firmada: true,
            tipoDeclaracion: tipo,
          },
        },
      })
      .toPromise()
      .then((data: any) => {
        if (data.data.declaracionesMetadata.docs.length > 0) {
          // tiene una declaracion finalizada, puede hacer la de conclusion
          return true;
        } else {
          return false;
        }
      });
  }

  async validarDeclaracionIniciada(tipo: String, modo: String) {
    const userId = sessionStorage.getItem("username");
    try {
      const { data }: any = await this.apollo
        .query({
          query: declaracionesMetadata,
          variables: {
            userID: userId,
            filter: {
              firmada: false,
              //tipoDeclaracion: tipo,
            },
          },
        })
        .toPromise();

      if (data.declaracionesMetadata.docs.length > 0) {
        // tiene una declaracion abierta, debe cerrarla para poder comenzar otra
        this.dialog.open(DialogComponent, {
          data: {
            title: 'Error',
            message: 'Ya tiene una declaración iniciada, debe finalizarla para poder iniciar otra',
            trueText: 'Aceptar',
          },
        });
      } else {
        if (modo === 'simplificada')
          this.router.navigate(['/' + tipo.toLowerCase() + '/simplificada/situacion-patrimonial']);
        else this.router.navigate(['/' + tipo.toLowerCase() + '/situacion-patrimonial']);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
