import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { representacionesMutation, representacionesQuery } from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UntilDestroy, untilDestroyed } from '@core';

import Paises from '@static/catalogos/paises.json';
import Estados from '@static/catalogos/estados.json';
import TipoRelacion from '@static/catalogos/tipoRelacion.json';
import TipoRepresentacion from '@static/catalogos/tipoRepresentacion.json';
import Extranjero from '@static/catalogos/extranjero.json';
import Sector from '@static/catalogos/sector.json';

import { tooltipData } from '@static/tooltips/intereses/representacion';

import { DeclaracionOutput, Representacion, Representaciones } from '@models/declaracion';

import { findOption, ifExistsEnableFields } from '@utils/utils';

import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';

@UntilDestroy()
@Component({
  selector: 'app-representacion',
  templateUrl: './representacion.component.html',
  styleUrls: ['./representacion.component.scss'],
})
export class RepresentacionComponent implements OnInit {
  aclaraciones = false;
  representacion: Representacion[] = [];
  representacionForm: FormGroup;
  editMode = false;
  editIndex: number = null;
  isLoading = false;

  relacionCatalogo = TipoRelacion;
  representacionCatalogo = TipoRepresentacion;
  extranjeroCatalogo = Extranjero;
  paisesCatalogo = Paises;
  estadosCatalogo = Estados;
  sectorCatalogo = Sector;

  tipoDeclaracion: string = null;
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
    this.representacionForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  locationChanged(value: string) {
    const localizacion = this.representacionForm.get('representacion').get('ubicacion');
    const pais = localizacion.get('pais');
    const entidadFederativa = localizacion.get('entidadFederativa');
    if (value === 'EX') {
      pais.enable();
      entidadFederativa.disable();
      entidadFederativa.reset();
      this.tipoDomicilio = 'EXTRANJERO';
    } else {
      pais.disable();
      entidadFederativa.enable();
      pais.reset();
      this.tipoDomicilio = 'MEXICO';
    }
  }

  cancelEditMode() {
    this.editMode = false;
    this.editIndex = null;
  }

  createForm() {
    this.representacionForm = this.formBuilder.group({
      ninguno: false,
      // participaciones
      representacion: this.formBuilder.group({
        //tipoOperacion: ['', Validators.required],
        tipoRelacion: ['', Validators.required],
        tipoRepresentacion: ['', Validators.required],
        fechaInicioRepresentacion: ['', [Validators.required]],
        tipoPersona: ['', Validators.required],
        nombreRazonSocial: ['', [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
        rfc: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
            ),
          ],
        ],
        recibeRemuneracion: [false, Validators.required],
        montoMensual: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        ubicacion: this.formBuilder.group({
          pais: ['', [Validators.required]],
          entidadFederativa: ['', [Validators.required]],
        }),
        sector: ['', [Validators.required]],
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });

    const montoMensual = this.representacionForm.get('representacion').get('montoMensual');
    this.representacionForm
      .get('representacion')
      .get('recibeRemuneracion')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((x) => {
        x ? montoMensual.enable() : montoMensual.disable();
      });
  }

  editItem(index: number) {
    this.setEditMode();
    this.fillForm(this.representacion[index]);
    this.editIndex = index;
  }

  fillForm(representacion: Representacion) {
    Object.keys(representacion)
      .filter((field) => representacion[field] !== null)
      .forEach((field) => this.representacionForm.get(`representacion.${field}`).patchValue(representacion[field]));

    ifExistsEnableFields(
      representacion.ubicacion.entidadFederativa,
      this.representacionForm,
      'representacion.ubicacion.entidadFederativa'
    );
    if (representacion.ubicacion.entidadFederativa) {
      this.tipoDomicilio = 'MEXICO';
    }

    ifExistsEnableFields(representacion.ubicacion.pais, this.representacionForm, 'representacion.ubicacion.pais');
    if (representacion.ubicacion.pais) {
      this.tipoDomicilio = 'EXTRANJERO';
    }

    this.setSelectedOptions();
  }

  async getUserInfo() {
    try {
      const { data } = await this.apollo
        .query<DeclaracionOutput>({
          query: representacionesQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();

      this.declaracionId = data.declaracion._id;
      if (data.declaracion.representaciones) {
        this.setupForm(data.declaracion.representaciones);
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {}

  noRepresentation() {
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
        const representacion = [...this.representacion.slice(0, index), ...this.representacion.slice(index + 1)];
        const aclaracionesObservaciones = this.representacionForm.value.aclaracionesObservaciones;
        this.saveInfo({
          representacion,
          aclaracionesObservaciones,
        });
      }
    });
  }

  async saveInfo(form: Representaciones) {
    try {
      const declaracion = {
        representaciones: form,
      };

      const { data } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: representacionesMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();

      this.editMode = false;
      if (data.declaracion.representaciones) {
        this.setupForm(data.declaracion.representaciones);
      }
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  saveItem() {
    let representacion = [...this.representacion];
    const aclaracionesObservaciones = this.representacionForm.value.aclaracionesObservaciones;
    const newItem = this.representacionForm.value.representacion;

    if (this.editIndex === null) {
      representacion = [...representacion, newItem];
    } else {
      representacion[this.editIndex] = newItem;
    }

    this.isLoading = true;

    this.saveInfo({
      representacion,
      aclaracionesObservaciones,
    });

    this.isLoading = false;
  }

  setEditMode() {
    this.representacionForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  setSelectedOptions() {
    const { sector } = this.representacionForm.value.representacion;
    const { entidadFederativa, pais } = this.representacionForm.value.representacion.ubicacion;

    if (sector) {
      this.representacionForm.get('representacion.sector').setValue(findOption(this.sectorCatalogo, sector));
    }

    if (entidadFederativa) {
      this.representacionForm
        .get('representacion.ubicacion.entidadFederativa')
        .setValue(findOption(this.estadosCatalogo, entidadFederativa));
    }
  }

  setupForm(representaciones: Representaciones) {
    this.representacion = representaciones.representacion;
    const aclaraciones = representaciones.aclaracionesObservaciones;

    if (representaciones.ninguno) {
      this.representacionForm.get('ninguno').patchValue(true);
    }

    if (aclaraciones) {
      this.representacionForm.get('aclaracionesObservaciones').setValue(aclaraciones);
      this.toggleAclaraciones(true);
    }
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.representacionForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
