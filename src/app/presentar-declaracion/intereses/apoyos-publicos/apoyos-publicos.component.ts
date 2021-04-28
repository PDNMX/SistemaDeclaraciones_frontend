import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Apoyo, Apoyos, DeclaracionOutput } from '@models/declaracion';

import { findOption } from '@utils/utils';

import beneficiarioPrograma from '@static/catalogos/beneficiariosPrograma.json';
import NivelGobierno from '@static/catalogos/nivelOrdenGobierno.json';
import TiposApoyo from '@static/catalogos/tipoApoyo.json';
import RecepcionApoyo from '@static/catalogos/formaRecepcion.json';

import { tooltipData } from '@static/tooltips/intereses/apoyos';
import { apoyosQuery, apoyosMutation } from '@api/declaracion';

import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';

@Component({
  selector: 'app-apoyos-publicos',
  templateUrl: './apoyos-publicos.component.html',
  styleUrls: ['./apoyos-publicos.component.scss'],
})
export class ApoyosPublicosComponent implements OnInit {
  aclaraciones = false;
  apoyo: Apoyo[] = [];
  apoyosForm: FormGroup;
  editMode = false;
  editIndex: number = null;
  isLoading = false;

  beneficiarioProgramaCatalogo = beneficiarioPrograma;
  NivelGobiernoCatalogo = NivelGobierno;
  TiposApoyoCatalogo = TiposApoyo;
  recepcionApoyoCatalogo = RecepcionApoyo;

  tipoDeclaracion: string = null;

  declaracionId: string = null;

  tooltipData = tooltipData;
  errorMatcher = new DeclarationErrorStateMatcher();

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
    this.apoyosForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  cancelEditMode() {
    this.editMode = false;
    this.editIndex = null;
  }

  createForm() {
    this.apoyosForm = this.formBuilder.group({
      ninguno: [false],
      apoyo: this.formBuilder.group({
        // tipoOperacion: [''],
        tipoPersona: ['', [Validators.required]],
        beneficiarioPrograma: [{ clave: '', valor: '' }, [Validators.required]],
        nombrePrograma: ['', [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
        institucionOtorgante: ['', [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
        nivelOrdenGobierno: ['', Validators.required],
        tipoApoyo: [{ clave: '', valor: '' }, [Validators.required]],
        formaRecepcion: ['', Validators.required],
        montoApoyoMensual: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        especifiqueApoyo: ['', [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });
  }

  editItem(index: number) {
    this.setEditMode();
    this.fillForm(this.apoyo[index]);
    this.editIndex = index;
  }

  fillForm(apoyo: Apoyo) {
    Object.keys(apoyo)
      .filter((field) => apoyo[field] !== null)
      .forEach((field) => this.apoyosForm.get(`apoyo.${field}`).patchValue(apoyo[field]));

    this.setSelectedOptions();
  }

  async getUserInfo() {
    try {
      const { data } = await this.apollo
        .query<DeclaracionOutput>({
          query: apoyosQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();
      this.declaracionId = data.declaracion._id;
      if (data.declaracion.apoyos) {
        this.setupForm(data.declaracion.apoyos);
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {}

  noApoyo() {
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
        const apoyo = [...this.apoyo.slice(0, index), ...this.apoyo.slice(index + 1)];
        const aclaracionesObservaciones = this.apoyosForm.value.aclaracionesObservaciones;
        this.saveInfo({
          apoyo,
          aclaracionesObservaciones,
        });
      }
    });
  }

  async saveInfo(form: Apoyos) {
    try {
      const declaracion = {
        apoyos: form,
      };

      const { data } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: apoyosMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();

      this.editMode = false;
      this.setupForm(data.declaracion.apoyos);
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  saveItem() {
    let apoyo = [...this.apoyo];
    const { aclaracionesObservaciones } = this.apoyosForm.value;
    const newItem = this.apoyosForm.value.apoyo;

    if (this.editIndex === null) {
      apoyo = [...apoyo, newItem];
    } else {
      apoyo[this.editIndex] = newItem;
    }

    this.isLoading = true;

    this.saveInfo({
      apoyo,
      aclaracionesObservaciones,
    });

    this.isLoading = false;
  }

  setEditMode() {
    this.apoyosForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  setSelectedOptions() {
    const { beneficiarioPrograma, tipoApoyo } = this.apoyosForm.value.apoyo;

    if (beneficiarioPrograma) {
      this.apoyosForm
        .get('apoyo.beneficiarioPrograma')
        .setValue(findOption(this.beneficiarioProgramaCatalogo, beneficiarioPrograma.clave));
    }

    if (tipoApoyo) {
      this.apoyosForm.get('apoyo.tipoApoyo').setValue(findOption(this.TiposApoyoCatalogo, tipoApoyo.clave));
    }
  }

  setupForm(apoyos: Apoyos) {
    this.apoyo = apoyos?.apoyo || [];
    const aclaraciones = apoyos?.aclaracionesObservaciones;

    if (apoyos?.ninguno) {
      this.apoyosForm.get('ninguno').patchValue(true);
    }

    if (aclaraciones) {
      this.apoyosForm.get('aclaracionesObservaciones').setValue(aclaraciones);
      this.toggleAclaraciones(true);
    }

    // this.editMode = !!!this.apoyo.length;
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.apoyosForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
