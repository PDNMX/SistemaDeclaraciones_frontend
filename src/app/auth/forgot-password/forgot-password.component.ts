import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Apollo } from 'apollo-angular';
import { forgotPassword } from '@api/user';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  isLoading = false;

  constructor(private apollo: Apollo, private formBuilder: FormBuilder, private _snackBar: MatSnackBar) {
    this.createForm();
  }

  ngOnInit() {}

  async sendEmail() {
    // try {
      this.isLoading = true;
      const { username } = this.passwordForm.value;
      
      this.apollo
        .mutate({
          mutation: forgotPassword,
          variables: {
            username,
          },
        })
        .toPromise()
        .then((response: any)=> {
          this.isLoading = false;
        })
        .catch((err)=> {
          this.openSnackBar("Error al enviar el correo: " + err, "Ok");
        })
        .finally(()=>{
          this.isLoading = false;
        })
        ;
    // } catch (error) {
    //   this.openSnackBar('Ocurrió un error al enviar el correo', 'Aceptar');
    // } finally {
      
    // }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  private createForm() {
    this.passwordForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
    });
  }
}
