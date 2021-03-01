import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { ComienzaTuDeclaracionComponent } from './comienza-tu-declaracion.component';

const routes: Routes = [
  {
    path: 'comienza-tu-declaracion',
    component: ComienzaTuDeclaracionComponent,
    data: { title: marker('Comienza tu declaración') },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ComienzaTuDeclaracionRoutingModule {}
