import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParticipacionEmpresaComponent } from './participacion-empresa/participacion-empresa.component';
import { TomaDecisionesComponent } from './toma-decisiones/toma-decisiones.component';
import { ApoyosPublicosComponent } from './apoyos-publicos/apoyos-publicos.component';
import { RepresentacionComponent } from './representacion/representacion.component';
import { ClientesPrincipalesComponent } from './clientes-principales/clientes-principales.component';
import { BeneficiosPrivadosComponent } from './beneficios-privados/beneficios-privados.component';
import { FideicomisosComponent } from './fideicomisos/fideicomisos.component';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Shell } from '@app/shell/shell.service';

const modules = [
  {
    path: 'participacion-empresa',
    component: ParticipacionEmpresaComponent,
    data: { title: marker('Participacion Empresa') },
  },
  {
    path: 'toma-decisiones',
    component: TomaDecisionesComponent,
    data: { title: marker('Prticipación en toma de decisiones') },
  },
  {
    path: 'apoyos-publicos',
    component: ApoyosPublicosComponent,
    data: { title: marker('Apoyos Publicos') },
  },
  {
    path: 'representacion',
    component: RepresentacionComponent,
    data: { title: marker('Representación') },
  },
  {
    path: 'clientes-principales',
    component: ClientesPrincipalesComponent,
    data: { title: marker('Clientes Principales') },
  },
  {
    path: 'beneficios-privados',
    component: BeneficiosPrivadosComponent,
    data: { title: marker('Beneficios Privados') },
  },
  {
    path: 'fideicomisos',
    component: FideicomisosComponent,
    data: { title: marker('Fideicomisos') },
  },
];

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'inicial/intereses',
      children: [{ path: '', redirectTo: '/inicial/intereses/participacion-empresa', pathMatch: 'full' }, ...modules],
    },
    {
      path: 'modificacion/intereses',
      children: [
        { path: '', redirectTo: '/modificacion/intereses/participacion-empresa', pathMatch: 'full' },
        ...modules,
      ],
    },
    {
      path: 'conclusion/intereses',
      children: [
        { path: '', redirectTo: '/conclusion/intereses/participacion-empresa', pathMatch: 'full' },
        ...modules,
      ],
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class InteresesRoutingModule {}
