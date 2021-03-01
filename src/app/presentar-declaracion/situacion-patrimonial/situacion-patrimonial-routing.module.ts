import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { DatosGeneralesComponent } from './datos-generales/datos-generales.component';
import { DomicilioDeclaranteComponent } from './domicilio-declarante/domicilio-declarante.component';
import { DatosCurricularesComponent } from './datos-curriculares/datos-curriculares.component';
import { DatosEmpleoComponent } from './datos-empleo/datos-empleo.component';
import { ExperienciaLaboralComponent } from './experiencia-laboral/experiencia-laboral.component';
import { DatosParejaComponent } from './datos-pareja/datos-pareja.component';
import { DatosDependienteComponent } from './datos-dependiente/datos-dependiente.component';
import { IngresosNetosComponent } from './ingresos-netos/ingresos-netos.component';
import { ServidorPublicoComponent } from './servidor-publico/servidor-publico.component';
import { BienesInmueblesComponent } from './bienes-inmuebles/bienes-inmuebles.component';
import { InversionesComponent } from './inversiones/inversiones.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { BienesMueblesComponent } from './bienes-muebles/bienes-muebles.component';

import { AdeudosComponent } from './adeudos/adeudos.component';
import { PrestamosTercerosComponent } from './prestamos-terceros/prestamos-terceros.component';
import { Shell } from '@app/shell/shell.service';

const modules: Routes = [
  {
    path: 'datos-generales',
    component: DatosGeneralesComponent,
    data: { title: marker('Datos Generales') },
  },
  {
    path: 'domicilio-declarante',
    component: DomicilioDeclaranteComponent,
    data: { title: marker('Domicilio Declarante') },
  },
  {
    path: 'datos-curriculares',
    component: DatosCurricularesComponent,
    data: { title: marker('Datos Curriculares') },
  },
  {
    path: 'datos-empleo',
    component: DatosEmpleoComponent,
    data: { title: marker('Datos Empleo') },
  },
  {
    path: 'experiencia-laboral',
    component: ExperienciaLaboralComponent,
    data: { title: marker('Experiencia Laboral') },
  },
  {
    path: 'datos-pareja',
    component: DatosParejaComponent,
    data: { title: marker('Datos Pareja') },
  },
  {
    path: 'datos-dependiente',
    component: DatosDependienteComponent,
    data: { title: marker('Datos Dependiente') },
  },
  {
    path: 'ingresos-netos',
    component: IngresosNetosComponent,
    data: { title: marker('Ingresos Netos') },
  },
  {
    path: 'servidor-publico',
    component: ServidorPublicoComponent,
    data: { title: marker('Servidor Público') },
  },
  {
    path: 'bienes-inmuebles',
    component: BienesInmueblesComponent,
    data: { title: marker('Bienes Inmuebles') },
  },
  {
    path: 'vehiculos',
    component: VehiculosComponent,
    data: { title: marker('Vehículos') },
  },
  {
    path: 'bienes-muebles',
    component: BienesMueblesComponent,
    data: { title: marker('Bienes Muebles') },
  },
  {
    path: 'inversiones',
    component: InversionesComponent,
    data: { title: marker('Inversiones') },
  },
  {
    path: 'adeudos',
    component: AdeudosComponent,
    data: { title: marker('Adeudos') },
  },
  {
    path: 'prestamos-terceros',
    component: PrestamosTercerosComponent,
    data: { title: marker('Prestamos') },
  },
];

const modulesSimplificada: Routes = [
  {
    path: 'datos-generales',
    component: DatosGeneralesComponent,
    data: { title: marker('Datos Generales') },
  },
  {
    path: 'domicilio-declarante',
    component: DomicilioDeclaranteComponent,
    data: { title: marker('Domicilio Declarante') },
  },
  {
    path: 'datos-curriculares',
    component: DatosCurricularesComponent,
    data: { title: marker('Datos Curriculares') },
  },
  {
    path: 'datos-empleo',
    component: DatosEmpleoComponent,
    data: { title: marker('Datos Empleo') },
  },
  {
    path: 'experiencia-laboral',
    component: ExperienciaLaboralComponent,
    data: { title: marker('Experiencia Laboral') },
  },
  {
    path: 'ingresos-netos',
    component: IngresosNetosComponent,
    data: { title: marker('Ingresos Netos') },
  },
  {
    path: 'servidor-publico',
    component: ServidorPublicoComponent,
    data: { title: marker('Servidor Público') },
  },
];

const routes: Routes = [
  Shell.childRoutes([
    ...['inicial', 'modificacion', 'conclusion'].map((tipoDeclaracion) => {
      return {
        path: tipoDeclaracion,
        children: [
          {
            path: 'situacion-patrimonial',
            children: [{ path: '', redirectTo: 'datos-generales', pathMatch: 'full' }, ...modules],
          },
          {
            path: 'simplificada/situacion-patrimonial',
            children: [{ path: '', redirectTo: 'datos-generales', pathMatch: 'full' }, ...modulesSimplificada],
          },
        ],
      };
    }),
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class SituacionPatrimonialRoutingModule {}
