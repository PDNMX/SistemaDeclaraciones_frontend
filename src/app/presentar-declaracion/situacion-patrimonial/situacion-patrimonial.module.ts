import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { SharedPresentarDeclaracionModule } from '../shared-presentar-declaracion/shared-presentar-declaracion.module';
import { DomicilioDeclaranteComponent } from './domicilio-declarante/domicilio-declarante.component';
import { DatosGeneralesComponent } from './datos-generales/datos-generales.component';
import { SituacionPatrimonialRoutingModule } from './situacion-patrimonial-routing.module';
import { DatosCurricularesComponent } from './datos-curriculares/datos-curriculares.component';
import { DatosEmpleoComponent } from './datos-empleo/datos-empleo.component';
import { DatosParejaComponent } from './datos-pareja/datos-pareja.component';
import { IngresosNetosComponent } from './ingresos-netos/ingresos-netos.component';
import { ServidorPublicoComponent } from './servidor-publico/servidor-publico.component';
import { ExperienciaLaboralComponent } from './experiencia-laboral/experiencia-laboral.component';
import { DatosDependienteComponent } from './datos-dependiente/datos-dependiente.component';
import { BienesInmueblesComponent } from './bienes-inmuebles/bienes-inmuebles.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { BienesMueblesComponent } from './bienes-muebles/bienes-muebles.component';
import { AdeudosComponent } from './adeudos/adeudos.component';
import { PrestamosTercerosComponent } from './prestamos-terceros/prestamos-terceros.component';
import { InversionesComponent } from './inversiones/inversiones.component';

import { CatalogosService } from '../../services/catalogos.service';

@NgModule({
  declarations: [
    DatosGeneralesComponent,
    DomicilioDeclaranteComponent,
    DatosCurricularesComponent,
    DatosEmpleoComponent,
    DatosParejaComponent,
    IngresosNetosComponent,
    ServidorPublicoComponent,
    ExperienciaLaboralComponent,
    DatosDependienteComponent,
    BienesInmueblesComponent,
    VehiculosComponent,
    BienesMueblesComponent,
    AdeudosComponent,
    PrestamosTercerosComponent,
    InversionesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    SharedPresentarDeclaracionModule,
    SituacionPatrimonialRoutingModule,
  ],
  providers: [CatalogosService],
})
export class SituacionPatrimonialModule {}
