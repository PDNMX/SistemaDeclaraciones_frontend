import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { experienciaLaboralMutation, experienciaLaboralQuery } from '@api/declaracion';
import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';
import { UntilDestroy, untilDestroyed } from '@core';
import { DeclaracionOutput } from '@models/declaracion/declaracion.model';
import { Experiencia, ExperienciaLaboral } from '@models/declaracion/experiencia-laboral.model';
import AmbitoPublico from '@static/catalogos/ambitoPublico.json';
import AmbitoSector from '@static/catalogos/ambitoSector.json';
import Extranjero from '@static/catalogos/extranjero.json';
import NivelOrdenGobierno from '@static/catalogos/nivelOrdenGobierno.json';
import Sector from '@static/catalogos/sector.json';
import { tooltipData } from '@static/tooltips/situacion-patrimonial/experiencia-laboral';
import { findOption } from '@utils/utils';

@UntilDestroy()
@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.scss'],
})
export class ExperienciaLaboralComponent implements OnInit {
  aclaraciones = false;
  aclaracionesText: string = null;
  experienciaLaboralForm: FormGroup;
  editMode = false;
  editIndex: number = null;
  experiencia: Experiencia[] = [];
  isLoading = false;

  @ViewChild('otroAmbitoSector') otroAmbitoSector: ElementRef;
  @ViewChild('otroSector') otroSector: ElementRef;

  ambitoSectorCatalogo = AmbitoSector;
  ambitoPublicoCatalogo = AmbitoPublico;
  nivelOrdenGobiernoCatalogo = NivelOrdenGobierno;
  sectorCatalogo = Sector;
  extranjeroCatalogo = Extranjero;

  declaracionSimplificada = false;
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
    const urlChunks = this.router.url.split('/');
    this.declaracionSimplificada = urlChunks[2] === 'simplificada';
    this.tipoDeclaracion = urlChunks[1] || null;
    this.createForm();
    this.getUserInfo();
  }

  addItem() {
    this.experienciaLaboralForm.reset();
    this.setAclaraciones(this.aclaracionesText);
    this.editMode = true;
    this.editIndex = null;
  }

  ambitoSectorChanged(clave: string) {
    const experiencia = this.experienciaLaboralForm.get('experiencia');
    if (clave === 'PUB') {
      [
        'nivelOrdenGobierno',
        'ambitoPublico',
        'nombreEntePublico',
        'areaAdscripcion',
        'empleoCargoComision',
        'funcionPrincipal',
      ].map((fieldName) => experiencia.get(fieldName).enable());

      ['nombreEmpresaSociedadAsociacion', 'rfc', 'area', 'puesto', 'sector'].map((fieldName) => {
        const field = experiencia.get(fieldName);
        field.reset();
        field.disable();
      });
    } else if (clave === 'PRV' || clave === 'OTR') {
      ['nombreEmpresaSociedadAsociacion', 'rfc', 'area', 'puesto', 'sector'].map((fieldName) =>
        experiencia.get(fieldName).enable()
      );

      [
        'nivelOrdenGobierno',
        'ambitoPublico',
        'nombreEntePublico',
        'areaAdscripcion',
        'empleoCargoComision',
        'funcionPrincipal',
      ].map((fieldName) => {
        const field = experiencia.get(fieldName);
        field.reset();
        field.disable();
      });
    } else {
      [
        'nombreEmpresaSociedadAsociacion',
        'rfc',
        'area',
        'puesto',
        'sector',
        'nivelOrdenGobierno',
        'ambitoPublico',
        'nombreEntePublico',
        'areaAdscripcion',
        'empleoCargoComision',
        'funcionPrincipal',
      ].map((fieldName) => {
        const field = experiencia.get(fieldName);
        field.reset();
        field.enable();
      });
    }
  }

  cancelEditMode() {
    this.editMode = false;
    this.editIndex = null;
  }

  createForm() {
    this.experienciaLaboralForm = this.formBuilder.group({
      ninguno: [false],
      experiencia: this.formBuilder.group({
        ambitoSector: [null, [Validators.required]],
        nivelOrdenGobierno: [null, [Validators.required]],
        ambitoPublico: [null, [Validators.required]],
        nombreEntePublico: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        areaAdscripcion: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        empleoCargoComision: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        funcionPrincipal: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        fechaIngreso: [null, [Validators.required]],
        fechaEgreso: [null, [Validators.required]],
        ubicacion: [null, [Validators.required]],
        nombreEmpresaSociedadAsociacion: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        rfc: [
          null,
          [
            Validators.pattern(
              /^([A-ZÑ&]{3}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
            ),
          ],
        ],
        area: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        puesto: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        sector: [null, [Validators.required]],
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });

    const ambitoSector = this.experienciaLaboralForm.get('experiencia.ambitoSector');

    ambitoSector.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      if (value) {
        this.ambitoSectorChanged(value.clave);
      }
    });
  }

  editItem(index: number) {
    this.setEditMode();
    this.fillForm(this.experiencia[index]);
    this.editIndex = index;
  }

  fillForm(experiencia: Experiencia) {
    this.experienciaLaboralForm.get('experiencia').patchValue(experiencia);
    this.setAclaraciones(this.aclaracionesText);

    if (experiencia.ambitoSector?.clave === 'OTR') {
      this.otroAmbitoSector.nativeElement.value = experiencia.ambitoSector?.valor;
    }

    if (experiencia.sector?.clave === 'OTRO') {
      this.otroSector.nativeElement.value = experiencia.sector.valor;
    }

    this.setSelectedOptions(experiencia);
  }

  async getUserInfo() {
    try {
      const { data, errors } = await this.apollo
        .query<DeclaracionOutput>({
          query: experienciaLaboralQuery,
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
      this.setupForm(data?.declaracion.experienciaLaboral);
    } catch (error) {
      console.log(error);
      this.openSnackBar('[ERROR: No se pudo recuperar la información]', 'Aceptar');
    }
  }

  get finalExperienciaForm() {
    const form = JSON.parse(JSON.stringify(this.experienciaLaboralForm.value.experiencia)); // Deep copy

    if (form.ambitoSector?.clave === 'OTR') {
      form.ambitoSector.valor = this.otroAmbitoSector.nativeElement.value;
    }

    if (form.sector?.clave === 'OTRO') {
      form.sector.valor = this.otroSector.nativeElement.value;
    }

    return form;
  }

  inputsAreValid(): boolean {
    let result = true;

    if (this.experienciaLaboralForm.value.experiencia.ambitoSector?.clave === 'OTR') {
      result = result && this.otroAmbitoSector.nativeElement.value?.match(/^\S.*\S$/);
    }

    if (this.experienciaLaboralForm.value.experiencia.sector?.clave === 'OTRO') {
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
        const experiencia = [...this.experiencia.slice(0, index), ...this.experiencia.slice(index + 1)];
        const aclaracionesObservaciones = this.experienciaLaboralForm.value.aclaracionesObservaciones;
        this.saveInfo({
          experiencia,
          aclaracionesObservaciones,
        });
      }
    });
  }

  async saveInfo(form: ExperienciaLaboral) {
    try {
      const declaracion = {
        experienciaLaboral: form,
      };

      const { data, errors } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: experienciaLaboralMutation,
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
      this.setupForm(data?.declaracion.experienciaLaboral);
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('[ERROR: No se guardaron los cambios]', 'Aceptar');
    }
  }

  saveItem() {
    let experiencia = [...this.experiencia];
    const aclaracionesObservaciones = this.experienciaLaboralForm.value.aclaracionesObservaciones;
    const newItem = this.finalExperienciaForm;

    if (this.editIndex === null) {
      experiencia = [...experiencia, newItem];
    } else {
      experiencia[this.editIndex] = newItem;
    }

    this.isLoading = true;

    this.saveInfo({
      experiencia,
      aclaracionesObservaciones,
    });

    this.isLoading = false;
  }

  setAclaraciones(aclaraciones?: string) {
    this.experienciaLaboralForm.get('aclaracionesObservaciones').patchValue(aclaraciones || null);
    this.aclaracionesText = aclaraciones || null;
    this.toggleAclaraciones(!!aclaraciones);
  }

  setEditMode() {
    this.experienciaLaboralForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  setSelectedOptions(experiencia: Experiencia) {
    if (experiencia?.ambitoSector) {
      this.experienciaLaboralForm
        .get('experiencia.ambitoSector')
        .setValue(findOption(this.ambitoSectorCatalogo, experiencia.ambitoSector.clave));
    }

    if (experiencia?.sector) {
      this.experienciaLaboralForm
        .get('experiencia.sector')
        .setValue(findOption(this.sectorCatalogo, experiencia.sector.clave));
    }
  }

  setupForm(experienciaLaboral: ExperienciaLaboral | undefined) {
    this.experiencia = experienciaLaboral?.experiencia || [];
    const aclaraciones = experienciaLaboral?.aclaracionesObservaciones;

    if (experienciaLaboral?.ninguno) {
      this.experienciaLaboralForm.get('ninguno').patchValue(true);
    }

    if (aclaraciones) {
      this.setAclaraciones(aclaraciones);
    }

    // this.editMode = !!!this.experiencia.length;
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.experienciaLaboralForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
