import { Component, OnInit } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

interface ListaDeclaraciones {
  _id: string;
  tipoDeclaracion: string;
  completa: boolean;
  updatedAt: string;
}

@Component({
  selector: 'app-mis-declaraciones',
  templateUrl: './mis-declaraciones.component.html',
  styleUrls: ['./mis-declaraciones.component.scss'],
})
export class MisDeclaracionesComponent implements OnInit {
  listaDeclaraciones: Array<ListaDeclaraciones> = [];

  constructor(private apollo: Apollo) {}

  async deleteDeclaration(id: string) {
    try {
      const result = await this.apollo
        .mutate({
          mutation: gql`
            mutation {
              deleteDeclaracion(id: "${id}")
            }
          `,
        })
        .toPromise();

      console.log('RESULT', result);
    } catch (error) {
      console.log(error);
    }
  }

  async getList() {
    try {
      const { data }: any = await this.apollo
        .query({
          query: gql`
            query {
              declaracionesMetadata(filter: { tipoDeclaracion: INICIAL }) {
                docs {
                  _id
                  completa
                  simplificada
                  tipoDeclaracion
                  updatedAt
                  owner {
                    username
                  }
                }
                pageNumber
              }
            }
          `,
        })
        .toPromise();

      this.listaDeclaraciones = data.declaracionesMetadata.docs || [];
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    this.getList();
  }
}
