import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { beneficiosPrivadosQuery, beneficiosPrivadosMutation } from '@api/declaracion';
import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';
import { UntilDestroy, untilDestroyed } from '@core';
import { Beneficio, BeneficiosPrivados, Catalogo, DeclaracionOutput } from '@models/declaracion';
import beneficiario from '@static/catalogos/beneficiariosPrograma.json';
import FormaRecepcion from '@static/catalogos/formaRecepcion.json';
import Monedas from '@static/catalogos/monedas.json';
import Sector from '@static/catalogos/sector.json';
import TipoBeneficio from '@static/catalogos/tipoBeneficio.json';
import tipoOperacion from '@static/catalogos/tipoOperacion.json';
import { tooltipData } from '@static/tooltips/intereses/beneficios';
import { findOption } from '@utils/utils';

@UntilDestroy()
@Component({
  selector: 'app-beneficios-privados',
  templateUrl: './beneficios-privados.component.html',
  styleUrls: ['./beneficios-privados.component.scss'],
})
export class BeneficiosPrivadosComponent implements OnInit {
  aclaraciones = false;
  aclaracionesText: string = null;
  beneficio: Beneficio[] = [];
  beneficiosPrivadosForm: FormGroup;
  editMode = false;
  editIndex: number = null;
  isLoading = false;

  @ViewChild('otroSector') otroSector: ElementRef;
  @ViewChild('otroTipoBeneficio') otroTipoBeneficio: ElementRef;

  beneficiarioCatalogo = beneficiario;
  recepcionCatalogo = FormaRecepcion;
  monedasCatalogo = Monedas;
  sectorCatalogo = Sector;
  tipoBeneficioCatalogo = TipoBeneficio;
  tipoOperacionCatalogo = tipoOperacion;

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
    this.beneficiosPrivadosForm.reset();
    this.setAclaraciones(this.aclaracionesText);
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
        tipoOperacion: [null, [Validators.required]],
        tipoBeneficio: [null, [Validators.required]], //
        beneficiario: [null, [Validators.required]],
        otorgante: this.formBuilder.group({
          tipoPersona: [false, [Validators.required]],
          nombreRazonSocial: [null, [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
          rfc: [
            null,
            [
              Validators.required,
              Validators.pattern(
                /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
              ),
            ],
          ],
        }),
        formaRecepcion: [null, [Validators.required]],
        especifiqueBeneficio: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
        montoMensualAproximado: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
          moneda: [null, [Validators.required]],
        }),
        sector: [null, [Validators.required]],
      }),
      aclaracionesObservaciones: [
        { disabled: true, value: null },
        [Validators.required, Validators.pattern(/^\S.*\S$/)],
      ],
    });

    const formaRecepcion = this.beneficiosPrivadosForm.get('beneficio.formaRecepcion');

    formaRecepcion.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      if (value === 'ESPECIE') {
        this.beneficiosPrivadosForm.get('beneficio.especifiqueBeneficio').enable();
      } else {
        this.beneficiosPrivadosForm.get('beneficio.especifiqueBeneficio').disable();
      }
    });
  }

  editItem(index: number) {
    this.setEditMode();
    this.fillForm(this.beneficio[index]);
    this.editIndex = index;
  }

  fillForm(beneficio: Beneficio) {
    const beneficioForm = this.beneficiosPrivadosForm.get('beneficio');
    beneficioForm.patchValue(beneficio || {});

    if (beneficio.tipoBeneficio?.clave === 'O') {
      this.otroTipoBeneficio.nativeElement.value = beneficio.tipoBeneficio?.valor;
    }

    if (beneficio.sector?.clave === 'OTRO') {
      this.otroSector.nativeElement.value = beneficio.sector?.valor;
    }

    this.setAclaraciones(this.aclaracionesText);
    this.setSelectedOptions();
  }

  get finalBeneficioForm() {
    const form = JSON.parse(JSON.stringify(this.beneficiosPrivadosForm.value.beneficio)); // Deep copy

    if (form.tipoBeneficio?.clave === 'O') {
      form.tipoBeneficio.valor = this.otroTipoBeneficio.nativeElement.value;
    }

    if (form.sector?.clave === 'OTRO') {
      form.sector.valor = this.otroSector.nativeElement.value;
    }

    return form;
  }

  async getUserInfo() {
    try {
      const { data, errors } = await this.apollo
        .query<DeclaracionOutput>({
          query: beneficiosPrivadosQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();

      if (errors) {
        throw errors;
      }

      this.declaracionId = data?.declaracion._id;
      this.setupForm(data?.declaracion.beneficiosPrivados);
    } catch (error) {
      console.log(error);
      this.openSnackBar('[ERROR: No se pudo recuperar la información]', 'Aceptar');
    }
  }

  inputsAreValid(): boolean {
    let result = true;
    const beneficio = this.beneficiosPrivadosForm.value.beneficio;

    if (beneficio.tipoBeneficio?.clave === 'O') {
      result = result && this.otroTipoBeneficio.nativeElement.value?.match(/^\S.*\S$/);
    }

    if (beneficio.sector?.clave === 'OTRO') {
      result = result && this.otroSector.nativeElement.value?.match(/^\S.*\S$/);
    }

    return result;
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

      const { data, errors } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: beneficiosPrivadosMutation,
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
      if (data.declaracion.beneficiosPrivados) {
        this.setupForm(data.declaracion.beneficiosPrivados);
      }
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('[ERROR: No se guardaron los cambios]', 'Aceptar');
    }
  }

  saveItem() {
    let beneficio = [...this.beneficio];
    const aclaracionesObservaciones = this.beneficiosPrivadosForm.value.aclaracionesObservaciones;
    const newItem = this.finalBeneficioForm;

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

  setAclaraciones(aclaraciones?: string) {
    this.beneficiosPrivadosForm.get('aclaracionesObservaciones').patchValue(aclaraciones || null);
    this.aclaracionesText = aclaraciones || null;
    this.toggleAclaraciones(!!aclaraciones);
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
        .setValue(findOption(this.tipoBeneficioCatalogo, tipoBeneficio.clave));
    }

    if (beneficiario) {
      this.beneficiosPrivadosForm
        .get('beneficio.beneficiario')
        .setValue(beneficiario.map((b: Catalogo) => findOption(this.beneficiarioCatalogo, b.clave)));
    }

    if (sector) {
      this.beneficiosPrivadosForm.get('beneficio.sector').setValue(findOption(this.sectorCatalogo, sector.clave));
    }
  }

  setupForm(beneficios: BeneficiosPrivados | undefined) {
    this.beneficio = beneficios?.beneficio || [];
    const aclaraciones = beneficios?.aclaracionesObservaciones;

    if (beneficios?.ninguno) {
      this.beneficiosPrivadosForm.get('ninguno').patchValue(true);
    }

    if (aclaraciones) {
      this.setAclaraciones(aclaraciones);
    }
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
