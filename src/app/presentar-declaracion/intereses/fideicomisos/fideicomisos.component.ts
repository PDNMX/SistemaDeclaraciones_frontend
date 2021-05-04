import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { fideicomisosMutation, fideicomisosQuery } from '@api/declaracion';
import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';
import { UntilDestroy, untilDestroyed } from '@core';
import { DeclaracionOutput, Fideicomiso, Fideicomisos } from '@models/declaracion';
import Extranjero from '@static/catalogos/extranjero.json';
import Relacion from '@static/catalogos/tipoRelacion.json';
import Sector from '@static/catalogos/sector.json';
import TipoFideicomiso from '@static/catalogos/tipoFideicomiso.json';
import TipoOperacion from '@static/catalogos/tipoOperacion.json';
import TipoParticipacion from '@static/catalogos/tipoParticipacionFideicomiso.json';
import { tooltipData } from '@static/tooltips/intereses/fideicomisos';
import { findOption } from '@utils/utils';

@UntilDestroy()
@Component({
  selector: 'app-fideicomisos',
  templateUrl: './fideicomisos.component.html',
  styleUrls: ['./fideicomisos.component.scss'],
})
export class FideicomisosComponent implements OnInit {
  aclaraciones = false;
  aclaracionesText: string = null;
  fideicomiso: Fideicomiso[] = [];
  fideicomisosForm: FormGroup;
  editMode = false;
  editIndex: number = null;
  isLoading = false;

  @ViewChild('otroSector') otroSector: ElementRef;

  extranjeroCatalogo = Extranjero;
  relacionCatalogo = Relacion;
  sectorCatalogo = Sector;
  tipoFideicomisoCatalogo = TipoFideicomiso;
  tipoOperacionCatalogo = TipoOperacion;
  tipoParticipacionCatalogo = TipoParticipacion;

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
    this.fideicomisosForm.reset();
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
        tipoOperacion: [null, [Validators.required]],
        tipoRelacion: [null, [Validators.required]],
        tipoFideicomiso: [null, [Validators.required]],
        tipoParticipacion: [null, [Validators.required]],
        rfcFideicomiso: [
          null,
          [
            Validators.pattern(
              /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
            ),
          ],
        ],
        fideicomitente: this.formBuilder.group({
          tipoPersona: [{ disabled: true, value: null }, [Validators.required]],
          nombreRazonSocial: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
          rfc: [
            { disabled: true, value: null },
            [
              Validators.required,
              Validators.pattern(
                /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
              ),
            ],
          ],
        }),
        fiduciario: this.formBuilder.group({
          nombreRazonSocial: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
          rfc: [
            { disabled: true, value: null },
            [
              Validators.required,
              Validators.pattern(
                /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
              ),
            ],
          ],
        }),
        fideicomisario: this.formBuilder.group({
          tipoPersona: [{ disabled: true, value: null }, [Validators.required]],
          nombreRazonSocial: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
          rfc: [
            { disabled: true, value: null },
            [
              Validators.required,
              Validators.pattern(
                /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
              ),
            ],
          ],
        }),
        sector: [null, [Validators.required]],
        extranjero: [null, [Validators.required]],
      }),
      aclaracionesObservaciones: [
        { disabled: true, value: null },
        [Validators.required, Validators.pattern(/^\S.*\S$/)],
      ],
    });

    const tipoParticipacion = this.fideicomisosForm.get('fideicomiso.tipoParticipacion');

    tipoParticipacion.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      this.tipoParticipacionChanged(value);
    });
  }

  editItem(index: number) {
    this.setEditMode();
    this.fillForm(this.fideicomiso[index]);
    this.editIndex = index;
  }

  fillForm(fideicomiso: Fideicomiso) {
    const fideicomisoForm = this.fideicomisosForm.get('fideicomiso');
    fideicomisoForm.patchValue(fideicomiso || {});

    this.setAclaraciones(this.aclaracionesText);
    this.setSelectedOptions();
  }

  get finalFideicomisoForm() {
    const form = JSON.parse(JSON.stringify(this.fideicomisosForm.value.fideicomiso)); // Deep copy

    if (form.sector?.clave === 'OTRO') {
      form.sector.valor = this.otroSector.nativeElement.value;
    }

    return form;
  }

  async getUserInfo() {
    try {
      const { data, errors } = await this.apollo
        .query<DeclaracionOutput>({
          query: fideicomisosQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();

      if (errors) {
        throw errors;
      }

      this.declaracionId = data?.declaracion._id;
      if (data?.declaracion.fideicomisos) {
        this.setupForm(data?.declaracion.fideicomisos);
      }
    } catch (error) {
      console.log(error);
      this.openSnackBar('[ERROR: No se pudo recuperar la información]', 'Aceptar');
    }
  }

  inputsAreValid(): boolean {
    let result = true;
    const fideicomiso = this.fideicomisosForm.value.fideicomiso;

    if (fideicomiso.sector?.clave === 'OTRO') {
      result = result && this.otroSector.nativeElement.value?.match(/^\S.*\S$/);
    }

    return result;
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

      const { data, errors } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: fideicomisosMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();

      if (errors) {
        throw errors;
      }

      this.editMode = false;
      this.setupForm(data?.declaracion.fideicomisos);
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('[ERROR: No se guardaron los cambios]', 'Aceptar');
    }
  }

  saveItem() {
    let fideicomiso = [...this.fideicomiso];
    const aclaracionesObservaciones = this.fideicomisosForm.value.aclaracionesObservaciones;
    const newItem = this.finalFideicomisoForm;

    if (this.editIndex === null) {
      fideicomiso = [...fideicomiso, newItem];
    } else {
      fideicomiso[this.editIndex] = newItem;
    }

    this.isLoading = true;
    console.log(fideicomiso);
    this.saveInfo({
      fideicomiso,
      aclaracionesObservaciones,
    });

    this.isLoading = false;
  }

  setAclaraciones(aclaraciones?: string) {
    this.fideicomisosForm.get('aclaracionesObservaciones').patchValue(aclaraciones || null);
    this.aclaracionesText = aclaraciones || null;
    this.toggleAclaraciones(!!aclaraciones);
  }

  setEditMode() {
    this.fideicomisosForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  setSelectedOptions() {
    const { sector } = this.fideicomisosForm.value.fideicomiso;

    if (sector) {
      this.fideicomisosForm.get('fideicomiso.sector').setValue(findOption(this.sectorCatalogo, sector.clave));
    }
  }

  setupForm(fideicomisos: Fideicomisos | undefined) {
    this.fideicomiso = fideicomisos?.fideicomiso || [];
    const aclaraciones = fideicomisos?.aclaracionesObservaciones;

    if (fideicomisos?.ninguno) {
      this.fideicomisosForm.get('ninguno').patchValue(true);
    }

    if (aclaraciones) {
      this.setAclaraciones(aclaraciones);
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
