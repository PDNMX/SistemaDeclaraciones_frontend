import { Component, OnInit } from '@angular/core';

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

  constructor(private apollo: Apollo) {
    this.getNumberOfDeclarations();
  }

  async getNumberOfDeclarations() {
    try {
      const { data }: any = await this.apollo
        .query({
          query: gql`
            query {
              stats {
                total
                counters {
                  tipoDeclaracion
                  count
                }
              }
            }
          `,
        })
        .toPromise();
      this.declaraciones = data.stats.total || 0;
      this.declaracionesIniciales = data.stats.counters.find((d: any) => d.tipoDeclaracion === 'INICIAL')?.count || 0;
      this.declaracionesModificacion =
        data.stats.counters.find((d: any) => d.tipoDeclaracion === 'MODIFICACION')?.count || 0;
      this.declaracionesFinales = data.stats.counters.find((d: any) => d.tipoDeclaracion === 'CONCLUSION')?.count || 0;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  ngOnInit(): void {}
}
