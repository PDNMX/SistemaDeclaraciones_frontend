import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { PerfilComponent } from './perfil.component';

const routes: Routes = [
  {
    path: 'perfil',
    component: PerfilComponent,
    data: { title: marker('Perfil') },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PerfilRoutingModule {}
