import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from '@shared/dialog/dialog.component';

import { changePassword, updateUserProfile, userProfileQuery } from '@api/user';

import { AuthenticationService } from '../auth/authentication.service';

import InstitucionesCatalogo from '@static/custom/instituciones.json';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  editMode = false;
  cambiarContrasena = false;
  changePasswordForm: FormGroup;
  profileForm: FormGroup;
  isLoading = false;

  user: any = null;

  institucionesCatalogo = InstitucionesCatalogo;

  constructor(
    private apollo: Apollo,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.createForms();
    this.getUserInfo();
    if (this.institucionesCatalogo?.length) {
      this.profileForm.get('institucion').enable();
    }
  }

  confirmChangePassword() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: '¿Cambiar contraseña?',
        message: '',
        trueText: 'Aceptar',
        falseText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveInfo();
      }
    });
  }

  confirmChangeProfile() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: '¿Actualizar perfil?',
        message: '',
        trueText: 'Actualizar',
        falseText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveInfoProfile();
      }
    });
  }

  createForms() {
    this.profileForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: ['', Validators.required],
      curp: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/i
          ),
        ],
      ],
      rfc: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
          ),
        ],
      ],
      institucion: [{ disabled: true, value: null }, [Validators.required]],
    });

    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    });
  }

  changeEditMode() {
    this.editMode = !this.editMode;
  }

  async getUserInfo() {
    try {
      const { data }: any = await this.apollo
        .query({
          query: userProfileQuery,
        })
        .toPromise();

      this.user = data.userProfile || null;

      this.profileForm.patchValue(this.user);
    } catch (error) {
      console.log(error);
    }
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  async saveInfo() {
    const passwords = this.changePasswordForm.value;
    try {
      this.isLoading = true;

      const result = await this.apollo
        .mutate({
          mutation: changePassword,
          variables: {
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword,
          },
        })
        .toPromise();

      this.isLoading = false;
      this.openSnackBar('Información actualizada', 'Aceptar');
      this.logout();
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  async saveInfoProfile() {
    const profile = this.profileForm.value;

    if (this.institucionesCatalogo?.length) {
      profile.institucion = {
        clave: profile.institucion.clave,
        valor: profile.institucion.ente_publico,
      };
    }

    try {
      this.isLoading = true;

      const result = await this.apollo
        .mutate({
          mutation: updateUserProfile,
          variables: {
            profile,
          },
        })
        .toPromise();

      this.isLoading = false;
      this.openSnackBar('Información actualizada', 'Aceptar');
      this.logout();
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  ngOnInit(): void {}

  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  toggleNuevaContrasena(value: boolean) {
    this.cambiarContrasena = value;
  }
}
