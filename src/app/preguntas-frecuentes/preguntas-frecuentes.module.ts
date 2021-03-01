import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { PreguntasFrecuentesRoutingModule } from './preguntas-frecuentes-routing.module';
import { GeneralidadesComponent } from './generalidades/generalidades.component';
import { LlenadoDeDeclaracionesComponent } from './llenado-de-declaraciones/llenado-de-declaraciones.component';
import { TratamientoDeInformacionComponent } from './tratamiento-de-informacion/tratamiento-de-informacion.component';
import { PreguntasFrecuentesComponent } from './preguntas-frecuentes.component';

@NgModule({
  declarations: [
    GeneralidadesComponent,
    LlenadoDeDeclaracionesComponent,
    TratamientoDeInformacionComponent,
    PreguntasFrecuentesComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    PreguntasFrecuentesRoutingModule,
  ],
})
export class PreguntasFrecuentesModule {}
