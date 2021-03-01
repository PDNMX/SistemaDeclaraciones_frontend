import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { PreguntasFrecuentesComponent } from './preguntas-frecuentes.component';

const routes: Routes = [
  {
    path: 'preguntas-frecuentes',
    component: PreguntasFrecuentesComponent,
    data: { title: marker('Preguntas frecuentes') },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PreguntasFrecuentesRoutingModule {}
