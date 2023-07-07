import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';

import { datosGeneralesQuery, declaracionesMetadata, declaracionMutation } from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import Nacionalidades from '@static/catalogos/nacionalidades.json';
import Paises from '@static/catalogos/paises.json';
import SituacionPersonalEstadoCivil from '@static/catalogos/situacionPersonalEstadoCivil.json';
import RegimenMatrimonial from '@static/catalogos/regimenMatrimonial.json';

import { tooltipData } from '@static/tooltips/datos-generales';

import { findOption } from '@utils/utils';

import { DatosGenerales, DeclaracionOutput } from '@models/declaracion';

@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss'],
})
export class DatosGeneralesComponent implements OnInit {
  aclaraciones = false;
  datosGeneralesForm: FormGroup;
  isLoading = false;

  nacionalidadesCatalogo = Nacionalidades;
  paisesCatalogo = Paises;
  situacionPersonalEstadoCivilCatalogo = SituacionPersonalEstadoCivil;
  regimenMatrimonialCatalogo = RegimenMatrimonial;

  declaracionSimplificada = false;
  tipoDeclaracion: string = null;
  declaracionId: string = null;

  tooltipData = tooltipData;

  avanzar = false;

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
    this.avanzar = false;
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
    this.datosGeneralesForm = this.formBuilder.group({
      nombre: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]], //no side white spaces
      primerApellido: [null, [Validators.pattern(/^\S.*\S$/)]],
      segundoApellido: [null, [Validators.pattern(/^\S.*\S$/)]],
      curp: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/i
          ),
        ],
      ],
      rfc: this.formBuilder.group({
        rfc: [
          null,
          [
            Validators.required,
            Validators.pattern(/^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))$/i),
          ],
        ],
        homoClave: [null, [Validators.required, Validators.pattern(/^([A-Z\d]{2})([A\d])$/i)]],
      }),
      //rfc con homoclave /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
      correoElectronico: this.formBuilder.group({
        institucional: [null, [Validators.required, Validators.email]],
        personal: [null, [Validators.required, Validators.email]],
      }),
      telefono: this.formBuilder.group({
        casa: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]],
        celularPersonal: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      }),
      situacionPersonalEstadoCivil: [null, Validators.required],
      regimenMatrimonial: [{ disabled: true, value: null }, Validators.required],
      paisNacimiento: [null, Validators.required],
      nacionalidad: [null, [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/i)]], //solo letras, incluyendo acentos
      aclaracionesObservaciones: [
        { disabled: true, value: null },
        [Validators.required, Validators.pattern(/^\S.*\S$/)],
      ],
    });

    const situacionPersonal = this.datosGeneralesForm.get('situacionPersonalEstadoCivil');
    situacionPersonal.valueChanges.subscribe((value) => {
      const regimenMatrimonial = this.datosGeneralesForm.get('regimenMatrimonial');

      if (value && value.clave === 'CAS') {
        regimenMatrimonial.enable();
      } else {
        regimenMatrimonial.disable();
        regimenMatrimonial.reset();
      }
    });
  }

  fillForm(datosGenerales: DatosGenerales) {
    this.datosGeneralesForm.patchValue(datosGenerales || {});

    if (datosGenerales?.aclaracionesObservaciones) {
      this.toggleAclaraciones(true);
    }

    this.setSelectedOptions();
  }

  async getUltimaDeclaracionMetadata() {
    const userId = sessionStorage.getItem("username");
    try {
      const { data }: any = await this.apollo
        .query({
          query: declaracionesMetadata,
          variables: {
            userID: userId,
            filter: {
              firmada: true,
            },
          },
        })
        .toPromise();

      if (data.declaracionesMetadata.docs.length > 0) {
        // recuperar la última declaración, ya vienen ordenadas por fecha
        return data.declaracionesMetadata.docs[0];



      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getUserInfo() {
    var declaracion;
    try {
      const { data } = await this.apollo
        .query<DeclaracionOutput>({
          query: datosGeneralesQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
            declaracionCompleta: !this.declaracionSimplificada,
          },
        })
        .toPromise();

        declaracion = data.declaracion;

// OMAR: 19/07/2021
// Para copiar la última declaración a esta, se modificó el backend en: repositories>declaracion_repo>getOrCreate

      this.declaracionId = declaracion._id;
      this.fillForm(declaracion.datosGenerales);
    } catch (error) {
      console.log(error);
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
        datosGenerales: this.datosGeneralesForm.value,
      };

      const result = await this.apollo
        .mutate({
          mutation: declaracionMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();
      this.isLoading = false;
      this.openSnackBar('Información actualizada', 'Aceptar');
      if(this.avanzar)
        this.router.navigate([this.getLinkSiguiente()]);
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  setSelectedOptions() {
    const { situacionPersonalEstadoCivil, regimenMatrimonial } = this.datosGeneralesForm.value;

    if (situacionPersonalEstadoCivil) {
      this.datosGeneralesForm
        .get('situacionPersonalEstadoCivil')
        .setValue(findOption(this.situacionPersonalEstadoCivilCatalogo, situacionPersonalEstadoCivil.clave));
    }

    if (regimenMatrimonial) {
      this.datosGeneralesForm
        .get('regimenMatrimonial')
        .setValue(findOption(this.regimenMatrimonialCatalogo, regimenMatrimonial.clave));
    }
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.datosGeneralesForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }

  getLinkSiguiente() {
    const base =
      '/' +
      this.tipoDeclaracion +
      '/' +
      (this.declaracionSimplificada ? 'simplificada/' : '/') +
      'situacion-patrimonial/';

    return base + 'domicilio-declarante/';
  }

  siguiente() {
    this.avanzar = true;
    this.saveInfo();
  }
}
