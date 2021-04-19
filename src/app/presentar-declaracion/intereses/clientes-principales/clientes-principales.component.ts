import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { clientesPrincipalesMutation, clientesPrincipalesQuery } from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import Relacion from '@static/catalogos/tipoRelacion.json';
import Sector from '@static/catalogos/sector.json';
import Extranjero from '@static/catalogos/extranjero.json';
import Paises from '@static/catalogos/paises.json';
import Estados from '@static/catalogos/estados.json';

import { tooltipData } from '@static/tooltips/intereses/clientes-principales';

import { Cliente, ClientesPrincipales, DeclaracionOutput } from '@models/declaracion';

import { findOption, ifExistEnableFields } from '@utils/utils';

@Component({
  selector: 'app-clientes-principales',
  templateUrl: './clientes-principales.component.html',
  styleUrls: ['./clientes-principales.component.scss'],
})
export class ClientesPrincipalesComponent implements OnInit {
  aclaraciones = false;
  cliente: Cliente[] = [];
  clientesPrincipalesForm: FormGroup;
  editMode = false;
  editIndex: number = null;
  isLoading = false;

  relacionCatalogo = Relacion;
  sectorCatalogo = Sector;
  extranjeroCatalogo = Extranjero;
  paisesCatalogo = Paises;
  estadosCatalogo = Estados;

  tipoDeclaracion: string = null;
  tipoDomicilio: string = null;

  declaracionId: string = null;

  tooltipData = tooltipData;

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
    this.clientesPrincipalesForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  locationChanged(value: string) {
    const localizacion = this.clientesPrincipalesForm.get('cliente').get('ubicacion');
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
    this.clientesPrincipalesForm = this.formBuilder.group({
      ninguno: [false],
      cliente: this.formBuilder.group({
        //tipoOperacion: ['', Validators.required],
        realizaActividadLucrativa: [false, Validators.required],
        tipoRelacion: ['', Validators.required],
        empresa: this.formBuilder.group({
          nombreEmpresaServicio: ['', [Validators.required, Validators.pattern(/^\S.*\S?$/)]],
          rfc: [
            '',
            [
              Validators.required,
              Validators.pattern(
                /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
              ),
            ],
          ],
        }),
        clientePrincipal: this.formBuilder.group({
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
        }),
        sector: ['', [Validators.required]],
        montoAproximadoGanancia: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        ubicacion: this.formBuilder.group({
          pais: ['', Validators.required],
          entidadFederativa: ['', Validators.required],
        }),
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });
  }

  editItem(index: number) {
    this.setEditMode();
    this.fillForm(this.cliente[index]);
    this.editIndex = index;
  }

  fillForm(cliente: Cliente) {
    Object.keys(cliente)
      .filter((field) => cliente[field] !== null)
      .forEach((field) => this.clientesPrincipalesForm.get(`cliente.${field}`).patchValue(cliente[field]));

    ifExistEnableFields(
      cliente.ubicacion.entidadFederativa,
      this.clientesPrincipalesForm,
      'cliente.ubicacion.entidadFederativa'
    );
    if (cliente.ubicacion.entidadFederativa) {
      this.tipoDomicilio = 'MEXICO';
    }

    ifExistEnableFields(cliente.ubicacion.pais, this.clientesPrincipalesForm, 'cliente.ubicacion.pais');
    if (cliente.ubicacion.pais) {
      this.tipoDomicilio = 'EXTRANJERO';
    }

    this.setSelectedOptions();
  }

  async getUserInfo() {
    try {
      const { data } = await this.apollo
        .query<DeclaracionOutput>({
          query: clientesPrincipalesQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();

      this.declaracionId = data.declaracion._id;
      if (data.declaracion.clientesPrincipales) {
        this.setupForm(data.declaracion.clientesPrincipales);
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {}

  noClients() {
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
        const cliente = [...this.cliente.slice(0, index), ...this.cliente.slice(index + 1)];
        const aclaracionesObservaciones = this.clientesPrincipalesForm.value.aclaracionesObservaciones;
        this.saveInfo({
          cliente,
          aclaracionesObservaciones,
        });
      }
    });
  }

  async saveInfo(form: ClientesPrincipales) {
    try {
      const declaracion = {
        clientesPrincipales: form,
      };

      const { data } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: clientesPrincipalesMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();
      this.editMode = false;
      if (data.declaracion.clientesPrincipales) {
        this.setupForm(data.declaracion.clientesPrincipales);
      }
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  saveItem() {
    let cliente = [...this.cliente];
    const aclaracionesObservaciones = this.clientesPrincipalesForm.value.aclaracionesObservaciones;
    const newItem = this.clientesPrincipalesForm.value.cliente;

    if (this.editIndex === null) {
      cliente = [...cliente, newItem];
    } else {
      cliente[this.editIndex] = newItem;
    }

    this.isLoading = true;

    this.saveInfo({
      cliente,
      aclaracionesObservaciones,
    });

    this.isLoading = false;
  }

  setEditMode() {
    this.clientesPrincipalesForm.reset();
    this.editMode = true;
    this.editIndex = null;
  }

  setSelectedOptions() {
    const { sector } = this.clientesPrincipalesForm.value.cliente;
    const { entidadFederativa, pais } = this.clientesPrincipalesForm.value.cliente.ubicacion;

    if (sector) {
      this.clientesPrincipalesForm.get('cliente.sector').setValue(findOption(this.sectorCatalogo, sector));
    }

    if (entidadFederativa) {
      this.clientesPrincipalesForm
        .get('cliente.ubicacion.entidadFederativa')
        .setValue(findOption(this.estadosCatalogo, entidadFederativa));
    }
  }

  setupForm(clientes: ClientesPrincipales) {
    this.cliente = clientes.cliente;
    const aclaraciones = clientes.aclaracionesObservaciones;

    if (clientes.ninguno) {
      this.clientesPrincipalesForm.get('ninguno').patchValue(true);
    }

    if (aclaraciones) {
      this.clientesPrincipalesForm.get('aclaracionesObservaciones').setValue(aclaraciones);
      this.toggleAclaraciones(true);
    }
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.clientesPrincipalesForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
