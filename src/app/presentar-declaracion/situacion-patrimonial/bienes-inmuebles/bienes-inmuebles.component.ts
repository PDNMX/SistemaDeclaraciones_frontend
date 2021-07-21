import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { bienesInmueblesMutation, bienesInmueblesQuery } from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UntilDestroy, untilDestroyed } from '@core';

import TipoInmueble from '@static/catalogos/tipoInmueble.json';
import FormaAdquisicion from '@static/catalogos/formaAdquisicion.json';
import TitularBien from '@static/catalogos/titularBien.json';
import FormaPago from '@static/catalogos/formaPago.json';
import ParentescoRelacion from '@static/catalogos/parentescoRelacion.json';
import ValorConformeA from '@static/catalogos/valorConformeA.json';
import Estados from '@static/catalogos/estados.json';
import Municipios from '@static/catalogos/municipios.json';
import Paises from '@static/catalogos/paises.json';
import Monedas from '@static/catalogos/monedas.json';

import { tooltipData } from '@static/tooltips/situacion-patrimonial/bien-inmueble';

import { BienInmueble, BienesInmuebles, Catalogo, DeclaracionOutput } from '@models/declaracion';

import { findOption, ifExistsEnableFields } from '@utils/utils';

import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';

@UntilDestroy()
@Component({
  selector: 'app-bienes-inmuebles',
  templateUrl: './bienes-inmuebles.component.html',
  styleUrls: ['./bienes-inmuebles.component.scss'],
})
export class BienesInmueblesComponent implements OnInit {
  aclaraciones = false;
  bienesInmueblesForm: FormGroup;
  estado: Catalogo = null;
  editMode = false;
  editIndex: number = null;
  bienInmueble: BienInmueble[] = [];
  isLoading = false;

  tipoInmuebleCatalogo = TipoInmueble;
  formaAdquisicionCatalogo = FormaAdquisicion;
  titularBienCatalogo = TitularBien;
  formaPagoCatalogo = FormaPago;
  parentescoRelacionCatalogo = ParentescoRelacion;
  valorConformeACatalogo = ValorConformeA;
  estadosCatalogo = Estados;
  municipiosCatalogo = Municipios;
  paisesCatalogo = Paises;
  monedasCatalogo = Monedas;

  tipoDeclaracion: string = null;
  tipoDomicilio = 'MEXICO';

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
    this.bienesInmueblesForm.reset();
    this.bienesInmueblesForm.get('ninguno').setValue(false);
    this.editMode = true;
    this.editIndex = null;
  }

  cancelEditMode() {
    this.editMode = false;
    this.editIndex = null;
  }

  createForm() {
    this.bienesInmueblesForm = this.formBuilder.group({
      ninguno: [false],
      bienInmueble: this.formBuilder.group({
        tipoInmueble: [null, [Validators.required]],
        titular: [[], [Validators.required]],
        porcentajePropiedad: [
          0,
          [Validators.required, Validators.pattern(/^\d+\.?\d{0,4}$/), Validators.min(0), Validators.max(100)],
        ],
        superficieTerreno: this.formBuilder.group({
          valor: [0, [Validators.pattern(/^\d+\.?\d{0,2}$/), Validators.min(0)]],
          unidad: ['m'],
        }),
        superficieConstruccion: this.formBuilder.group({
          valor: [0, [Validators.pattern(/^\d+\.?\d{0,2}$/), Validators.min(0)]],
          unidad: ['m'],
        }),
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
        transmisor: this.formBuilder.group({
          tipoPersona: [null, [Validators.required]],
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
          relacion: [null, [Validators.required]],
        }),
        formaAdquisicion: [null, [Validators.required]],
        formaPago: [null, [Validators.required]],
        valorAdquisicion: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/), Validators.min(0)]],
          moneda: ['MXN', [Validators.required]],
        }),
        fechaAdquisicion: [null, [Validators.required]],
        datoIdentificacion: [null, [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
        valorConformeA: [null, [Validators.required]],
        domicilioMexico: this.formBuilder.group({
          calle: [null, [Validators.required, Validators.pattern(/^\S.*$/)]],
          numeroExterior: [null, [Validators.required, Validators.pattern(/^\S.*$/)]],
          numeroInterior: [null, [Validators.pattern(/^\S.*$/)]],
          coloniaLocalidad: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
          municipioAlcaldia: [{ disabled: true, value: null }, [Validators.required]],
          entidadFederativa: [null, [Validators.required]],
          codigoPostal: [null, [Validators.required, Validators.pattern(/^\d{5}$/i)]],
        }),
        domicilioExtranjero: this.formBuilder.group({
          calle: [null, [Validators.required, Validators.pattern(/^\S.*$/)]],
          numeroExterior: [null, [Validators.required, Validators.pattern(/^\S.*$/)]],
          numeroInterior: [null, [Validators.pattern(/^\S.*$/)]],
          ciudadLocalidad: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
          estadoProvincia: [null, [Validators.required]],
          pais: [null, [Validators.required]],
          codigoPostal: [null, [Validators.required, Validators.pattern(/^\d{5}$/i)]],
        }),
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });

    this.bienesInmueblesForm.get('bienInmueble').get('domicilioExtranjero').disable();

    const domicilioMexico = this.bienesInmueblesForm.get('bienInmueble').get('domicilioMexico');
    const estado = domicilioMexico.get('entidadFederativa');
    estado.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      const municipio = domicilioMexico.get('municipioAlcaldia');

      if (value) {
        municipio.enable();
      } else {
        municipio.disable();
        municipio.reset();
      }
      this.estado = value;
    });
  }

  editItem(index: number) {
    this.setEditMode();
    this.fillForm(this.bienInmueble[index]);
    this.editIndex = index;
  }

  fillForm(bienInmueble: BienInmueble) {
    Object.keys(bienInmueble)
      .filter((field) => bienInmueble[field] !== null)
      .forEach((field) => this.bienesInmueblesForm.get(`bienInmueble.${field}`).patchValue(bienInmueble[field]));
    this.bienesInmueblesForm.get(`bienInmueble.tercero`).patchValue(bienInmueble.tercero[0]);
    this.bienesInmueblesForm.get(`bienInmueble.transmisor`).patchValue(bienInmueble.transmisor[0]);

    ifExistsEnableFields(bienInmueble.domicilioMexico, this.bienesInmueblesForm, 'bienInmueble.domicilioMexico');
    if (bienInmueble.domicilioMexico) {
      this.tipoDomicilio = 'MEXICO';
    }
    ifExistsEnableFields(
      bienInmueble.domicilioExtranjero,
      this.bienesInmueblesForm,
      'bienInmueble.domicilioExtranjero'
    );
    if (bienInmueble.domicilioExtranjero) {
      this.tipoDomicilio = 'EXTRANJERO';
    }

    this.setSelectedOptions();
  }

  async getUserInfo() {
    try {
      const { data } = await this.apollo
        .query<DeclaracionOutput>({
          query: bienesInmueblesQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();

      this.declaracionId = data.declaracion._id;
      if (data.declaracion.bienesInmuebles) {
        this.setupForm(data.declaracion.bienesInmuebles);
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {}

  noProperty() {
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
        const bienInmueble = [...this.bienInmueble.slice(0, index), ...this.bienInmueble.slice(index + 1)];
        const aclaracionesObservaciones = this.bienesInmueblesForm.value.aclaracionesObservaciones;
        this.saveInfo({
          bienInmueble,
          aclaracionesObservaciones,
        });
      }
    });
  }

  async saveInfo(form: BienesInmuebles) {
    try {
      const declaracion = {
        bienesInmuebles: form,
      };

      const { data } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: bienesInmueblesMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();

      this.editMode = false;
      if (data.declaracion.bienesInmuebles) {
        this.setupForm(data.declaracion.bienesInmuebles);
      }
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  tipoDomicilioChanged(value: any) {
    this.tipoDomicilio = value;

    const notSelectedType = this.tipoDomicilio === 'MEXICO' ? 'domicilioExtranjero' : 'domicilioMexico';
    const selectedType = this.tipoDomicilio === 'EXTRANJERO' ? 'domicilioExtranjero' : 'domicilioMexico';
    const bienInbueble = this.bienesInmueblesForm.get('bienInmueble');

    const notSelected = bienInbueble.get(notSelectedType);

    notSelected.disable();
    notSelected.reset();

    bienInbueble.get(selectedType).enable();
  }

  saveItem() {
    let bienInmueble = [...this.bienInmueble];
    const aclaracionesObservaciones = this.bienesInmueblesForm.value.aclaracionesObservaciones;
    const newItem = this.bienesInmueblesForm.value.bienInmueble;

    if (this.editIndex === null) {
      bienInmueble = [...bienInmueble, newItem];
    } else {
      bienInmueble[this.editIndex] = newItem;
    }

    this.isLoading = true;

    this.saveInfo({
      bienInmueble,
      aclaracionesObservaciones,
    });

    this.isLoading = false;
  }

  setEditMode() {
    this.bienesInmueblesForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  setSelectedOptions() {
    const { tipoInmueble, titular, formaAdquisicion } = this.bienesInmueblesForm.value.bienInmueble;

    const { relacion } = this.bienesInmueblesForm.value.bienInmueble.transmisor;

    if (tipoInmueble) {
      this.bienesInmueblesForm
        .get('bienInmueble.tipoInmueble')
        .setValue(findOption(this.tipoInmuebleCatalogo, tipoInmueble));
    }
    if (titular) {
      this.bienesInmueblesForm.get('bienInmueble.titular').setValue(findOption(this.titularBienCatalogo, titular[0]));
    }
    if (formaAdquisicion) {
      this.bienesInmueblesForm
        .get('bienInmueble.formaAdquisicion')
        .setValue(findOption(this.formaAdquisicionCatalogo, formaAdquisicion));
    }

    if (relacion) {
      this.bienesInmueblesForm
        .get('bienInmueble.transmisor.relacion')
        .setValue(findOption(this.parentescoRelacionCatalogo, relacion));
    }
  }

  setupForm(bienesInmuebles: BienesInmuebles) {
    this.bienInmueble = bienesInmuebles.bienInmueble;
    const aclaraciones = bienesInmuebles.aclaracionesObservaciones;

    if (bienesInmuebles.ninguno) {
      this.bienesInmueblesForm.get('ninguno').patchValue(true);
    }

    if (aclaraciones) {
      this.bienesInmueblesForm.get('aclaracionesObservaciones').setValue(aclaraciones);
      this.toggleAclaraciones(true);
    }
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.bienesInmueblesForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
