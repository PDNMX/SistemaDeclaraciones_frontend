import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { fideicomisosMutation, fideicomisosQuery } from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import Relacion from '@static/catalogos/tipoRelacion.json';
import TipoFideicomiso from '@static/catalogos/tipoFideicomiso.json';
import TipoParticipacion from '@static/catalogos/tipoParticipacionFideicomiso.json';
import Sector from '@static/catalogos/sector.json';
import Extranjero from '@static/catalogos/extranjero.json';

import { DeclaracionOutput, Fideicomiso, Fideicomisos } from '@models/declaracion';

import { findOption } from '@utils/utils';
import { Constantes } from '@app/@shared/constantes';

@Component({
  selector: 'app-fideicomisos',
  templateUrl: './fideicomisos.component.html',
  styleUrls: ['./fideicomisos.component.scss'],
})
export class FideicomisosComponent implements OnInit {
  aclaraciones = false;
  fideicomiso: Fideicomiso[] = [];
  fideicomisosForm: FormGroup;
  editMode = false;
  editIndex: number = null;
  isLoading = false;

  relacionCatalogo = Relacion;
  tipoFideicomisoCatalogo = TipoFideicomiso;
  tipoParticipacionCatalogo = TipoParticipacion;
  sectorCatalogo = Sector;
  extranjeroCatalogo = Extranjero;

  tipoDeclaracion: string = null;

  declaracionId: string = null;

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
    //this.fideicomisosForm.reset();
    this.createForm();
    this.editMode = true;
    this.editIndex = null;
  }

  cancelEditMode() {
    this.editMode = false;
    this.editIndex = null;
  }

  createForm() {
    this.fideicomisosForm = this.formBuilder.group({
      ninguno: false,
      fideicomiso: this.formBuilder.group({
        tipoOperacion: ['AGREGAR'],
        tipoRelacion: ['', Validators.required],
        tipoFideicomiso: ['', Validators.required],
        tipoParticipacion: ['', [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
        rfcFideicomiso: ['', [Validators.pattern(Constantes.VALIDACION_RFC)]],
        fideicomitente: this.formBuilder.group({
          tipoPersona: ['', Validators.required],
          nombreRazonSocial: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
          rfc: ['', [Validators.required, Validators.pattern(Constantes.VALIDACION_RFC)]],
        }),
        fiduciario: this.formBuilder.group({
          nombreRazonSocial: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
          rfc: ['', [Validators.required, Validators.pattern(Constantes.VALIDACION_RFC)]],
        }),
        fideicomisario: this.formBuilder.group({
          tipoPersona: ['', Validators.required],
          nombreRazonSocial: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
          rfc: ['', [Validators.required, Validators.pattern(Constantes.VALIDACION_RFC)]],
        }),
        sector: ['', [Validators.required]],
        extranjero: ['', Validators.required],
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });
  }

  editItem(index: number) {
    this.setEditMode();
    this.fillForm(this.fideicomiso[index]);
    this.editIndex = index;
  }

  fillForm(fideicomiso: Fideicomiso) {
    Object.keys(fideicomiso)
      .filter((field) => fideicomiso[field] !== null)
      .forEach((field) => this.fideicomisosForm.get(`fideicomiso.${field}`).patchValue(fideicomiso[field]));

    this.setSelectedOptions();
  }

  async getUserInfo() {
    try {
      const { data } = await this.apollo
        .query<DeclaracionOutput>({
          query: fideicomisosQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();

      this.declaracionId = data.declaracion._id;
      if (data.declaracion.fideicomisos) {
        this.setupForm(data.declaracion.fideicomisos);
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {}

  noExperience() {
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
        const fideicomiso = [...this.fideicomiso.slice(0, index), ...this.fideicomiso.slice(index + 1)];
        const aclaracionesObservaciones = this.fideicomisosForm.value.aclaracionesObservaciones;
        this.saveInfo({
          fideicomiso,
          aclaracionesObservaciones,
        });
      }
    });
  }

  async saveInfo(form: Fideicomisos) {
    try {
      const declaracion = {
        fideicomisos: form,
      };

      const { data } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: fideicomisosMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();
      this.editMode = false;
      if (data.declaracion.fideicomisos) {
        this.setupForm(data.declaracion.fideicomisos);
      }
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  saveItem() {
    let fideicomiso = [...this.fideicomiso];
    const aclaracionesObservaciones = this.fideicomisosForm.value.aclaracionesObservaciones;
    const newItem = this.fideicomisosForm.value.fideicomiso;

    if (this.editIndex === null) {
      fideicomiso = [...fideicomiso, newItem];
    } else {
      fideicomiso[this.editIndex] = newItem;
    }

    this.isLoading = true;

    this.saveInfo({
      fideicomiso,
      aclaracionesObservaciones,
    });

    this.isLoading = false;
  }

  setEditMode() {
    //this.fideicomisosForm.reset();
    this.createForm();
    this.editMode = true;
    this.editIndex = null;
  }

  setSelectedOptions() {
    const { sector } = this.fideicomisosForm.value.fideicomiso;

    if (sector) {
      this.fideicomisosForm.get('fideicomiso.sector').setValue(findOption(this.sectorCatalogo, sector));
    }
  }

  setupForm(fideicomisos: Fideicomisos) {
    this.fideicomiso = fideicomisos.fideicomiso;
    const aclaraciones = fideicomisos.aclaracionesObservaciones;

    if (fideicomisos.ninguno) {
      this.fideicomisosForm.get('ninguno').patchValue(true);
    }

    if (aclaraciones) {
      this.fideicomisosForm.get('aclaracionesObservaciones').setValue(aclaraciones);
      this.toggleAclaraciones(true);
    }
  }

  tipoParticipacionChanged(value: string) {
    const fideicomiso = this.fideicomisosForm.get('fideicomiso');
    const fideicomitente = fideicomiso.get('fideicomitente');
    const fiduciario = fideicomiso.get('fiduciario');
    const fideicomisario = fideicomiso.get('fideicomisario');

    switch (value) {
      case 'FIDEICOMITENTE':
        fideicomitente.reset();
        fideicomitente.enable();
        fiduciario.disable();
        fideicomisario.disable();
        break;
      case 'FIDUCIARIO':
        fideicomitente.disable();
        fiduciario.reset();
        fiduciario.enable();
        fideicomisario.disable();
        break;
      case 'FIDEICOMISARIO':
        fideicomitente.disable();
        fiduciario.disable();
        fideicomisario.reset();
        fideicomisario.enable();
        break;
      default:
        fideicomitente.disable();
        fiduciario.disable();
        fideicomisario.disable();
        break;
    }
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.fideicomisosForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
