import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { prestamoComodatoMutation, prestamoComodatoQuery } from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UntilDestroy, untilDestroyed } from '@core';

import TipoInmueble from '@static/catalogos/tipoInmueble.json';
import TipoVehiculo from '@static/catalogos/tipoVehiculo.json';
import Extranjero from '@static/catalogos/extranjero.json';
import Paises from '@static/catalogos/paises.json';
import Estados from '@static/catalogos/estados.json';
import Municipios from '@static/catalogos/municipios.json';
import ParentescoRelacion from '@static/catalogos/parentescoRelacion.json';

import { tooltipData } from '@static/tooltips/situacion-patrimonial/prestamo-terceros';

import { Catalogo, DeclaracionOutput, Prestamo, PrestamoComodato } from '@models/declaracion';

import { findOption, ifExistsEnableFields } from '@utils/utils';

import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';

@UntilDestroy()
@Component({
  selector: 'app-prestamos-terceros',
  templateUrl: './prestamos-terceros.component.html',
  styleUrls: ['./prestamos-terceros.component.scss'],
})
export class PrestamosTercerosComponent implements OnInit {
  aclaraciones = false;
  prestamoComodatoForm: FormGroup;
  estado: Catalogo;
  editMode = false;
  editIndex: number = null;
  prestamo: Prestamo[] = [];
  isLoading = false;
  currentYear = new Date().getFullYear();

  tipoInmuebleCatalogo = TipoInmueble;
  tipoVehiculoCatalogo = TipoVehiculo;
  extranjeroCatalogo = Extranjero;
  paisesCatalogo = Paises;
  estadosCatalogo = Estados;
  municipiosCatalogo = Municipios;
  parentescoRelacionCatalogo = ParentescoRelacion;

  tipoDeclaracion: string = null;
  tipoBien: string;
  tipoDomicilio: string;

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
    this.prestamoComodatoForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  bienChanged(value: string) {
    const tipoBien = this.prestamoComodatoForm.get('prestamo').get('tipoBien');
    const inmueble = tipoBien.get('inmueble');
    const vehiculo = tipoBien.get('vehiculo');
    if (value === 'inmueble') {
      inmueble.enable();
      vehiculo.disable();
      this.tipoBien = 'inmueble';
    } else {
      inmueble.disable();
      vehiculo.enable();
      this.tipoBien = 'vehiculos';
    }
  }

  tipoDomicilioChanged(value: string) {
    const localizacion = this.prestamoComodatoForm.get('prestamo').get('tipoBien').get('inmueble');
    const mexico = localizacion.get('domicilioMexico');
    const extranjero = localizacion.get('domicilioExtranjero');
    if (value === 'EX') {
      extranjero.enable();
      this.tipoDomicilio = 'EXTRANJERO';
      mexico.disable();
    } else {
      extranjero.disable();
      mexico.enable();
      this.tipoDomicilio = 'MEXICO';
      const estado = this.prestamoComodatoForm
        .get('prestamo.tipoBien.inmueble.domicilioMexico')
        .get('entidadFederativa');
      estado.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
        const municipio = this.prestamoComodatoForm
          .get('prestamo.tipoBien.inmueble.domicilioMexico')
          .get('municipioAlcaldia');

        if (value) {
          municipio.enable();
        } else {
          municipio.disable();
          municipio.reset();
        }
        this.estado = value;
      });
    }
  }

  localizacionVehiculoChanged(value: string) {
    const localizacion = this.prestamoComodatoForm.get('prestamo').get('tipoBien').get('vehiculo').get('lugarRegistro');
    const pais = localizacion.get('pais');
    const entidadFederativa = localizacion.get('entidadFederativa');
    if (value === 'MX') {
      entidadFederativa.enable();
      pais.disable();
      this.tipoDomicilio = 'MEXICO';
    } else {
      entidadFederativa.disable();
      pais.enable();
      this.tipoDomicilio = 'EXTRANJERO';
    }
  }

  cancelEditMode() {
    this.editMode = false;
    this.editIndex = null;
  }

  createForm() {
    this.prestamoComodatoForm = this.formBuilder.group({
      ninguno: [false],
      prestamo: this.formBuilder.group({
        tipoBien: this.formBuilder.group({
          inmueble: this.formBuilder.group({
            tipoInmueble: ['', Validators.required],
            domicilioMexico: this.formBuilder.group({
              calle: ['', [Validators.required, Validators.pattern(/^\S.*$/)]],
              numeroExterior: ['', [Validators.required, Validators.pattern(/^\S.*$/)]],
              numeroInterior: ['', [Validators.pattern(/^\S.*$/)]],
              coloniaLocalidad: ['', [Validators.required, Validators.pattern(/^\S.*$/)]],
              municipioAlcaldia: [{ disabled: true, value: '' }, Validators.required],
              entidadFederativa: ['', Validators.required],
              codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/i)]],
            }),
            domicilioExtranjero: this.formBuilder.group({
              calle: ['', [Validators.required, Validators.pattern(/^\S.*$/)]],
              numeroExterior: ['', [Validators.required, Validators.pattern(/^\S.*$/)]],
              numeroInterior: ['', [Validators.pattern(/^\S.*$/)]],
              ciudadLocalidad: ['', [Validators.required, Validators.pattern(/^\S.*$/)]],
              estadoProvincia: ['', Validators.required],
              pais: ['', Validators.required],
              codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/i)]],
            }),
          }),
          vehiculo: this.formBuilder.group({
            tipo: ['', Validators.required],
            marca: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
            modelo: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
            anio: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
            numeroSerieRegistro: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
            lugarRegistro: this.formBuilder.group({
              pais: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
              entidadFederativa: ['', Validators.required],
            }),
          }),
        }),
        duenoTitular: this.formBuilder.group({
          tipoDuenoTitular: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
          nombreTitular: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
          rfc: [
            '',
            [
              Validators.required,
              Validators.pattern(
                /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
              ),
            ],
          ],
          relacionConTitular: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        }),
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });
  }

  editItem(index: number) {
    this.setEditMode();
    this.fillForm(this.prestamo[index]);
    this.editIndex = index;
  }

  fillForm(prestamo: Prestamo) {
    Object.keys(prestamo.duenoTitular)
      .filter((field) => prestamo.duenoTitular[field] !== null)
      .forEach((field) =>
        this.prestamoComodatoForm.get(`prestamo.duenoTitular.${field}`).patchValue(prestamo.duenoTitular[field])
      );

    ifExistsEnableFields(prestamo.tipoBien.inmueble, this.prestamoComodatoForm, 'prestamo.tipoBien.inmueble');
    if (prestamo.tipoBien.inmueble) {
      this.tipoBien = 'inmueble';

      Object.keys(prestamo.tipoBien.inmueble)
        .filter((field) => prestamo.tipoBien.inmueble[field] !== null)
        .forEach((field) =>
          this.prestamoComodatoForm
            .get(`prestamo.tipoBien.inmueble.${field}`)
            .patchValue(prestamo.tipoBien.inmueble[field])
        );

      ifExistsEnableFields(
        prestamo.tipoBien.inmueble.domicilioMexico,
        this.prestamoComodatoForm,
        'prestamo.tipoBien.inmueble.domicilioMexico'
      );
      if (prestamo.tipoBien.inmueble.domicilioMexico) {
        this.tipoDomicilio = 'MEXICO';
      }

      ifExistsEnableFields(
        prestamo.tipoBien.inmueble.domicilioExtranjero,
        this.prestamoComodatoForm,
        'prestamo.tipoBien.inmueble.domicilioExtranjero'
      );
      if (prestamo.tipoBien.inmueble.domicilioExtranjero) {
        this.tipoDomicilio = 'EXTRANJERO';
      }
    }
    ifExistsEnableFields(prestamo.tipoBien.vehiculo, this.prestamoComodatoForm, 'prestamo.tipoBien.vehiculo');
    if (prestamo.tipoBien.vehiculo) {
      this.tipoBien = 'vehiculos';
      Object.keys(prestamo.tipoBien.vehiculo)
        .filter((field) => prestamo.tipoBien.vehiculo[field] !== null)
        .forEach((field) =>
          this.prestamoComodatoForm
            .get(`prestamo.tipoBien.vehiculo.${field}`)
            .patchValue(prestamo.tipoBien.vehiculo[field])
        );

      ifExistsEnableFields(
        prestamo.tipoBien.vehiculo.lugarRegistro.entidadFederativa,
        this.prestamoComodatoForm,
        'prestamo.tipoBien.vehiculo.lugarRegistro.entidadFederativa'
      );
      if (prestamo.tipoBien.vehiculo.lugarRegistro.entidadFederativa) {
        this.tipoDomicilio = 'MEXICO';
      }

      ifExistsEnableFields(
        prestamo.tipoBien.vehiculo.lugarRegistro.pais,
        this.prestamoComodatoForm,
        'prestamo.tipoBien.vehiculo.lugarRegistro.pais'
      );
      if (prestamo.tipoBien.vehiculo.lugarRegistro.pais) {
        this.tipoDomicilio = 'EXTRANJERO';
      }
    }

    this.setSelectedOptions();
  }

  async getUserInfo() {
    try {
      const { data } = await this.apollo
        .query<DeclaracionOutput>({
          query: prestamoComodatoQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();

      this.declaracionId = data.declaracion._id;
      if (data.declaracion.prestamoComodato) {
        this.setupForm(data.declaracion.prestamoComodato);
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {}

  noLoans() {
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
        const prestamo = [...this.prestamo.slice(0, index), ...this.prestamo.slice(index + 1)];
        const aclaracionesObservaciones = this.prestamoComodatoForm.value.aclaracionesObservaciones;
        this.saveInfo({
          prestamo,
          aclaracionesObservaciones,
        });
      }
    });
  }

  async saveInfo(form: PrestamoComodato) {
    try {
      const declaracion = {
        prestamoComodato: form,
      };

      const { data } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: prestamoComodatoMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();
      this.editMode = false;
      if (data.declaracion.prestamoComodato) {
        this.setupForm(data.declaracion.prestamoComodato);
      }
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  saveItem() {
    let prestamo = [...this.prestamo];
    const aclaracionesObservaciones = this.prestamoComodatoForm.value.aclaracionesObservaciones;
    const newItem = this.prestamoComodatoForm.value.prestamo;

    if (this.editIndex === null) {
      prestamo = [...prestamo, newItem];
    } else {
      prestamo[this.editIndex] = newItem;
    }

    this.isLoading = true;

    this.saveInfo({
      prestamo,
      aclaracionesObservaciones,
    });

    this.isLoading = false;
  }

  setEditMode() {
    this.prestamoComodatoForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  setSelectedOptions() {
    const { vehiculo, inmueble } = this.prestamoComodatoForm.value.prestamo.tipoBien;

    if (inmueble) {
      const { tipoInmueble } = this.prestamoComodatoForm.value.prestamo.tipoBien.inmueble;

      this.prestamoComodatoForm
        .get('prestamo.tipoBien.inmueble.tipoInmueble')
        .setValue(findOption(this.tipoInmuebleCatalogo, tipoInmueble));
    }

    if (vehiculo) {
      const { tipo } = this.prestamoComodatoForm.value.prestamo.tipoBien.vehiculo;

      this.prestamoComodatoForm
        .get('prestamo.tipoBien.vehiculo.tipo')
        .setValue(findOption(this.tipoVehiculoCatalogo, tipo));
    }
  }

  setupForm(prestamoComodato: PrestamoComodato) {
    this.prestamo = prestamoComodato.prestamo;
    const aclaraciones = prestamoComodato.aclaracionesObservaciones;

    if (prestamoComodato.ninguno) {
      this.prestamoComodatoForm.get('ninguno').patchValue(true);
    }

    if (aclaraciones) {
      this.prestamoComodatoForm.get('aclaracionesObservaciones').setValue(aclaraciones);
      this.toggleAclaraciones(true);
    }

    //this.editMode = !!!this.prestamo.length;
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.prestamoComodatoForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
