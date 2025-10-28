import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';

import { ComienzaTuDeclaracionRoutingModule } from './comienza-tu-declaracion-routing';
import { ComienzaTuDeclaracionComponent } from './comienza-tu-declaracion.component';

@NgModule({
  declarations: [ComienzaTuDeclaracionComponent],
  imports: [CommonModule, CoreModule, SharedModule, MaterialModule, ComienzaTuDeclaracionRoutingModule],
})
export class ComienzaTuDeclaracionModule {}
