import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { resetPassword } from '@api/user';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  isLoading = false;
  token: string = null;

  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  private createForm() {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    });
  }

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params.token;
      if (!this.token) {
        this.router.navigate(['/']);
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  async resetPassword() {
    try {
      this.isLoading = true;
      await this.apollo
        .mutate({
          mutation: resetPassword,
          variables: {
            newPassword: this.passwordForm.value.password,
            token: this.token,
          },
        })
        .toPromise();
      this.openSnackBar('Tu contraseña ha sido restablecida', 'Aceptar');
      this.router.navigate(['/']);
    } catch (error) {
      this.openSnackBar('Ocurrió un error', 'Aceptar');
    } finally {
      this.isLoading = false;
    }
  }
}
