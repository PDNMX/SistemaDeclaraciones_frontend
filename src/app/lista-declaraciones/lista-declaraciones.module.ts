import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { ListaDeclaracionesRoutingModule } from './lista-declaraciones-routing.module';
import { ListaDeclaracionesComponent } from './lista-declaraciones.component';
import { MisDeclaracionesComponent } from './mis-declaraciones/mis-declaraciones.component';

@NgModule({
  declarations: [MisDeclaracionesComponent, ListaDeclaracionesComponent],
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    ListaDeclaracionesRoutingModule,
  ],
})
export class ListaDeclaracionesModule {}
