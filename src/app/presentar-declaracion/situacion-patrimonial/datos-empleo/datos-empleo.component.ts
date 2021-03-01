import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { datosEmpleoCargoComisionQuery, declaracionMutation } from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Catalogo, DatosEmpleoCargoComision } from '@models/declaracion';

import NivelOrdenGobierno from '@static/catalogos/nivelOrdenGobierno.json';
import AmbitoPublico from '@static/catalogos/ambitoPublico.json';
import Estados from '@static/catalogos/estados.json';
import Municipios from '@static/catalogos/municipios.json';
import Paises from '@static/catalogos/countries.json';

import { findOption } from '@utils/utils';

@Component({
  selector: 'app-datos-empleo',
  templateUrl: './datos-empleo.component.html',
  styleUrls: ['./datos-empleo.component.scss'],
})
export class DatosEmpleoComponent implements OnInit {
  aclaraciones = false;
  datosEmpleoCargoComisionForm: FormGroup;
  estado: Catalogo = null;
  isLoading = false;

  nivelOrdenGobiernoCatalogo = NivelOrdenGobierno;
  ambitoPublicoCatalogo = AmbitoPublico;
  estadosCatalogo = Estados;
  municipiosCatalogo = Municipios;
  paisesCatalogo = Paises;

  declaracionSimplificada = false;
  tipoDeclaracion: string = null;
  tipoDomicilio = 'MEXICO';

  declaracionId: string = null;

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
    this.datosEmpleoCargoComisionForm = this.formBuilder.group({
      nivelOrdenGobierno: ['', Validators.required],
      ambitoPublico: ['', Validators.required],
      nombreEntePublico: ['', [Validators.pattern(/^\S.*\S?$/)]],
      areaAdscripcion: ['', [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
      empleoCargoComision: ['', [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
      contratadoPorHonorarios: ['', Validators.required],
      nivelEmpleoCargoComision: ['', [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
      funcionPrincipal: ['', [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
      fechaTomaPosesion: ['', [Validators.required]],
      telefonoOficina: this.formBuilder.group({
        telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        extension: [''],
      }),
      domicilioMexico: this.formBuilder.group({
        calle: ['', [Validators.required, Validators.pattern(/^\S.*$/)]],
        numeroExterior: ['', [Validators.required, Validators.pattern(/^\S.*$/)]],
        numeroInterior: ['', [Validators.pattern(/^\S.*$/)]],
        coloniaLocalidad: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        municipioAlcaldia: [{ disabled: true, value: { clave: '', valor: '' } }, Validators.required],
        entidadFederativa: [{ clave: '', valor: '' }, Validators.required],
        codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/i)]],
      }),
      domicilioExtranjero: this.formBuilder.group({
        calle: ['', [Validators.required, Validators.pattern(/^\S.*$/)]],
        numeroExterior: ['', [Validators.required, Validators.pattern(/^\S.*$/)]],
        numeroInterior: ['', [Validators.pattern(/^\S.*$/)]],
        ciudadLocalidad: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        estadoProvincia: ['', Validators.required],
        pais: ['', Validators.required],
        codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/i)]],
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });

    this.datosEmpleoCargoComisionForm.get('domicilioExtranjero').disable();

    const estado = this.datosEmpleoCargoComisionForm.get('domicilioMexico').get('entidadFederativa');
    estado.valueChanges.subscribe((value) => {
      const municipio = this.datosEmpleoCargoComisionForm.get('domicilioMexico').get('municipioAlcaldia');

      if (value) {
        municipio.enable();
      } else {
        municipio.disable();
        municipio.reset();
      }
      this.estado = value;
    });
  }

  fillForm(datosEmpleoCargoComision: DatosEmpleoCargoComision) {
    this.datosEmpleoCargoComisionForm.patchValue(datosEmpleoCargoComision);

    if (datosEmpleoCargoComision.aclaracionesObservaciones) {
      this.toggleAclaraciones(true);
    }
    this.setSelectedOptions();
  }

  async getUserInfo() {
    try {
      const { data }: any = await this.apollo
        .query({
          query: datosEmpleoCargoComisionQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
            simplificada: this.declaracionSimplificada,
          },
        })
        .toPromise();

      console.log(data);
      this.declaracionId = data.declaracion._id;
      this.fillForm(data.declaracion.datosEmpleoCargoComision || {});
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
        datosEmpleoCargoComision: this.datosEmpleoCargoComisionForm.value,
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
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  setSelectedOptions() {
    const { domicilioMexico } = this.datosEmpleoCargoComisionForm.value;

    if (domicilioMexico) {
      this.datosEmpleoCargoComisionForm
        .get('domicilioMexico.entidadFederativa')
        .setValue(findOption(this.estadosCatalogo, domicilioMexico.entidadFederativa.clave));
      this.datosEmpleoCargoComisionForm
        .get('domicilioMexico.municipioAlcaldia')
        .setValue(
          findOption(this.municipiosCatalogo[this.estado?.clave] || [], domicilioMexico.municipioAlcaldia.clave)
        );
    } else {
      this.tipoDomicilio = 'EXTRANJERO';
    }
  }

  tipoDomicilioChanged(value: any) {
    this.tipoDomicilio = value;
    const notSelectedType = this.tipoDomicilio === 'MEXICO' ? 'domicilioExtranjero' : 'domicilioMexico';
    const selectedType = this.tipoDomicilio === 'EXTRANJERO' ? 'domicilioExtranjero' : 'domicilioMexico';

    const notSelected = this.datosEmpleoCargoComisionForm.get(notSelectedType);
    notSelected.disable();
    notSelected.reset();

    this.datosEmpleoCargoComisionForm.get(selectedType).enable();
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.datosEmpleoCargoComisionForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
