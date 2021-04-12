import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { DeclaracionesComponent } from './declaraciones/declaraciones.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
  {
    path: 'declaraciones',
    pathMatch: 'full',
    component: DeclaracionesComponent,
    data: { title: marker('Lista de declaraciones') },
  },
  {
    path: 'declaraciones/:userId',
    pathMatch: 'full',
    component: DeclaracionesComponent,
    data: { title: marker('Lista de declaraciones de usuario') },
  },
  {
    path: 'usuarios',
    component: UsersComponent,
    data: { title: marker('Usuarios') },
  },
  {
    path: 'usuarios/:id',
    component: UserDetailComponent,
    data: { title: marker('Detalle de usuario') },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AdminRoutingModule {}
