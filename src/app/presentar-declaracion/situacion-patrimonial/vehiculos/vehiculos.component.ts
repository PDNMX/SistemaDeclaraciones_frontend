import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { lastVehiculosQuery, vehiculosMutation, vehiculosQuery } from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import TipoVehiculo from '@static/catalogos/tipoVehiculo.json';
import FormaAdquisicion from '@static/catalogos/formaAdquisicion.json';
import TitularBien from '@static/catalogos/titularBien.json';
import FormaPago from '@static/catalogos/formaPago.json';
import ParentescoRelacion from '@static/catalogos/parentescoRelacion.json';
import Extranjero from '@static/catalogos/extranjero.json';
import Estados from '@static/catalogos/estados.json';
import Municipios from '@static/catalogos/municipios.json';
import Paises from '@static/catalogos/paises.json';
import Monedas from '@static/catalogos/monedas.json';

import { tooltipData } from '@static/tooltips/situacion-patrimonial/vehiculos';

import { DeclaracionOutput, LastDeclaracionOutput, Vehiculo, Vehiculos } from '@models/declaracion';

import { findOption, ifExistsEnableFields } from '@utils/utils';

import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss'],
})
export class VehiculosComponent {
  aclaraciones = false;
  aclaracionesText: string = null;
  vehiculosForm: FormGroup;
  editMode = false;
  editIndex: number = null;
  vehiculo: Vehiculo[] = [];
  isLoading = false;
  currentYear = new Date().getFullYear();

  tipoVehiculoCatalogo = TipoVehiculo;
  formaAdquisicionCatalogo = FormaAdquisicion;
  titularBienCatalogo = TitularBien;
  formaPagoCatalogo = FormaPago;
  parentescoRelacionCatalogo = ParentescoRelacion;
  estadosCatalogo = Estados;
  municipiosCatalogo = Municipios;
  paisesCatalogo = Paises;
  extranjeroCatalogo = Extranjero;
  monedasCatalogo = Monedas;

  tipoDeclaracion: string = null;
  tipoDomicilio: string = 'MEXICO'; // 'MEXICO' estado predeterminado

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
    this.vehiculosForm.reset();
    this.locationChanged('MX'); // Asegura restablecer el estado predeterminado
    this.setAclaraciones(this.aclaracionesText);
    this.editMode = true;
    this.editIndex = null;
  }

  locationChanged(value: string) {
    const localizacion = this.vehiculosForm.get('vehiculo').get('lugarRegistro');
    const pais = localizacion.get('pais');
    const entidadFederativa = localizacion.get('entidadFederativa');
    if (value === 'EX') {
      this.tipoDomicilio = 'EXTRANJERO';
      pais.enable();
      entidadFederativa.disable();
      entidadFederativa.reset();
    } else {
      this.tipoDomicilio = 'MEXICO';
      pais.disable();
      entidadFederativa.enable();
      pais.reset();
    }
  }

  cancelEditMode() {
    this.editMode = false;
    this.editIndex = null;
  }

  createForm() {
    this.vehiculosForm = this.formBuilder.group({
      ninguno: [false],
      vehiculo: this.formBuilder.group({
        tipoVehiculo: [null, [Validators.required]],
        titular: [null, [Validators.required]],
        transmisor: this.formBuilder.group({
          tipoPersona: [null, [Validators.required]],
          nombreRazonSocial: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
          rfc: [
            null,
            [
              Validators.required,
              Validators.pattern(
                /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
              ),
            ],
          ],
          relacion: [null, [Validators.required]],
        }),
        marca: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        modelo: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        anio: [null, [Validators.required, Validators.pattern(/^\d{4}$/)]],
        numeroSerieRegistro: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        tercero: this.formBuilder.group({
          tipoPersona: [null],
          nombreRazonSocial: [null, [Validators.pattern(/^\S.*\S$/)]],
          rfc: [
            null,
            [
              Validators.pattern(
                /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
              ),
            ],
          ],
        }),
        lugarRegistro: this.formBuilder.group({
          // Establezca el campo 'pais' para que esté deshabilitado de forma predeterminada.
          pais: [{ value: null, disabled: true }, [Validators.required]],
          entidadFederativa: [null, [Validators.required]],
        }),
        formaAdquisicion: [null, [Validators.required]],
        formaPago: [null, [Validators.required]],
        valorAdquisicion: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/), Validators.min(0)]],
          moneda: ['MXN', [Validators.required]],
        }),
        fechaAdquisicion: [null, [Validators.required]],
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });

    // Inicia con la opción de México seleccionada por defecto
    this.vehiculosForm.get('vehiculo.lugarRegistro.pais').disable();
    this.vehiculosForm.get('vehiculo.lugarRegistro.entidadFederativa').enable();
    this.tipoDomicilio = 'MEXICO';
  }

  editItem(index: number) {
    this.setEditMode();
    this.fillForm(this.vehiculo[index]);
    this.editIndex = index;
  }

  fillForm(vehiculo: Vehiculo) {
    Object.keys(vehiculo)
      .filter((field) => vehiculo[field] !== null)
      .forEach((field) => this.vehiculosForm.get(`vehiculo.${field}`).patchValue(vehiculo[field]));
    this.vehiculosForm.get(`vehiculo.tercero`).patchValue(vehiculo.tercero[0]);
    this.vehiculosForm.get(`vehiculo.transmisor`).patchValue(vehiculo.transmisor[0]);

    ifExistsEnableFields(
      vehiculo.lugarRegistro.entidadFederativa,
      this.vehiculosForm,
      'vehiculo.lugarRegistro.entidadFederativa'
    );
    if (vehiculo.lugarRegistro.entidadFederativa) {
      this.tipoDomicilio = 'MEXICO';
    }
    ifExistsEnableFields(vehiculo.lugarRegistro.pais, this.vehiculosForm, 'vehiculo.lugarRegistro.pais');
    if (vehiculo.lugarRegistro.pais) {
      this.tipoDomicilio = 'EXTRANJERO';
    }

    this.setAclaraciones(this.aclaracionesText);
    this.setSelectedOptions();
  }

  async getLastUserInfo() {
    try {
      const { data, errors } = await this.apollo
        .query<LastDeclaracionOutput>({
          query: lastVehiculosQuery,
        })
        .toPromise();

      if (errors) {
        throw errors;
      }

      const lastVehiculosData = data?.lastDeclaracion?.vehiculos;
      if (lastVehiculosData && !lastVehiculosData.ninguno) {
        this.setupForm(lastVehiculosData);
      }
    } catch (error) {
      console.warn('El usuario probablemente no tienen una declaración anterior', error.message);
      // this.openSnackBar('[ERROR: No se pudo recuperar la información]', 'Aceptar');
    }
  }

  async getUserInfo() {
    try {
      const { data } = await this.apollo
        .query<DeclaracionOutput>({
          query: vehiculosQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();
      this.declaracionId = data.declaracion._id;

      if (data.declaracion.vehiculos === null) {
        this.getLastUserInfo();
      } else {
        this.setupForm(data.declaracion.vehiculos);
      }
    } catch (error) {
      console.error(error);
      this.openSnackBar('[ERROR: No se pudo recuperar la información]', 'Aceptar');
    }
  }

  formHasChanges() {
    let isDirty = this.vehiculosForm.dirty;
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
        if (result) this.router.navigate(['/' + this.tipoDeclaracion + '/situacion-patrimonial/bienes-muebles']);
      });
    } else {
      this.router.navigate(['/' + this.tipoDeclaracion + '/situacion-patrimonial/bienes-muebles']);
    }
  }

  noVehicle() {
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
        const vehiculo = [...this.vehiculo.slice(0, index), ...this.vehiculo.slice(index + 1)];
        const aclaracionesObservaciones = this.vehiculosForm.value.aclaracionesObservaciones;
        this.saveInfo({
          vehiculo,
          aclaracionesObservaciones,
        });
      }
    });
  }

  async saveInfo(form: Vehiculos) {
    try {
      const declaracion = {
        vehiculos: form,
      };

      const { data } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: vehiculosMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();
      this.editMode = false;
      if (data.declaracion.vehiculos) {
        this.setupForm(data.declaracion.vehiculos);
      }
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  saveItem() {
    let vehiculo = [...this.vehiculo];
    const aclaracionesObservaciones = this.vehiculosForm.value.aclaracionesObservaciones;
    const newItem = this.vehiculosForm.value.vehiculo;

    if (this.editIndex === null) {
      vehiculo = [...vehiculo, newItem];
    } else {
      vehiculo[this.editIndex] = newItem;
    }

    this.isLoading = true;

    this.saveInfo({
      vehiculo,
      aclaracionesObservaciones,
    });

    this.isLoading = false;
  }

  setAclaraciones(aclaraciones?: string) {
    this.vehiculosForm.get('aclaracionesObservaciones').patchValue(aclaraciones || null);
    this.aclaracionesText = aclaraciones || null;
    this.toggleAclaraciones(!!aclaraciones);
  }

  setEditMode() {
    this.vehiculosForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  setSelectedOptions() {
    const { tipoVehiculo, titular, formaAdquisicion, lugarRegistro } = this.vehiculosForm.value.vehiculo;

    const { relacion } = this.vehiculosForm.value.vehiculo.transmisor;

    if (tipoVehiculo) {
      const optTipoVehiculo = this.tipoVehiculoCatalogo.filter((veh: any) => veh.clave === tipoVehiculo.clave);
      // this.vehiculosForm.get('vehiculo.tipoVehiculo').setValue(findOption(this.tipoVehiculoCatalogo, tipoVehiculo));
      this.vehiculosForm.get('vehiculo.tipoVehiculo').setValue(optTipoVehiculo[0]);
    }

    if (titular) {
      const optTitular = this.titularBienCatalogo.filter((ti: any) => ti.clave === titular[0].clave);
      // this.vehiculosForm.get('vehiculo.titular').setValue(findOption(this.titularBienCatalogo, titular[0]));
      this.vehiculosForm.get('vehiculo.titular').setValue(optTitular[0]);
    }

    if (relacion) {
      const optRelacion = this.parentescoRelacionCatalogo.filter((re: any) => re.clave === relacion.clave);
      // this.vehiculosForm.get('vehiculo.transmisor.relacion').setValue(findOption(this.parentescoRelacionCatalogo, relacion));
      this.vehiculosForm.get('vehiculo.transmisor.relacion').setValue(optRelacion[0]);
    }

    if (formaAdquisicion) {
      const optAdquisicion = this.formaAdquisicionCatalogo.filter((ad: any) => ad.clave === formaAdquisicion.clave);
      // this.vehiculosForm.get('vehiculo.formaAdquisicion').setValue(findOption(this.formaAdquisicionCatalogo, formaAdquisicion));
      this.vehiculosForm.get('vehiculo.formaAdquisicion').setValue(optAdquisicion[0]);
    }

    if (lugarRegistro?.entidadFederativa) {
      const { entidadFederativa } = lugarRegistro;
      const optEntidad = this.estadosCatalogo.filter((e: any) => e.clave === entidadFederativa.clave);
      this.vehiculosForm.get('vehiculo.lugarRegistro.entidadFederativa').setValue(optEntidad[0]);
    }
  }

  setupForm(vehiculos: Vehiculos) {
    this.vehiculo = vehiculos.vehiculo;
    const aclaraciones = vehiculos.aclaracionesObservaciones;

    if (vehiculos.ninguno) {
      this.vehiculosForm.get('ninguno').patchValue(true);
    } else {
      this.vehiculosForm.get('ninguno').patchValue(false);
    }

    if (aclaraciones) {
      this.setAclaraciones(aclaraciones);
    }

    //this.editMode = !!!this.vehiculo.length;
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.vehiculosForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
