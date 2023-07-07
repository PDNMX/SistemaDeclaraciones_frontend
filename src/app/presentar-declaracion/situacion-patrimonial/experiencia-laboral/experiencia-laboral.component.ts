import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { experienciaLaboralMutation, experienciaLaboralQuery } from '@api/declaracion';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DeclaracionOutput } from '@models/declaracion/declaracion.model';
import { Experiencia, ExperienciaLaboral } from '@models/declaracion/experiencia-laboral.model';

import { findOption } from '@utils/utils';

import AmbitoSector from '@static/catalogos/ambitoSector.json';
import AmbitoPublico from '@static/catalogos/ambitoPublico.json';
import NivelOrdenGobierno from '@static/catalogos/nivelOrdenGobierno.json';
import Sector from '@static/catalogos/sector.json';
import Extranjero from '@static/catalogos/extranjero.json';

import { tooltipData } from '@static/tooltips/experiencia-laboral';
import { Constantes } from '@app/@shared/constantes';

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.scss'],
})
export class ExperienciaLaboralComponent implements OnInit {
  aclaraciones = false;
  experienciaLaboralForm: FormGroup;
  editMode = false;
  editIndex: number = null;
  experiencia: Experiencia[] = [];
  isLoading = false;

  ambitoSectorCatalogo = AmbitoSector;
  ambitoPublicoCatalogo = AmbitoPublico;
  nivelOrdenGobiernoCatalogo = NivelOrdenGobierno;
  sectorCatalogo = Sector;
  extranjeroCatalogo = Extranjero;

  declaracionSimplificada = false;
  tipoDeclaracion: string = null;
  declaracionId: string = null;

  tooltipData = tooltipData;

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
        ambitoSector: [{ clave: '', valor: '' }, Validators.required],
        nivelOrdenGobierno: ['', [Validators.required]],
        ambitoPublico: ['', [Validators.required]],
        nombreEntePublico: ['', [Validators.required]],
        areaAdscripcion: ['', [Validators.required]],
        empleoCargoComision: ['', [Validators.required]],
        funcionPrincipal: ['', [Validators.required]],
        fechaIngreso: ['', [Validators.required]],
        fechaEgreso: ['', [Validators.required]],
        ubicacion: ['', [Validators.required]],

        nombreEmpresaSociedadAsociacion: ['', [Validators.required]],
        rfc: ['', [Validators.required, Validators.pattern(Constantes.VALIDACION_RFC)]],
        area: ['', [Validators.required]],
        puesto: ['', [Validators.required]],
        sector: [{ clave: '', valor: '' }, [Validators.required]],
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required]],
    });

    const ambitoSector = this.experienciaLaboralForm.get('experiencia.ambitoSector');

    ambitoSector.valueChanges.subscribe((value) => {
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

    this.setSelectedOptions(experiencia);
  }

  async getUserInfo() {
    try {
      const { data } = await this.apollo
        .query<DeclaracionOutput>({
          query: experienciaLaboralQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
            declaracionCompleta: !this.declaracionSimplificada,
          },
        })
        .toPromise();

      this.declaracionId = data.declaracion._id;
      this.setupForm(data.declaracion.experienciaLaboral);
    } catch (error) {
      console.log(error);
    }
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

      const { data } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: experienciaLaboralMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();

      this.editMode = false;
      this.setupForm(data.declaracion.experienciaLaboral);
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  saveItem() {
    let experiencia = [...this.experiencia];
    const aclaracionesObservaciones = this.experienciaLaboralForm.value.aclaracionesObservaciones;
    const newItem = this.experienciaLaboralForm.value.experiencia;

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
      this.experienciaLaboralForm.get('aclaracionesObservaciones').patchValue(aclaraciones);
      this.toggleAclaraciones(true);
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

  getLinkSiguiente() {
    const base =
      '/' +
      this.tipoDeclaracion +
      '/' +
      (this.declaracionSimplificada ? 'simplificada/' : '/') +
      'situacion-patrimonial/';

    if (this.declaracionSimplificada) return base + 'ingresos-netos/';
    else return base + 'datos-pareja';
  }
}
