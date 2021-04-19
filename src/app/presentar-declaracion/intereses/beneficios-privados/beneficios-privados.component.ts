import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';

import { beneficiosPrivadosQuery, beneficiosPrivadosMutation } from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import TipoBeneficio from '@static/catalogos/tipoBeneficio.json';
import beneficiario from '@static/catalogos/beneficiariosPrograma.json';
import FormaRecepcion from '@static/catalogos/formaRecepcion.json';
import Sector from '@static/catalogos/sector.json';

import { tooltipData } from '@static/tooltips/intereses/beneficios';

import { Beneficio, BeneficiosPrivados, DeclaracionOutput } from '@models/declaracion';

import { findOption } from '@utils/utils';

@Component({
  selector: 'app-beneficios-privados',
  templateUrl: './beneficios-privados.component.html',
  styleUrls: ['./beneficios-privados.component.scss'],
})
export class BeneficiosPrivadosComponent implements OnInit {
  aclaraciones = false;
  beneficio: Beneficio[] = [];
  beneficiosPrivadosForm: FormGroup;
  editMode = false;
  editIndex: number = null;
  isLoading = false;

  tipoBeneficioCatalogo = TipoBeneficio;
  beneficiarioCatalogo = beneficiario;
  recepcionCatalogo = FormaRecepcion;
  sectorCatalogo = Sector;

  tipoDeclaracion: string = null;

  declaracionId: string = null;

  tooltipData = tooltipData;

  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.tipoDeclaracion = this.router.url.split('/')[1];
    this.createForm();
    this.getUserInfo();
  }

  addItem() {
    this.beneficiosPrivadosForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  cancelEditMode() {
    this.editMode = false;
    this.editIndex = null;
  }

  createForm() {
    this.beneficiosPrivadosForm = this.formBuilder.group({
      ninguno: [false],
      beneficio: this.formBuilder.group({
        //tipoOperacion: ['', Validators.required],
        tipoPersona: [''],
        tipoBeneficio: ['', [Validators.required]], //
        beneficiario: ['', [Validators.required]],
        otorgante: this.formBuilder.group({
          tipoPersona: ['', [Validators.required]],
          nombreRazonSocial: ['', [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
          rfc: [
            '',
            [
              Validators.required,
              Validators.pattern(
                /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
              ),
            ],
          ],
        }),
        formaRecepcion: ['', Validators.required],
        especifiqueBeneficio: ['', [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
        montoMensualAproximado: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/), Validators.min(0)]],
          moneda: ['MXN', [Validators.pattern(/^\S.*\S?$/)]],
        }),
        sector: ['', [Validators.required]],
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });
  }

  editItem(index: number) {
    this.setEditMode();
    this.fillForm(this.beneficio[index]);
    this.editIndex = index;
  }

  fillForm(beneficios: any) {
    Object.keys(beneficios)
      .filter((field) => beneficios[field] !== null)
      .forEach((field) => this.beneficiosPrivadosForm.get(`beneficio.${field}`).patchValue(beneficios[field]));

    this.setSelectedOptions();
  }

  async getUserInfo() {
    try {
      const { data } = await this.apollo
        .query<DeclaracionOutput>({
          query: beneficiosPrivadosQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();
      this.declaracionId = data.declaracion._id;
      if (data.declaracion.beneficiosPrivados) {
        this.setupForm(data.declaracion.beneficiosPrivados);
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {}

  noBenefits() {
    this.saveInfo({ ninguno: true });
  }

  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  presentSuccessAlert() {
    this.dialog.open(DialogComponent, {
      data: {
        title: 'Información actualizada',
        message: 'Se han guardado tus cambios',
        trueText: 'Aceptar',
      },
    });
  }

  removeItem(index: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Eliminar elemento',
        message: '¿Está seguro de eliminar este elemento?',
        trueText: 'Eliminar',
        falseText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const beneficio = [...this.beneficio.slice(0, index), ...this.beneficio.slice(index + 1)];
        const aclaracionesObservaciones = this.beneficiosPrivadosForm.value.aclaracionesObservaciones;
        this.saveInfo({
          beneficio,
          aclaracionesObservaciones,
        });
      }
    });
  }

  async saveInfo(form: BeneficiosPrivados) {
    try {
      const declaracion = {
        beneficiosPrivados: form,
      };

      const { data } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: beneficiosPrivadosMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();

      this.editMode = false;
      if (data.declaracion.beneficiosPrivados) {
        this.setupForm(data.declaracion.beneficiosPrivados);
      }
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  saveItem() {
    let beneficio = [...this.beneficio];
    const aclaracionesObservaciones = this.beneficiosPrivadosForm.value.aclaracionesObservaciones;
    const newItem = this.beneficiosPrivadosForm.value.beneficio;

    if (this.editIndex === null) {
      beneficio = [...beneficio, newItem];
    } else {
      beneficio[this.editIndex] = newItem;
    }

    this.isLoading = true;

    this.saveInfo({
      beneficio,
      aclaracionesObservaciones,
    });

    this.isLoading = false;
  }

  setEditMode() {
    this.beneficiosPrivadosForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  setSelectedOptions() {
    const { tipoBeneficio, beneficiario, sector } = this.beneficiosPrivadosForm.value.beneficio;

    if (tipoBeneficio) {
      this.beneficiosPrivadosForm
        .get('beneficio.tipoBeneficio')
        .setValue(findOption(this.tipoBeneficioCatalogo, tipoBeneficio));
    }

    if (beneficiario) {
      this.beneficiosPrivadosForm
        .get('beneficio.beneficiario')
        .setValue(findOption(this.beneficiarioCatalogo, beneficiario[0]));
    }

    if (sector) {
      this.beneficiosPrivadosForm.get('beneficio.sector').setValue(findOption(this.sectorCatalogo, sector.clave));
    }
  }

  setupForm(beneficios: BeneficiosPrivados) {
    if (!beneficios) return;
    this.beneficio = beneficios.beneficio || [];
    const aclaraciones = beneficios.aclaracionesObservaciones;

    if (beneficios.ninguno) {
      this.beneficiosPrivadosForm.get('ninguno').patchValue(true);
    }

    if (aclaraciones) {
      this.beneficiosPrivadosForm.get('aclaracionesObservaciones').setValue(aclaraciones);
      this.toggleAclaraciones(true);
    }

    /// his.editMode = !!!this.beneficios.length;
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.beneficiosPrivadosForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
