import { Component, OnInit } from '@angular/core';
import { myDeclaracionesMetadata } from '@api/declaracion';
import { CredentialsService } from '@app/auth';
import { Catalogo } from '@models/declaracion';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-lista-declaraciones',
  templateUrl: './lista-declaraciones.component.html',
  styleUrls: ['./lista-declaraciones.component.scss'],
})
export class ListaDeclaracionesComponent implements OnInit {
  declaraciones = 0;
  declaracionesIniciales = 0;
  declaracionesModificacion = 0;
  declaracionesFinales = 0;
  userInstitucion: Catalogo = null;

  constructor(private apollo: Apollo, private credential: CredentialsService) {
    this.userInstitucion = credential.credentials.user.institucion;

    this.getNumberOfDeclarations();
  }

  async getNumberOfDeclarations() {
    try {
      let listaDeclaraciones: any[];
      let decInicial: number = 0;
      let decModificacion: number = 0;
      let decConclucion: number = 0;

      const { data: data1 }: any = await this.apollo
        .query({
          query: myDeclaracionesMetadata,
          variables: {
            filter: {},
          },
        })
        .toPromise();

      listaDeclaraciones = data1.myDeclaracionesMetadata.docs || [];

      decInicial = listaDeclaraciones.filter((d) => d.tipoDeclaracion === 'INICIAL').length;
      decModificacion = listaDeclaraciones.filter((d) => d.tipoDeclaracion === 'MODIFICACION').length;
      decConclucion = listaDeclaraciones.filter((d) => d.tipoDeclaracion === 'CONCLUSION').length;

      this.declaraciones = decInicial + decModificacion + decConclucion;

      this.declaracionesIniciales = decInicial;
      this.declaracionesModificacion = decModificacion;
      this.declaracionesFinales = decConclucion;

      // console.log('listaDeclaraciones: ', listaDeclaraciones);

      // const { data }: any = await this.apollo
      //   .query({
      //     query: gql`
      //       query {
      //         stats {
      //           total
      //           counters {
      //             tipoDeclaracion
      //             count
      //           }
      //         }
      //       }
      //     `,
      //   })
      //   .toPromise();
      // this.declaraciones = data.stats.total || 0;
      // console.log('data: ', data);
      // this.declaracionesIniciales = data.stats.counters.find((d: any) => d.tipoDeclaracion === 'INICIAL')?.count || 0;
      // this.declaracionesModificacion =
      //   data.stats.counters.find((d: any) => d.tipoDeclaracion === 'MODIFICACION')?.count || 0;
      // this.declaracionesFinales = data.stats.counters.find((d: any) => d.tipoDeclaracion === 'CONCLUSION')?.count || 0;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  ngOnInit(): void {}
}
