import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { ChangeRolesComponent } from './change-roles/change-roles.component';
import { DeclaracionesComponent } from './declaraciones/declaraciones.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

@NgModule({
  declarations: [ChangeRolesComponent, DeclaracionesComponent, UsersComponent, UserDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {}
