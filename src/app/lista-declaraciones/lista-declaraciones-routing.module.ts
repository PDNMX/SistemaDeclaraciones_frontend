import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { ListaDeclaracionesComponent } from './lista-declaraciones.component';
import { MisDeclaracionesComponent } from './mis-declaraciones/mis-declaraciones.component';

const routes: Routes = [
  {
    path: 'declaraciones',
    component: ListaDeclaracionesComponent,
    data: { title: marker('Declaraciones') },
  },
  {
    path: 'mis-declaraciones',
    component: MisDeclaracionesComponent,
    data: { title: marker('Mis Declaraciones') },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ListaDeclaracionesRoutingModule {}
