import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { datosCurricularesMutation, datosCurricularesDeclaranteQuery } from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import DocumentoObtenido from '@static/catalogos/documentoObtenido.json';
import Estatus from '@static/catalogos/estatus.json';
import Nivel from '@static/catalogos/nivel.json';

import { tooltipData } from '@static/tooltips/datos-curriculares';

import { findOption } from '@utils/utils';

import { DatosCurricularesDeclarante, DeclaracionOutput, Escolaridad } from '@models/declaracion';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-datos-curriculares',
  templateUrl: './datos-curriculares.component.html',
  styleUrls: ['./datos-curriculares.component.scss'],
})
export class DatosCurricularesComponent implements OnInit {
  aclaraciones = false;
  datosCurricularesDeclaranteForm: FormGroup;
  editMode = true;
  editIndex: number = null;
  escolaridad: Escolaridad[] = [];
  isLoading = false;
  avanzar= false;

  documentoObtenidoCatalogo = DocumentoObtenido;
  estatusCatalogo = Estatus;
  nivelCatalogo = Nivel;

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
    this.datosCurricularesDeclaranteForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  cancelEditMode() {
    this.editMode = false;
    this.editIndex = null;
  }

  createForm() {
    this.datosCurricularesDeclaranteForm = this.formBuilder.group({
      escolaridad: this.formBuilder.group({
        nivel: [{ clave: '', valor: '' }, Validators.required],
        institucionEducativa: this.formBuilder.group({
          nombre: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
          ubicacion: ['', Validators.required],
        }),
        carreraAreaConocimiento: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        estatus: ['', Validators.required],
        documentoObtenido: ['', Validators.required],
        fechaObtencion: ['', [Validators.required]],
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });
  }

  editItem(index: number) {
    this.setEditMode();
    this.fillForm(this.escolaridad[index]);
    this.editIndex = index;
  }

  fillForm(escolaridad: Escolaridad) {
    this.datosCurricularesDeclaranteForm.get('escolaridad').patchValue(escolaridad);

    this.setSelectedOptions();
  }

  async getUserInfo() {
    try {
      const { data } = await this.apollo
        .query<DeclaracionOutput>({
          query: datosCurricularesDeclaranteQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
            declaracionCompleta: !this.declaracionSimplificada,
          },
        })
        .toPromise();

      this.declaracionId = data.declaracion._id;
      this.setupForm(data.declaracion.datosCurricularesDeclarante);
    } catch (error) {
      console.log(error);
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
        const escolaridad = [...this.escolaridad.slice(0, index), ...this.escolaridad.slice(index + 1)];
        const aclaracionesObservaciones = this.datosCurricularesDeclaranteForm.value.aclaracionesObservaciones;
        this.saveInfo({
          escolaridad,
          aclaracionesObservaciones,
        });
      }
    });
  }

  async saveInfo(form: DatosCurricularesDeclarante) {
    try {
      const declaracion = {
        datosCurricularesDeclarante: form,
      };


      const ultimaEscolaridad = declaracion.datosCurricularesDeclarante.escolaridad[declaracion.datosCurricularesDeclarante.escolaridad.length -1];

      if(ultimaEscolaridad === null || ultimaEscolaridad.nivel === null || ultimaEscolaridad.carreraAreaConocimiento.trim() === "") {
        //quitar el que es null
        declaracion.datosCurricularesDeclarante.escolaridad.splice(declaracion.datosCurricularesDeclarante.escolaridad.length - 1, 1);
      }

      const { data } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: datosCurricularesMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();

      this.editMode = false;

      this.setupForm(data.declaracion.datosCurricularesDeclarante);
      this.presentSuccessAlert();

      if(this.avanzar)
        this.router.navigate([this.getLinkSiguiente()]);
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  saveItem() {
    let escolaridad = [...this.escolaridad];
    const aclaracionesObservaciones = this.datosCurricularesDeclaranteForm.value.aclaracionesObservaciones;
    const newItem = this.datosCurricularesDeclaranteForm.value.escolaridad;

    if (this.editIndex === null) {
      escolaridad = [...escolaridad, newItem];
    } else {
      escolaridad[this.editIndex] = newItem;
    }

    // const ultimaEscolaridad = escolaridad[escolaridad.length - 1];

    // if(ultimaEscolaridad === null || ultimaEscolaridad.nivel === null || ultimaEscolaridad.carreraAreaConocimiento.trim() === "") {
    //   //quitar el que es null
    //   escolaridad = escolaridad.splice(escolaridad.length - 1, 1);
    // }

    this.isLoading = true;

    this.saveInfo({
      escolaridad,
      aclaracionesObservaciones,
    });

    this.isLoading = false;
  }

  setEditMode() {
    this.datosCurricularesDeclaranteForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  setSelectedOptions() {
    const { nivel } = this.datosCurricularesDeclaranteForm.value.escolaridad;

    if (nivel) {
      this.datosCurricularesDeclaranteForm
        .get('escolaridad.nivel')
        .setValue(findOption(this.nivelCatalogo, nivel.clave));
    }
  }

  setupForm(datosCurricularesDeclarante: DatosCurricularesDeclarante) {
    this.escolaridad = datosCurricularesDeclarante?.escolaridad || [];
    const aclaraciones = datosCurricularesDeclarante?.aclaracionesObservaciones;

    const ultimaEscolaridad = this.escolaridad[this.escolaridad.length - 1] ;

    if(ultimaEscolaridad == null || ultimaEscolaridad.nivel == null) {
      //quitar el que es null
      this.escolaridad = this.escolaridad.splice(this.escolaridad.indexOf(ultimaEscolaridad) - 1, 1);
    }

    if (aclaraciones) {
      this.datosCurricularesDeclaranteForm.get('aclaracionesObservaciones').setValue(aclaraciones);
      this.toggleAclaraciones(true);
    }

    this.editMode = !!!this.escolaridad.length;

    if(!this.editMode) {
      this.datosCurricularesDeclaranteForm.reset();
    }
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.datosCurricularesDeclaranteForm.get('aclaracionesObservaciones');
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

    return base + 'datos-empleo/';
  }

  siguiente() {
    this.avanzar = true;
    this.saveItem();
  }
}
