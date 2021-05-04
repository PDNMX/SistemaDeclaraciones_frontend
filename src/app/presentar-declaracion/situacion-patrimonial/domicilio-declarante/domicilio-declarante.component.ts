import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { declaracionMutation, domicilioDeclaranteQuery } from '@api/declaracion';
import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';
import { UntilDestroy, untilDestroyed } from '@core';
import { Catalogo, DeclaracionOutput, DomicilioDeclarante } from '@models/declaracion';
import Estados from '@static/catalogos/estados.json';
import Municipios from '@static/catalogos/municipios.json';
import Paises from '@static/catalogos/paises.json';
import { findOption } from '@utils/utils';

@UntilDestroy()
@Component({
  selector: 'app-domicilio-declarante',
  templateUrl: './domicilio-declarante.component.html',
  styleUrls: ['./domicilio-declarante.component.scss'],
})
export class DomicilioDeclaranteComponent implements OnInit {
  aclaraciones = false;
  domicilioDeclaranteForm: FormGroup;
  estado: Catalogo = null;
  isLoading = false;

  estadosCatalogo = Estados;
  municipiosCatalogo = Municipios;
  paisesCatalogo = Paises;

  declaracionSimplificada = false;
  tipoDeclaracion: string = null;
  tipoDomicilio = 'MEXICO';

  declaracionId: string = null;

  errorMatcher = new DeclarationErrorStateMatcher();

  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    const urlChunks = this.router.url.split('/');
    this.declaracionSimplificada = urlChunks[2] === 'simplificada';
    this.tipoDeclaracion = urlChunks[1] || null;

    this.createForm();
    this.getUserInfo();
  }

  confirmSaveInfo() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Guardar cambios',
        message: '',
        trueText: 'Guardar',
        falseText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveInfo();
      }
    });
  }

  createForm() {
    this.domicilioDeclaranteForm = this.formBuilder.group({
      domicilioMexico: this.formBuilder.group({
        calle: [null, [Validators.required, Validators.pattern(/^\S.*$/)]],
        numeroExterior: [null, [Validators.required, Validators.pattern(/^\S.*$/)]],
        numeroInterior: [null, [Validators.pattern(/^\S.*$/)]],
        coloniaLocalidad: [null, [Validators.required, Validators.pattern(/^\S.*$/)]],
        municipioAlcaldia: [{ disabled: true, value: null }, [Validators.required]],
        entidadFederativa: [null, [Validators.required]],
        codigoPostal: [null, [Validators.required, Validators.pattern(/^\d{5}$/i)]],
      }),
      domicilioExtranjero: this.formBuilder.group({
        calle: [null, [Validators.required, Validators.pattern(/^\S.*$/)]],
        numeroExterior: [null, [Validators.required, Validators.pattern(/^\S.*$/)]],
        numeroInterior: [null, [Validators.pattern(/^\S.*$/)]],
        ciudadLocalidad: [null, [Validators.required, Validators.pattern(/^\S.*$/)]],
        estadoProvincia: [null, [Validators.required]],
        pais: [null, [Validators.required]],
        codigoPostal: [null, [Validators.required, Validators.pattern(/^\d{5}$/i)]],
      }),
      aclaracionesObservaciones: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*$/)]],
    });

    this.domicilioDeclaranteForm.get('domicilioExtranjero').disable();

    const estado = this.domicilioDeclaranteForm.get('domicilioMexico.entidadFederativa');
    estado.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      const municipio = this.domicilioDeclaranteForm.get('domicilioMexico.municipioAlcaldia');

      if (value) {
        municipio.enable();
      } else {
        municipio.disable();
        municipio.reset();
      }
      this.estado = value;
    });
  }

  fillForm(domicilioDeclarante: DomicilioDeclarante) {
    this.domicilioDeclaranteForm.patchValue(domicilioDeclarante || {});

    if (domicilioDeclarante?.aclaracionesObservaciones) {
      this.toggleAclaraciones(true);
    }

    this.setSelectedOptions(domicilioDeclarante);
  }

  async getUserInfo() {
    try {
      const { data, errors } = await this.apollo
        .query<DeclaracionOutput>({
          query: domicilioDeclaranteQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
            declaracionCompleta: !this.declaracionSimplificada,
          },
        })
        .toPromise();

      if (errors) {
        throw errors;
      }

      this.declaracionId = data?.declaracion._id;
      this.fillForm(data?.declaracion.domicilioDeclarante);
    } catch (error) {
      console.log(error);
      this.openSnackBar('[ERROR: No se pudo recuperar la información]', 'Aceptar');
    }
  }

  ngOnInit(): void {}

  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  async saveInfo() {
    try {
      this.isLoading = true;

      const declaracion = {
        domicilioDeclarante: this.domicilioDeclaranteForm.value,
      };

      const { errors } = await this.apollo
        .mutate({
          mutation: declaracionMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();

      if (errors) {
        throw errors;
      }

      this.isLoading = false;
      this.openSnackBar('Información actualizada', 'Aceptar');
    } catch (error) {
      console.log(error);
      this.openSnackBar('[ERROR: No se guardaron los cambios]', 'Aceptar');
    }
  }

  setSelectedOptions(domicilioDeclarante: DomicilioDeclarante) {
    const { domicilioExtranjero, domicilioMexico } = domicilioDeclarante || {};

    if (domicilioMexico) {
      this.domicilioDeclaranteForm
        .get('domicilioMexico.entidadFederativa')
        .setValue(findOption(this.estadosCatalogo, domicilioMexico.entidadFederativa.clave));
      this.domicilioDeclaranteForm
        .get('domicilioMexico.municipioAlcaldia')
        .setValue(
          findOption(this.municipiosCatalogo[this.estado?.clave] || [], domicilioMexico.municipioAlcaldia.clave)
        );
    } else if (domicilioExtranjero) {
      this.domicilioDeclaranteForm
        .get('domicilioExtranjero.pais')
        .setValue(findOption(this.paisesCatalogo, domicilioExtranjero.pais).clave);
      this.tipoDomicilio = 'EXTRANJERO';
      this.tipoDomicilioChanged();
    }
  }

  tipoDomicilioChanged() {
    const notSelectedType = this.tipoDomicilio === 'MEXICO' ? 'domicilioExtranjero' : 'domicilioMexico';
    const selectedType = this.tipoDomicilio === 'EXTRANJERO' ? 'domicilioExtranjero' : 'domicilioMexico';

    const notSelected = this.domicilioDeclaranteForm.get(notSelectedType);
    notSelected.disable();
    notSelected.reset();

    this.domicilioDeclaranteForm.get(selectedType).enable();
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.domicilioDeclaranteForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
