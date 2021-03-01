import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { SharedPresentarDeclaracionModule } from '../shared-presentar-declaracion/shared-presentar-declaracion.module';
import { InteresesRoutingModule } from './intereses-routing.module';

import { ParticipacionEmpresaComponent } from './participacion-empresa/participacion-empresa.component';
import { TomaDecisionesComponent } from './toma-decisiones/toma-decisiones.component';
import { ApoyosPublicosComponent } from './apoyos-publicos/apoyos-publicos.component';
import { RepresentacionComponent } from './representacion/representacion.component';
import { ClientesPrincipalesComponent } from './clientes-principales/clientes-principales.component';
import { BeneficiosPrivadosComponent } from './beneficios-privados/beneficios-privados.component';
import { FideicomisosComponent } from './fideicomisos/fideicomisos.component';

import { CatalogosService } from '../../services/catalogos.service';

@NgModule({
  declarations: [
    ParticipacionEmpresaComponent,
    TomaDecisionesComponent,
    ApoyosPublicosComponent,
    RepresentacionComponent,
    ClientesPrincipalesComponent,
    BeneficiosPrivadosComponent,
    FideicomisosComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    SharedPresentarDeclaracionModule,
    InteresesRoutingModule,
  ],
  providers: [CatalogosService],
})
export class InteresesModule {}
