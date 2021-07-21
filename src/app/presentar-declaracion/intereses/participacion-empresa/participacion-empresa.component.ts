import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { participacionMutation, participacionQuery } from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UntilDestroy, untilDestroyed } from '@core';

import Relacion from '@static/catalogos/tipoRelacion.json';
import TipoParticipacion from '@static/catalogos/tipoParticipacion.json';
import Extranjero from '@static/catalogos/extranjero.json';
import Paises from '@static/catalogos/paises.json';
import Estados from '@static/catalogos/estados.json';
import Sector from '@static/catalogos/sector.json';

import { tooltipData } from '@static/tooltips/intereses/participacion-empresa';

import { DeclaracionOutput, Participacion, Participaciones } from '@models/declaracion';

import { findOption, ifExistsEnableFields } from '@utils/utils';

import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';

@UntilDestroy()
@Component({
  selector: 'app-participacion-empresa',
  templateUrl: './participacion-empresa.component.html',
  styleUrls: ['./participacion-empresa.component.scss'],
})
export class ParticipacionEmpresaComponent implements OnInit {
  aclaraciones = false;
  participacionForm: FormGroup;
  editMode = false;
  editIndex: number = null;
  participacion: Participacion[] = [];
  isLoading = false;

  relacionCatalogo = Relacion;
  tipoParticipacionCatalogo = TipoParticipacion;
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
    this.participacionForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  locationChanged(value: string) {
    const localizacion = this.participacionForm.get('participacion').get('ubicacion');
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
    this.participacionForm = this.formBuilder.group({
      ninguno: [false],
      // participaciones
      participacion: this.formBuilder.group({
        tipoRelacion: ['', Validators.required],
        nombreEmpresaSociedadAsociacion: ['', [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
        rfc: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
            ),
          ],
        ],
        porcentajeParticipacion: [
          0,
          [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/), Validators.min(0), Validators.max(100)],
        ],
        tipoParticipacion: ['', Validators.required],
        recibeRemuneracion: [false, Validators.required],
        montoMensual: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        ubicacion: this.formBuilder.group({
          pais: ['', Validators.required],
          entidadFederativa: ['', Validators.required],
        }),
        sector: ['', Validators.required],
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });

    const montoMensual = this.participacionForm.get('participacion').get('montoMensual');
    this.participacionForm
      .get('participacion')
      .get('recibeRemuneracion')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((x) => {
        x ? montoMensual.enable() : montoMensual.disable();
      });
  }

  editItem(index: number) {
    this.setEditMode();
    this.fillForm(this.participacion[index]);
    this.editIndex = index;
  }

  fillForm(participacion: Participacion) {
    Object.keys(participacion)
      .filter((field) => participacion[field] !== null)
      .forEach((field) => this.participacionForm.get(`participacion.${field}`).patchValue(participacion[field]));
    ifExistsEnableFields(
      participacion.ubicacion.entidadFederativa,
      this.participacionForm,
      'participacion.ubicacion.entidadFederativa'
    );
    if (participacion.ubicacion.entidadFederativa) {
      this.tipoDomicilio = 'MEXICO';
    }

    ifExistsEnableFields(participacion.ubicacion.pais, this.participacionForm, 'participacion.ubicacion.pais');
    if (participacion.ubicacion.pais) {
      this.tipoDomicilio = 'EXTRANJERO';
    }

    this.setSelectedOptions();
  }

  async getUserInfo() {
    try {
      const { data } = await this.apollo
        .query<DeclaracionOutput>({
          query: participacionQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();

      this.declaracionId = data.declaracion._id;
      if (data.declaracion.participacion) {
        this.setupForm(data.declaracion.participacion);
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {}

  noParticipacion() {
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
        const participacion = [...this.participacion.slice(0, index), ...this.participacion.slice(index + 1)];
        const aclaracionesObservaciones = this.participacionForm.value.aclaracionesObservaciones;
        this.saveInfo({
          participacion,
          aclaracionesObservaciones,
        });
      }
    });
  }

  async saveInfo(form: Participaciones) {
    try {
      const declaracion = {
        participacion: form,
      };

      const { data } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: participacionMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();

      this.editMode = false;
      if (data.declaracion.participacion) {
        this.setupForm(data.declaracion.participacion);
      }
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  saveItem() {
    let participacion = [...this.participacion];
    const aclaracionesObservaciones = this.participacionForm.value.aclaracionesObservaciones;
    const newItem = this.participacionForm.value.participacion;

    if (this.editIndex === null) {
      participacion = [...participacion, newItem];
    } else {
      participacion[this.editIndex] = newItem;
    }

    this.isLoading = true;

    this.saveInfo({
      participacion,
      aclaracionesObservaciones,
    });

    this.isLoading = false;
  }

  setEditMode() {
    this.participacionForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  setSelectedOptions() {
    const { tipoParticipacion, sector } = this.participacionForm.value.participacion;
    const { entidadFederativa, pais } = this.participacionForm.value.participacion.ubicacion;

    if (tipoParticipacion) {
      this.participacionForm
        .get('participacion.tipoParticipacion')
        .setValue(findOption(this.tipoParticipacionCatalogo, tipoParticipacion.clave));
    }

    if (sector) {
      this.participacionForm.get('participacion.sector').setValue(findOption(this.sectorCatalogo, sector.clave));
    }

    if (entidadFederativa) {
      this.participacionForm
        .get('participacion.ubicacion.entidadFederativa')
        .setValue(findOption(this.estadosCatalogo, entidadFederativa.clave));
    }
  }

  setupForm(participacion: Participaciones) {
    this.participacion = participacion.participacion;
    const aclaraciones = participacion.aclaracionesObservaciones;

    if (participacion.ninguno) {
      this.participacionForm.get('ninguno').patchValue(true);
    }

    if (aclaraciones) {
      this.participacionForm.get('aclaracionesObservaciones').patchValue(aclaraciones);
      this.toggleAclaraciones(true);
    }
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.participacionForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
