import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@core';
import { AuthenticationService } from '../authentication.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ERROR_COMPONENT_TYPE } from '@angular/compiler';

const log = new Logger('Signup');

@UntilDestroy()
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  version: string | null = environment.version;
  error: string | undefined;
  signupForm!: FormGroup;
  isLoading = false;
tmpError: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  signup() {
    this.isLoading = true;
    const formVal = this.signupForm.value;
    if(formVal.primerApellido == null || formVal.primerApellido == "")
      formVal.primerApellido = " ";
    const signup$ = this.authenticationService.signup(formVal);
    signup$
      .pipe(
        finalize(() => {
          this.signupForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (success) => {
          if (success === true) {
            log.debug(`successfully signed up`);
            this.openSnackBar('Usuario registrado exitosamente', 'Aceptar');
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
          } else {
            this.tmpError = success;
            var error = success.graphQLErrors[0].message;

            // if(error.indexOf("curp"))
            //   error = "La CURP ya está registrada en el sistema";
            // else if(error.indexOf("rfc"))
            //   error = "El RFC ya está registrada en el sistema";
            // else
            //   error = "El correo electrónico ya está registrada en el sistema";

            this.openSnackBar(error, 'Aceptar');
          }
        },
        (error) => {
          log.debug(`Signup error: ${error}`);
          this.error = error;
          this.openSnackBar('Ocurrió un error', 'Aceptar');
        }
      );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  private createForm() {
    this.signupForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      primerApellido: [''],
      segundoApellido: [''],
      username: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i
          ),
        ],
      ],
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
      contrasena: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      confirmarContrasena: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    });
  }
}
