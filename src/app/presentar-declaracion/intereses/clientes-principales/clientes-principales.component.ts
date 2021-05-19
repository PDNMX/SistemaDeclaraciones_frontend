import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatSelect } from '@angular/material/select';
import { Apollo } from 'apollo-angular';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { clientesPrincipalesMutation, clientesPrincipalesQuery } from '@api/declaracion';
import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';
import { Cliente, ClientesPrincipales, DeclaracionOutput } from '@models/declaracion';
import Estados from '@static/catalogos/estados.json';
import Monedas from '@static/catalogos/monedas.json';
import Paises from '@static/catalogos/paises.json';
import Relacion from '@static/catalogos/tipoRelacion.json';
import Sector from '@static/catalogos/sector.json';
import TipoOperacion from '@static/catalogos/tipoOperacion.json';
import { tooltipData } from '@static/tooltips/intereses/clientes-principales';
import { findOption } from '@utils/utils';

@Component({
  selector: 'app-clientes-principales',
  templateUrl: './clientes-principales.component.html',
  styleUrls: ['./clientes-principales.component.scss'],
})
export class ClientesPrincipalesComponent implements OnInit {
  aclaraciones = false;
  aclaracionesText: string = null;
  cliente: Cliente[] = [];
  clientesPrincipalesForm: FormGroup;
  editMode = false;
  editIndex: number = null;
  isLoading = false;

  @ViewChild('locationSelect') locationSelect: MatSelect;
  @ViewChild('otroSector') otroSector: ElementRef;

  estadosCatalogo = Estados;
  monedasCatalogo = Monedas;
  paisesCatalogo = Paises;
  relacionCatalogo = Relacion;
  sectorCatalogo = Sector;
  tipoOperacionCatalogo = TipoOperacion;

  tipoDeclaracion: string = null;
  tipoDomicilio: string = null;

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
    this.clientesPrincipalesForm.reset();
    this.setAclaraciones(this.aclaracionesText);
    this.editMode = true;
    this.editIndex = null;
  }

  cancelEditMode() {
    this.editMode = false;
    this.editIndex = null;
  }

  createForm() {
    this.clientesPrincipalesForm = this.formBuilder.group({
      ninguno: [false],
      cliente: this.formBuilder.group({
        tipoOperacion: [null, [Validators.required]],
        realizaActividadLucrativa: [false, [Validators.required]],
        tipoRelacion: [null, [Validators.required]],
        empresa: this.formBuilder.group({
          nombreEmpresaServicio: [null, [Validators.required, Validators.pattern(/^\S.*$/)]],
          rfc: [
            null,
            [
              Validators.required,
              Validators.pattern(
                /^([A-ZÑ&]{3}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
              ),
            ],
          ],
        }),
        clientePrincipal: this.formBuilder.group({
          tipoPersona: [null, [Validators.required]],
          nombreRazonSocial: [null, [Validators.required, Validators.pattern(/^\S.*$/)]],
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
        sector: [null, [Validators.required]],
        montoAproximadoGanancia: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
          moneda: [null, [Validators.required]],
        }),
        ubicacion: this.formBuilder.group({
          pais: [null, [Validators.required]],
          entidadFederativa: [null, [Validators.required]],
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
    this.fillForm(this.cliente[index]);
    this.editIndex = index;
  }

  fillForm(cliente: Cliente) {
    this.createForm();
    this.clientesPrincipalesForm.get('cliente').patchValue(cliente);
    this.setAclaraciones(this.aclaracionesText);

    if (cliente.sector?.clave === 'OTRO') {
      this.otroSector.nativeElement.value = cliente.sector.valor;
    }

    this.setSelectedOptions();
  }

  async getUserInfo() {
    try {
      const { data, errors } = await this.apollo
        .query<DeclaracionOutput>({
          query: clientesPrincipalesQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();

      if (errors) {
        throw errors;
      }

      this.declaracionId = data?.declaracion._id;
      if (data?.declaracion.clientesPrincipales) {
        this.setupForm(data?.declaracion.clientesPrincipales);
      }
    } catch (error) {
      console.log(error);
      this.openSnackBar('[ERROR: No se pudo recuperar la información]', 'Aceptar');
    }
  }

  get finalClienteForm() {
    const form = JSON.parse(JSON.stringify(this.clientesPrincipalesForm.value.cliente)); // Deep copy

    if (form.sector?.clave === 'OTRO') {
      form.sector.valor = this.otroSector.nativeElement.value;
    }

    return form;
  }

  inputsAreValid(): boolean {
    let result = true;

    if (this.clientesPrincipalesForm.value.cliente.sector?.clave === 'OTRO') {
      result = result && this.otroSector.nativeElement.value?.match(/^\S.*\S$/);
    }

    return result;
  }

  locationChanged(value: string) {
    const localizacion = this.clientesPrincipalesForm.get('cliente.ubicacion');
    const pais = localizacion.get('pais');
    const entidadFederativa = localizacion.get('entidadFederativa');

    if (value === 'EXTRANJERO') {
      pais.enable();
      entidadFederativa.disable();
      entidadFederativa.reset();
      this.tipoDomicilio = 'EXTRANJERO';
    } else if (value === 'MEXICO') {
      pais.disable();
      entidadFederativa.enable();
      pais.reset();
      this.tipoDomicilio = 'MEXICO';
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

      const { data, errors } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: clientesPrincipalesMutation,
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
      if (data.declaracion.clientesPrincipales) {
        this.setupForm(data.declaracion.clientesPrincipales);
      }
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('[ERROR: No se guardaron los cambios]', 'Aceptar');
    }
  }

  saveItem() {
    let cliente = [...this.cliente];
    const aclaracionesObservaciones = this.clientesPrincipalesForm.value.aclaracionesObservaciones;
    const newItem = this.finalClienteForm;

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

  setAclaraciones(aclaraciones?: string) {
    this.clientesPrincipalesForm.get('aclaracionesObservaciones').patchValue(aclaraciones || null);
    this.aclaracionesText = aclaraciones || null;
    this.toggleAclaraciones(!!aclaraciones);
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
      this.clientesPrincipalesForm.get('cliente.sector').setValue(findOption(this.sectorCatalogo, sector.clave));
    }

    if (entidadFederativa) {
      this.clientesPrincipalesForm
        .get('cliente.ubicacion.entidadFederativa')
        .setValue(findOption(this.estadosCatalogo, entidadFederativa.clave));
      this.locationSelect.writeValue('MEXICO');
      this.locationChanged('MEXICO');
    }

    if (pais) {
      this.clientesPrincipalesForm.get('cliente.ubicacion.pais').setValue(findOption(this.paisesCatalogo, pais).clave);
      this.locationSelect.writeValue('EXTRANJERO');
      this.locationChanged('EXTRANJERO');
    }
  }

  setupForm(clientes: ClientesPrincipales) {
    this.cliente = clientes.cliente;
    const aclaraciones = clientes.aclaracionesObservaciones;

    if (clientes.ninguno) {
      this.clientesPrincipalesForm.get('ninguno').patchValue(true);
    }

    if (aclaraciones) {
      this.setAclaraciones(aclaraciones);
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
