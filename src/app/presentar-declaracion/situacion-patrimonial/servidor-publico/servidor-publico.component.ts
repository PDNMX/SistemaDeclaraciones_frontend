import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { declaracionMutation, actividadAnualAnteriorQuery } from '@api/declaracion';
import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';
import { UntilDestroy, untilDestroyed } from '@core';
import {
  ActividadAnualAnterior,
  ActividadFinanciera,
  ActividadIndustrial,
  DeclaracionOutput,
  EnajenacionBienes,
  OtrosIngresos,
  ServiciosProfesionales,
} from '@models/declaracion';
import TipoBienEnajenado from '@static/catalogos/tipoBienEnajenacionBienes.json';
import TipoInstrumento from '@static/catalogos/tipoInstrumento.json';
import { tooltipData } from '@static/tooltips/situacion-patrimonial/anio-anterior';
import { findOption } from '@utils/utils';

@UntilDestroy()
@Component({
  selector: 'app-servidor-publico',
  templateUrl: './servidor-publico.component.html',
  styleUrls: ['./servidor-publico.component.scss'],
})
export class ServidorPublicoComponent implements OnInit {
  aclaraciones = false;
  actividadAnualAnteriorForm: FormGroup;
  isLoading = false;
  userId: string = null;

  ingresoNetoDeclarante = 0;
  ingresosTotales = 0;
  otrosIngresosDeclarante = 0;

  secciones = [
    'actividadIndustrialComercialEmpresarial',
    'actividadFinanciera',
    'enajenacionBienes',
    'otrosIngresos',
    'serviciosProfesionales',
  ];

  tipoInstrumentoCatalogo = TipoInstrumento;
  tipoBienEnajenadoCatalogo = TipoBienEnajenado;

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

  addEnajenacionBienes() {
    this.enajenacionBienes.push(
      this.formBuilder.group({
        remuneracion: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        tipoBienEnajenado: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
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
    let total = 0;

    try {
      total = this.secciones.reduce(
        (accum: number, section: string) => accum + this.calcTotalAmountOfSection(section),
        0
      );
    } catch (error) {
      console.log(error);
    }

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
      case 'enajenacionBienes':
        formArray = this.enajenacionBienes;
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

    let total = 0;

    try {
      total = formArray.value.reduce(
        (
          accum: number,
          current:
            | ActividadIndustrial
            | ActividadFinanciera
            | EnajenacionBienes
            | OtrosIngresos
            | ServiciosProfesionales
        ) => accum + current.remuneracion.valor,
        0
      );
    } catch (error) {
      console.log(error);
    }

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
        const form: ActividadAnualAnterior = this.actividadAnualAnteriorForm.value;
        if (form.servidorPublicoAnioAnterior) {
          //sections
          form.actividadIndustrialComercialEmpresarial.remuneracionTotal.valor = this.calcTotalAmountOfSection(
            'actividadIndustrialComercialEmpresarial'
          );
          form.actividadFinanciera.remuneracionTotal.valor = this.calcTotalAmountOfSection('actividadFinanciera');
          form.otrosIngresos.remuneracionTotal.valor = this.calcTotalAmountOfSection('otrosIngresos');
          form.enajenacionBienes.remuneracionTotal.valor = this.calcTotalAmountOfSection('enajenacionBienes');
          form.serviciosProfesionales.remuneracionTotal.valor = this.calcTotalAmountOfSection('serviciosProfesionales');
          //totals
          form.otrosIngresosTotal.valor = this.otrosIngresosDeclarante;
          form.ingresoNetoAnualDeclarante.valor = this.ingresoNetoDeclarante;
          form.totalIngresosNetosAnuales.valor = this.ingresosTotales;

          this.saveInfo(form);
        } else {
          this.saveInfo({
            servidorPublicoAnioAnterior: false,
            aclaracionesObservaciones: form.aclaracionesObservaciones,
          });
        }
      }
    });
  }

  createForm() {
    this.actividadAnualAnteriorForm = this.formBuilder.group({
      servidorPublicoAnioAnterior: [true, [Validators.required]],
      fechaIngreso: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      fechaConclusion: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      remuneracionNetaCargoPublico: this.formBuilder.group({
        valor: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
        moneda: ['MXN'],
      }),
      otrosIngresosTotal: this.formBuilder.group({
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
      enajenacionBienes: this.formBuilder.group({
        remuneracionTotal: this.formBuilder.group({
          valor: [0, [Validators.pattern(/^\d+$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        bienes: this.formBuilder.array([]),
      }),
      otrosIngresos: this.formBuilder.group({
        remuneracionTotal: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        ingresos: this.formBuilder.array([]),
      }),
      ingresoNetoAnualDeclarante: this.formBuilder.group({
        valor: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
        moneda: ['MXN'],
      }),
      ingresoNetoAnualParejaDependiente: this.formBuilder.group({
        valor: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
        moneda: ['MXN'],
      }),
      totalIngresosNetosAnuales: this.formBuilder.group({
        valor: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
        moneda: ['MXN'],
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });

    this.actividadAnualAnteriorForm.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((form: ActividadAnualAnterior) => {
        if (form.servidorPublicoAnioAnterior) {
          this.otrosIngresosDeclarante = this.calcOtrosIngresosDeclarante();
          this.ingresoNetoDeclarante =
            (form.remuneracionNetaCargoPublico ? form.remuneracionNetaCargoPublico.valor : 0) +
            this.otrosIngresosDeclarante;
          this.ingresosTotales =
            this.ingresoNetoDeclarante +
            (form.ingresoNetoAnualParejaDependiente ? form.ingresoNetoAnualParejaDependiente.valor : 0);
        }
      });

    this.actividadAnualAnteriorForm
      .get('servidorPublicoAnioAnterior')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        const formFields = [
          'fechaIngreso',
          'fechaConclusion',
          'remuneracionNetaCargoPublico',
          'otrosIngresosTotal',
          'actividadIndustrialComercialEmpresarial',
          'actividadFinanciera',
          'serviciosProfesionales',
          'enajenacionBienes',
          'otrosIngresos',
          'ingresoNetoAnualDeclarante',
          'ingresoNetoAnualParejaDependiente',
          'totalIngresosNetosAnuales',
        ];

        if (value) {
          formFields.forEach((field) => this.actividadAnualAnteriorForm.get(field).enable());
        } else {
          formFields.forEach((field) => this.actividadAnualAnteriorForm.get(field).disable());
        }
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
      case 'enajenacionBienes':
        formArray = this.enajenacionBienes;
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
    data: Array<ActividadIndustrial | ActividadFinanciera | EnajenacionBienes | OtrosIngresos | ServiciosProfesionales>
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
        case 'enajenacionBienes':
          this.addEnajenacionBienes();
          formArray = this.enajenacionBienes;
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

  fillForm(actividadAnualAnterior: ActividadAnualAnterior) {
    this.actividadAnualAnteriorForm.patchValue(actividadAnualAnterior);

    this.secciones.forEach((section) => {
      const data = actividadAnualAnterior[section];
      this.actividadAnualAnteriorForm.get(section).patchValue(data);
      let dataArray = [];
      switch (section) {
        case 'actividadIndustrialComercialEmpresarial':
        case 'actividadFinanciera':
          dataArray = data?.actividades ?? [];
          break;
        case 'enajenacionBienes':
          dataArray = data?.bienes ?? [];
          break;
        case 'otrosIngresos':
          dataArray = data?.ingresos ?? [];
          break;
        case 'serviciosProfesionales':
          dataArray = data?.servicios ?? [];
        default:
          break;
      }
      this.fillFormArray(section, dataArray);
    });

    if (actividadAnualAnterior.aclaracionesObservaciones) {
      this.toggleAclaraciones(true);
    }
  }

  get actividadFinanciera() {
    return this.actividadAnualAnteriorForm.get('actividadFinanciera.actividades') as FormArray;
  }

  get actividadIndustrialComercialEmpresarial() {
    return this.actividadAnualAnteriorForm.get('actividadIndustrialComercialEmpresarial.actividades') as FormArray;
  }

  get enajenacionBienes() {
    return this.actividadAnualAnteriorForm.get('enajenacionBienes.bienes') as FormArray;
  }

  get otrosIngresos() {
    return this.actividadAnualAnteriorForm.get('otrosIngresos.ingresos') as FormArray;
  }

  get serviciosProfesionales() {
    return this.actividadAnualAnteriorForm.get('serviciosProfesionales.servicios') as FormArray;
  }

  async getUserInfo() {
    try {
      const { data, errors } = await this.apollo
        .query<DeclaracionOutput>({
          query: actividadAnualAnteriorQuery,
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
      if (data?.declaracion.actividadAnualAnterior) {
        this.fillForm(data?.declaracion.actividadAnualAnterior);
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

  async saveInfo(form: ActividadAnualAnterior) {
    try {
      this.isLoading = true;

      const declaracion = {
        actividadAnualAnterior: form,
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
    const aclaraciones = this.actividadAnualAnteriorForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
