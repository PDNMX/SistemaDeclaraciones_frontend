import { filter, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import {
  inversionesCuentasValoresMutation,
  inversionesCuentasValoresQuery,
  lastInversionesCuentasValoresQuery,
} from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import TipoInversion from '@static/catalogos/tipoInversion.json';
import SubTipoInversion from '@static/catalogos/subTipoInversion.json';
import FormaAdquisicion from '@static/catalogos/formaAdquisicion.json';
import TitularBien from '@static/catalogos/titularBien.json';
import FormaPago from '@static/catalogos/formaPago.json';
import ParentescoRelacion from '@static/catalogos/parentescoRelacion.json';
import ValorConformeA from '@static/catalogos/valorConformeA.json';
import Extranjero from '@static/catalogos/extranjero.json';
import Paises from '@static/catalogos/paises.json';
import Monedas from '@static/catalogos/monedas.json';

import { tooltipData } from '@static/tooltips/situacion-patrimonial/inversiones';

import {
  Catalogo,
  DeclaracionOutput,
  Inversion,
  InversionesCuentasValores,
  LastDeclaracionOutput,
} from '@models/declaracion';
import { findOption, ifExistsEnableFields } from '@utils/utils';

import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';

@Component({
  selector: 'app-inversiones',
  templateUrl: './inversiones.component.html',
  styleUrls: ['./inversiones.component.scss'],
})
export class InversionesComponent implements OnInit {
  aclaraciones = false;
  aclaracionesText: string = null;
  inversionesCuentasValoresForm: FormGroup;
  editMode = false;
  editIndex: number = null;
  inversion: Inversion[] = [];
  isLoading = false;

  tipoInversionCatalogo = TipoInversion;
  subTipoInversionCatalogo = SubTipoInversion;
  formaAdquisicionCatalogo = FormaAdquisicion;
  titularBienCatalogo = TitularBien;
  formaPagoCatalogo = FormaPago;
  parentescoRelacionCatalogo = ParentescoRelacion;
  valorConformeACatalogo = ValorConformeA;
  extranjeroCatalogo = Extranjero;
  paisesCatalogo = Paises;
  monedasCatalogo = Monedas;

  tipoDeclaracion: string = null;
  tipoDomicilio: string;

  declaracionId: string = null;

  tooltipData = tooltipData;
  errorMatcher = new DeclarationErrorStateMatcher();

  opsBANC = this.subTipoInversionCatalogo
    .filter((e: any) => e.tipoInversion === 'BANC')
    .map((e: any) => ({ clave: e.clave, valor: e.valor }));
  opsFINV = this.subTipoInversionCatalogo
    .filter((e: any) => e.tipoInversion === 'FINV')
    .map((e: any) => ({ clave: e.clave, valor: e.valor }));
  opsORPM = this.subTipoInversionCatalogo
    .filter((e: any) => e.tipoInversion === 'ORPM')
    .map((e: any) => ({ clave: e.clave, valor: e.valor }));
  opsPOMM = this.subTipoInversionCatalogo
    .filter((e: any) => e.tipoInversion === 'POMM')
    .map((e: any) => ({ clave: e.clave, valor: e.valor }));
  opsSEGR = this.subTipoInversionCatalogo
    .filter((e: any) => e.tipoInversion === 'SEGR')
    .map((e: any) => ({ clave: e.clave, valor: e.valor }));
  opsVBUR = this.subTipoInversionCatalogo
    .filter((e: any) => e.tipoInversion === 'VBUR')
    .map((e: any) => ({ clave: e.clave, valor: e.valor }));
  opsAFOT = this.subTipoInversionCatalogo
    .filter((e: any) => e.tipoInversion === 'AFOT')
    .map((e: any) => ({ clave: e.clave, valor: e.valor }));

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
    this.inversionesCuentasValoresForm.reset();
    this.setAclaraciones(this.aclaracionesText);
    this.editMode = true;
    this.editIndex = null;
  }

  localizacionChanged(value: string) {
    const localizacionInversion = this.inversionesCuentasValoresForm.get('inversion').get('localizacionInversion');
    const pais = localizacionInversion.get('pais');
    const rfc = localizacionInversion.get('rfc');
    if (value === 'EX') {
      pais.enable();
      rfc.disable();
      this.tipoDomicilio = 'EXTRANJERO';
    } else {
      pais.disable();
      rfc.enable();
      this.tipoDomicilio = 'MEXICO';
    }
  }
  cancelEditMode() {
    this.editMode = false;
    this.editIndex = null;
  }

  createForm() {
    this.inversionesCuentasValoresForm = this.formBuilder.group({
      ninguno: [false],
      inversion: this.formBuilder.group({
        tipoInversion: [null, [Validators.required]],
        subTipoInversion: [null, [Validators.required]],
        titular: [null, [Validators.required]],
        tercero: this.formBuilder.group({
          tipoPersona: [null],
          nombreRazonSocial: [null, [Validators.pattern(/^\S.*\S?$/)]],
          rfc: [
            null,
            [
              Validators.pattern(
                /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
              ),
            ],
          ],
        }),
        numeroCuentaContrato: [null, [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
        localizacionInversion: this.formBuilder.group({
          pais: [null, [Validators.required]],
          institucionRazonSocial: [null, [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
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
        saldoSituacionActual: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
      }),
      aclaracionesObservaciones: [
        { disabled: true, value: null },
        [Validators.required, Validators.pattern(/^\S.*\S$/)],
      ],
    });
  }

  editItem(index: number) {
    this.setEditMode();
    this.fillForm(this.inversion[index]);
    this.editIndex = index;
  }

  fillForm(inversion: Inversion) {
    Object.keys(inversion)
      .filter((field) => inversion[field] !== null)
      .forEach((field) => this.inversionesCuentasValoresForm.get(`inversion.${field}`).patchValue(inversion[field]));
    this.inversionesCuentasValoresForm.get(`inversion.tercero`).patchValue(inversion.tercero[0]);

    ifExistsEnableFields(
      inversion.localizacionInversion.rfc,
      this.inversionesCuentasValoresForm,
      'inversion.localizacionInversion.rfc'
    );
    if (inversion.localizacionInversion.rfc) {
      this.tipoDomicilio = 'MEXICO';
    }
    ifExistsEnableFields(
      inversion.localizacionInversion.pais,
      this.inversionesCuentasValoresForm,
      'inversion.localizacionInversion.pais'
    );
    if (inversion.localizacionInversion.pais) {
      this.tipoDomicilio = 'EXTRANJERO';
    }

    this.setAclaraciones(this.aclaracionesText);
    this.setSelectedOptions();
  }

  async getLastUserInfo() {
    try {
      const { data, errors } = await this.apollo
        .query<LastDeclaracionOutput>({
          query: lastInversionesCuentasValoresQuery,
        })
        .toPromise();

      if (errors) {
        throw errors;
      }

      this.setupForm(data?.lastDeclaracion.inversionesCuentasValores);
    } catch (error) {
      console.warn('El usuario probablemente no tienen una declaración anterior', error.message);
      // this.openSnackBar('[ERROR: No se pudo recuperar la información]', 'Aceptar');
    }
  }

  async getUserInfo() {
    try {
      const { data } = await this.apollo
        .query<DeclaracionOutput>({
          query: inversionesCuentasValoresQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();

      this.declaracionId = data.declaracion._id;
      if (data.declaracion.inversionesCuentasValores === null) {
        this.getLastUserInfo();
      } else {
        this.setupForm(data.declaracion.inversionesCuentasValores);
      }
    } catch (error) {
      console.error(error);
      this.openSnackBar('[ERROR: No se pudo recuperar la información]', 'Aceptar');
    }
  }

  formHasChanges() {
    let isDirty = this.inversionesCuentasValoresForm.dirty;
    if (isDirty) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: 'Tienes cambios sin guardar',
          message: '¿Deseas continuar?',
          falseText: 'Cancelar',
          trueText: 'Continuar',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) this.router.navigate(['/' + this.tipoDeclaracion + '/situacion-patrimonial/adeudos']);
      });
    } else {
      this.router.navigate(['/' + this.tipoDeclaracion + '/situacion-patrimonial/adeudos']);
    }
  }

  ngOnInit(): void {}

  noInvestments() {
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
        title: 'Operación exitosa',
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
        const inversion = [...this.inversion.slice(0, index), ...this.inversion.slice(index + 1)];
        const aclaracionesObservaciones = this.inversionesCuentasValoresForm.value.aclaracionesObservaciones;
        this.saveInfo({
          inversion,
          aclaracionesObservaciones,
        });
      }
    });
  }

  async saveInfo(form: InversionesCuentasValores) {
    try {
      const declaracion = {
        inversionesCuentasValores: form,
      };

      const { data } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: inversionesCuentasValoresMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();

      this.editMode = false;
      if (data.declaracion.inversionesCuentasValores) {
        this.setupForm(data.declaracion.inversionesCuentasValores);
      }
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  saveItem() {
    let inversion = [...this.inversion];
    const aclaracionesObservaciones = this.inversionesCuentasValoresForm.value.aclaracionesObservaciones;
    const newItem = this.inversionesCuentasValoresForm.value.inversion;

    if (this.editIndex === null) {
      inversion = [...inversion, newItem];
    } else {
      inversion[this.editIndex] = newItem;
    }

    this.isLoading = true;

    this.saveInfo({
      inversion,
      aclaracionesObservaciones,
    });

    this.isLoading = false;
  }

  setAclaraciones(aclaraciones?: string) {
    this.inversionesCuentasValoresForm.get('aclaracionesObservaciones').patchValue(aclaraciones || null);
    this.aclaracionesText = aclaraciones || null;
    this.toggleAclaraciones(!!aclaraciones);
  }

  setEditMode() {
    this.inversionesCuentasValoresForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  setSelectedOptions() {
    const { tipoInversion, subTipoInversion, titular } = this.inversionesCuentasValoresForm.value.inversion;

    if (tipoInversion) {
      const optTipoInversion = this.tipoInversionCatalogo.filter((ti: any) => ti.clave === tipoInversion.clave);
      // this.inversionesCuentasValoresForm.get('inversion.tipoInversion').setValue(findOption(this.tipoInversionCatalogo, tipoInversion));
      this.inversionesCuentasValoresForm.get('inversion.tipoInversion').setValue(optTipoInversion[0]);

      if (subTipoInversion) {
        switch (tipoInversion.clave) {
          case 'BANC':
            const opt = this.opsBANC.filter((ban: any) => ban.clave === subTipoInversion.clave);
            this.inversionesCuentasValoresForm.get('inversion.subTipoInversion').setValue(opt[0]);
            break;
          case 'FINV':
            const optFINV = this.opsFINV.filter((ban: any) => ban.clave === subTipoInversion.clave);
            this.inversionesCuentasValoresForm.get('inversion.subTipoInversion').setValue(optFINV[0]);
            break;

          case 'ORPM':
            const optORPM = this.opsORPM.filter((ban: any) => ban.clave === subTipoInversion.clave);
            this.inversionesCuentasValoresForm.get('inversion.subTipoInversion').setValue(optORPM[0]);
            break;
          case 'POMM':
            const optPOMM = this.opsPOMM.filter((ban: any) => ban.clave === subTipoInversion.clave);
            this.inversionesCuentasValoresForm.get('inversion.subTipoInversion').setValue(optPOMM[0]);
            break;
          case 'SEGR':
            const optSEGR = this.opsSEGR.filter((ban: any) => ban.clave === subTipoInversion.clave);
            this.inversionesCuentasValoresForm.get('inversion.subTipoInversion').setValue(optSEGR[0]);
            break;
          case 'VBUR':
            const optVBUR = this.opsVBUR.filter((ban: any) => ban.clave === subTipoInversion.clave);
            this.inversionesCuentasValoresForm.get('inversion.subTipoInversion').setValue(optVBUR[0]);
            break;
          case 'AFOT':
            const optAFOT = this.opsAFOT.filter((ban: any) => ban.clave === subTipoInversion.clave);
            this.inversionesCuentasValoresForm.get('inversion.subTipoInversion').setValue(optAFOT[0]);
            break;
          default:
            console.log('ESTO NO DEBERIA SALIR');
            break;
        }
      }
    }

    if (titular) {
      const optTitular = this.titularBienCatalogo.filter((ti: any) => ti.clave === titular[0].clave);
      // this.inversionesCuentasValoresForm.get('inversion.titular').setValue(findOption(this.titularBienCatalogo, titular[0]));
      this.inversionesCuentasValoresForm.get('inversion.titular').setValue(optTitular[0]);
    }
  }

  setupForm(inversionesCuentasValores: InversionesCuentasValores) {
    this.inversion = inversionesCuentasValores.inversion;
    const aclaraciones = inversionesCuentasValores.aclaracionesObservaciones;

    if (inversionesCuentasValores.ninguno) {
      this.inversionesCuentasValoresForm.get('ninguno').patchValue(true);
    }

    if (aclaraciones) {
      this.setAclaraciones(aclaraciones);
    }

    //this.editMode = !!!this.inversion.length;
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.inversionesCuentasValoresForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
