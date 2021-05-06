import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { declaracionMutation, ingresosQuery } from '@api/declaracion';
import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';
import { UntilDestroy, untilDestroyed } from '@core';
import {
  ActividadFinanciera,
  ActividadIndustrial,
  DeclaracionOutput,
  Ingresos,
  OtrosIngresos,
  ServiciosProfesionales,
} from '@models/declaracion';
import TipoInstrumento from '@static/catalogos/tipoInstrumento.json';
import { tooltipData } from '@static/tooltips/situacion-patrimonial/ingresos-netos';
import { findOption } from '@utils/utils';

@UntilDestroy()
@Component({
  selector: 'app-ingresos-netos',
  templateUrl: './ingresos-netos.component.html',
  styleUrls: ['./ingresos-netos.component.scss'],
})
export class IngresosNetosComponent implements OnInit {
  aclaraciones = false;
  ingresosForm: FormGroup;
  isLoading = false;

  otrosIngresosDeclarante = 0;
  ingresoNetoDeclarante = 0;
  ingresosTotales = 0;

  tipoInstrumentoCatalogo = TipoInstrumento;

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

  addActividadFinanciera() {
    this.actividadFinanciera.push(
      this.formBuilder.group({
        remuneracion: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        tipoInstrumento: [null, [Validators.required]],
      })
    );
  }

  addActividadIndustrialComercialEmpresarial() {
    this.actividadIndustrialComercialEmpresarial.push(
      this.formBuilder.group({
        remuneracion: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        nombreRazonSocial: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        tipoNegocio: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      })
    );
  }

  addOtrosIngresos() {
    this.otrosIngresos.push(
      this.formBuilder.group({
        remuneracion: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        tipoIngreso: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      })
    );
  }

  addServiciosProfesionales() {
    this.serviciosProfesionales.push(
      this.formBuilder.group({
        remuneracion: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        tipoServicio: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      })
    );
  }

  calcOtrosIngresosDeclarante() {
    const total = [
      'actividadIndustrialComercialEmpresarial',
      'actividadFinanciera',
      'otrosIngresos',
      'serviciosProfesionales',
    ].reduce((accum: number, section: string) => accum + this.calcTotalAmountOfSection(section), 0);

    return total;
  }

  calcTotalAmountOfSection(section: string) {
    let formArray: FormArray = null;

    switch (section) {
      case 'actividadIndustrialComercialEmpresarial':
        formArray = this.actividadIndustrialComercialEmpresarial;
        break;
      case 'actividadFinanciera':
        formArray = this.actividadFinanciera;
        break;
      case 'otrosIngresos':
        formArray = this.otrosIngresos;
        break;
      case 'serviciosProfesionales':
        formArray = this.serviciosProfesionales;
        break;
      default:
        break;
    }

    const total = formArray.value.reduce(
      (accum: number, current: ActividadIndustrial | ActividadFinanciera | OtrosIngresos | ServiciosProfesionales) =>
        accum + current.remuneracion.valor,
      0
    );
    return total;
  }

  confirmSaveInfo() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: '¿Guardar cambios?',
        message: '',
        trueText: 'Guardar',
        falseText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const form: Ingresos = this.ingresosForm.value;
        //sections
        form.actividadIndustrialComercialEmpresarial.remuneracionTotal.valor = this.calcTotalAmountOfSection(
          'actividadIndustrialComercialEmpresarial'
        );
        form.actividadFinanciera.remuneracionTotal.valor = this.calcTotalAmountOfSection('actividadFinanciera');
        form.otrosIngresos.remuneracionTotal.valor = this.calcTotalAmountOfSection('otrosIngresos');
        form.serviciosProfesionales.remuneracionTotal.valor = this.calcTotalAmountOfSection('serviciosProfesionales');
        //totals
        form.otrosIngresosMensualesTotal.valor = this.otrosIngresosDeclarante;
        form.ingresoMensualNetoDeclarante.valor = this.ingresoNetoDeclarante;
        form.totalIngresosMensualesNetos.valor = this.ingresosTotales;
        this.saveInfo(form);
      }
    });
  }

  createForm() {
    this.ingresosForm = this.formBuilder.group({
      remuneracionMensualCargoPublico: this.formBuilder.group({
        valor: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
        moneda: ['MXN'],
      }),
      otrosIngresosMensualesTotal: this.formBuilder.group({
        valor: [0, [Validators.pattern(/^\d+$/), Validators.min(0)]],
        moneda: ['MXN'],
      }),
      actividadIndustrialComercialEmpresarial: this.formBuilder.group({
        remuneracionTotal: this.formBuilder.group({
          valor: [0, [Validators.pattern(/^\d+$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        actividades: this.formBuilder.array([]),
      }),
      actividadFinanciera: this.formBuilder.group({
        remuneracionTotal: this.formBuilder.group({
          valor: [0, [Validators.pattern(/^\d+$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        actividades: this.formBuilder.array([]),
      }),
      serviciosProfesionales: this.formBuilder.group({
        remuneracionTotal: this.formBuilder.group({
          valor: [0, [Validators.pattern(/^\d+$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        servicios: this.formBuilder.array([]),
      }),
      otrosIngresos: this.formBuilder.group({
        remuneracionTotal: this.formBuilder.group({
          valor: [0, [Validators.pattern(/^\d+$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        ingresos: this.formBuilder.array([]),
      }),
      ingresoMensualNetoDeclarante: this.formBuilder.group({
        valor: [0, [Validators.pattern(/^\d+$/), Validators.min(0)]],
        moneda: ['MXN'],
      }),
      ingresoMensualNetoParejaDependiente: this.formBuilder.group({
        valor: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
        moneda: ['MXN'],
      }),
      totalIngresosMensualesNetos: this.formBuilder.group({
        valor: [0, [Validators.pattern(/^\d+$/), Validators.min(0)]],
        moneda: ['MXN'],
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });

    this.ingresosForm.valueChanges.pipe(untilDestroyed(this)).subscribe((form: Ingresos) => {
      this.otrosIngresosDeclarante = this.calcOtrosIngresosDeclarante();
      this.ingresoNetoDeclarante = form.remuneracionMensualCargoPublico.valor + this.otrosIngresosDeclarante;
      this.ingresosTotales = this.ingresoNetoDeclarante + form.ingresoMensualNetoParejaDependiente.valor;
    });
  }

  deleteFormArrayItem(formArrayName: string, index: number) {
    let formArray: FormArray = null;

    switch (formArrayName) {
      case 'actividadIndustrialComercialEmpresarial':
        formArray = this.actividadIndustrialComercialEmpresarial;
        break;
      case 'actividadFinanciera':
        formArray = this.actividadFinanciera;
        break;
      case 'otrosIngresos':
        formArray = this.otrosIngresos;
        break;
      case 'serviciosProfesionales':
        formArray = this.serviciosProfesionales;
        break;
      default:
        break;
    }

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
        formArray.removeAt(index);
      }
    });
  }

  fillFormArray(
    formArrayName: string,
    data: Array<ActividadIndustrial | ActividadFinanciera | OtrosIngresos | ServiciosProfesionales>
  ) {
    let formArray: FormArray = null;

    for (let [index, value] of data.entries()) {
      switch (formArrayName) {
        case 'actividadIndustrialComercialEmpresarial':
          this.addActividadIndustrialComercialEmpresarial();
          formArray = this.actividadIndustrialComercialEmpresarial;
          break;
        case 'actividadFinanciera':
          this.addActividadFinanciera();
          formArray = this.actividadFinanciera;
          break;
        case 'otrosIngresos':
          this.addOtrosIngresos();
          formArray = this.otrosIngresos;
          break;
        case 'serviciosProfesionales':
          this.addServiciosProfesionales();
          formArray = this.serviciosProfesionales;
          break;
        default:
          break;
      }
      formArray.at(index).patchValue(value);

      if (formArrayName === 'actividadFinanciera') {
        const { tipoInstrumento } = formArray.at(index).value;
        formArray
          .at(index)
          .get('tipoInstrumento')
          .setValue(findOption(this.tipoInstrumentoCatalogo, tipoInstrumento?.clave));
      }
    }
  }

  fillForm(ingresos: Ingresos) {
    this.ingresosForm.patchValue(ingresos);

    [
      'actividadIndustrialComercialEmpresarial',
      'actividadFinanciera',
      'otrosIngresos',
      'serviciosProfesionales',
    ].forEach((section) => {
      const data = ingresos[section];
      this.ingresosForm.get(section).patchValue(data);
      let dataArray = [];
      switch (section) {
        case 'actividadIndustrialComercialEmpresarial':
        case 'actividadFinanciera':
          dataArray = data.actividades;
          break;
        case 'otrosIngresos':
          dataArray = data.ingresos;
          break;
        case 'serviciosProfesionales':
          dataArray = data.servicios;
        default:
          break;
      }
      this.fillFormArray(section, dataArray);
    });

    if (ingresos.aclaracionesObservaciones) {
      this.toggleAclaraciones(true);
    }
  }

  get actividadFinanciera() {
    return this.ingresosForm.get('actividadFinanciera.actividades') as FormArray;
  }

  get actividadIndustrialComercialEmpresarial() {
    return this.ingresosForm.get('actividadIndustrialComercialEmpresarial.actividades') as FormArray;
  }

  get otrosIngresos() {
    return this.ingresosForm.get('otrosIngresos.ingresos') as FormArray;
  }

  get serviciosProfesionales() {
    return this.ingresosForm.get('serviciosProfesionales.servicios') as FormArray;
  }

  async getUserInfo() {
    try {
      const { data, errors } = await this.apollo
        .query<DeclaracionOutput>({
          query: ingresosQuery,
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
      if (data?.declaracion.ingresos) {
        this.fillForm(data?.declaracion.ingresos);
      }
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

  presentSuccessAlert() {
    this.dialog.open(DialogComponent, {
      data: {
        title: 'Información actualizada',
        message: 'Se han guardado tus cambios',
        trueText: 'Aceptar',
      },
    });
  }

  async saveInfo(form: Ingresos) {
    try {
      this.isLoading = true;

      const declaracion = {
        ingresos: form,
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
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('[ERROR: No se guardaron los cambios]', 'Aceptar');
    }
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.ingresosForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
