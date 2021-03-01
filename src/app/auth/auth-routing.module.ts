import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: marker('Iniciar sesión') } },
  {
    path: 'recuperar-contrasena',
    component: ForgotPasswordComponent,
    data: { title: marker('Recuperar contraseña') },
  },
  { path: 'registro', component: SignupComponent, data: { title: marker('Registro') } },
  {
    path: 'restablecer-contrasena',
    component: ResetPasswordComponent,
    data: { title: marker('Restablecer contraseña') },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AuthRoutingModule {}
