import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { datosParejaMutation, datosParejaQuery } from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import RelacionConDeclarante from '@static/catalogos/relacionConDeclarante.json';
import LugarDondeReside from '@static/catalogos/lugarDondeReside.json';
import ActividadLaboral from '@static/catalogos/actividadLaboral.json';
import NivelOrdenGobierno from '@static/catalogos/nivelOrdenGobierno.json';
import AmbitoPublico from '@static/catalogos/ambitoPublico.json';
import Sector from '@static/catalogos/sector.json';
import Estados from '@static/catalogos/estados.json';
import Municipios from '@static/catalogos/municipios.json';
import Paises from '@static/catalogos/paises.json';

import { tooltipData } from '@static/tooltips/datos-pareja';

import { Catalogo, DatosPareja, DeclaracionOutput } from '@models/declaracion';
import { findOption } from '@utils/utils';

@Component({
  selector: 'app-datos-pareja',
  templateUrl: './datos-pareja.component.html',
  styleUrls: ['./datos-pareja.component.scss'],
})
export class DatosParejaComponent implements OnInit {
  aclaraciones = false;

  datosParejaForm: FormGroup;
  editMode = false;
  estado: Catalogo = null;
  isLoading = false;

  relacionConDeclaranteCatalogo = RelacionConDeclarante;
  lugarDondeResideCatalogo = LugarDondeReside;
  actividadLaboralCatalogo = ActividadLaboral;
  nivelOrdenGobiernoCatalogo = NivelOrdenGobierno;
  ambitoPublicoCatalogo = AmbitoPublico;
  sectorCatalogo = Sector;
  estadosCatalogo = Estados;
  municipiosCatalogo = Municipios;
  paisesCatalogo = Paises;

  pareja: DatosPareja = null;

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
  }

  actividadLaboralChanged(value: any) {
    if(value == null)
      return;

    const actividadLaboralSectorPublico = this.datosParejaForm.get('actividadLaboralSectorPublico');
    const actividadLaboralSectorPrivadoOtro = this.datosParejaForm.get('actividadLaboralSectorPrivadoOtro');

    const clave = value.clave || null;

    if (clave === 'PUB') {
      actividadLaboralSectorPublico.enable();
      actividadLaboralSectorPrivadoOtro.disable();
    } else if (clave === 'PRI' || clave === 'OTRO') {
      actividadLaboralSectorPublico.disable();
      actividadLaboralSectorPrivadoOtro.enable();
    } else {
      actividadLaboralSectorPublico.disable();
      actividadLaboralSectorPrivadoOtro.disable();
    }
  }

  addItem() {
    this.editMode = true;
    this.datosParejaForm.get('ninguno').patchValue(false);
  }

  confirmSaveInfo() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Guardar cambios',
        message: '',
        trueText: 'Guardar',
        falseText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveInfo(this.datosParejaForm.value);
      }
    });
  }

  createForm() {
    this.datosParejaForm = this.formBuilder.group({
      ninguno: [false],
      nombre: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      primerApellido: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      segundoApellido: ['', [Validators.pattern(/^\S.*\S$/)]],
      fechaNacimiento: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      rfc: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      relacionConDeclarante: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      ciudadanoExtranjero: [false, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      curp: [
        '',
        [
          Validators.pattern(
            /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/i
          ),
        ],
      ],
      esDependienteEconomico: [false, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      habitaDomicilioDeclarante: [false, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      lugarDondeReside: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      domicilioMexico: this.formBuilder.group({
        calle: ['', [Validators.pattern(/^\S.*$/)]],
        numeroExterior: ['', [Validators.pattern(/^\S.*$/)]],
        numeroInterior: ['', [Validators.pattern(/^\S.*$/)]],
        coloniaLocalidad: ['', [Validators.pattern(/^\S.*\S$/)]],
        municipioAlcaldia: [{ disabled: false, value: { clave: null, valor: null } }, Validators.required],
        entidadFederativa: [{ clave: null, valor: null }, Validators.required],
        codigoPostal: ['', [Validators.pattern(/^\d{5}$/i)]],
      }),
      domicilioExtranjero: this.formBuilder.group({
        calle: ['', [Validators.pattern(/^\S.*$/)]],
        numeroExterior: ['', [Validators.pattern(/^\S.*$/)]],
        numeroInterior: ['', [Validators.pattern(/^\S.*$/)]],
        ciudadLocalidad: ['', [Validators.pattern(/^\S.*\S$/)]],
        estadoProvincia: ['', Validators.required],
        pais: ['', Validators.required],
        codigoPostal: ['', [Validators.pattern(/^\d{5}$/i)]],
      }),
      actividadLaboral: [{ clave: '', valor: '' }, [Validators.required]],
      actividadLaboralSectorPublico: this.formBuilder.group({
        nivelOrdenGobierno: ['', [Validators.required]],
        ambitoPublico: ['', [Validators.required]],
        nombreEntePublico: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        areaAdscripcion: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        empleoCargoComision: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        funcionPrincipal: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        salarioMensualNeto: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        fechaIngreso: ['', [Validators.required]],
      }),
      actividadLaboralSectorPrivadoOtro: this.formBuilder.group({
        nombreEmpresaSociedadAsociacion: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        empleoCargoComision: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        rfc: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        fechaIngreso: ['', [Validators.required]],
        sector: [{ clave: '', valor: '' }, [Validators.required]],
        salarioMensualNeto: this.formBuilder.group({
          valor: [0, [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/), Validators.min(0)]],
          moneda: ['MXN'],
        }),
        proveedorContratistaGobierno: [false],
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });

    const estado = this.datosParejaForm.get('domicilioMexico').get('entidadFederativa');
    estado.valueChanges.subscribe((value) => {
      const municipio = this.datosParejaForm.get('domicilioMexico').get('municipioAlcaldia');

      if (value) {
        municipio.enable();
      } else {
        municipio.disable();
        municipio.reset();
      }
      this.estado = value;
    });
  }

  fillForm(datosPareja: DatosPareja) {
    /*Object.keys(datosPareja)
      .filter((field) => datosPareja[field] !== null)
      .forEach((field) => this.datosParejaForm.get(field).patchValue(datosPareja[field]));
    */
    this.datosParejaForm.patchValue(datosPareja || {});
    this.tipoDomicilio = datosPareja.lugarDondeReside;
    if (!datosPareja.domicilioExtranjero) {
      this.datosParejaForm.get('domicilioExtranjero').disable();
    }
    if (!datosPareja.domicilioMexico) {
      this.datosParejaForm.get('domicilioMexico').disable();
    }
    if (datosPareja.aclaracionesObservaciones) {
      this.toggleAclaraciones(true);
    }

    this.setSelectedOptions();


    this.actividadLaboralChanged(
      this.datosParejaForm.get('actividadLaboral').value
    );
  }

  async getUserInfo() {
    try {
      const { data } = await this.apollo
        .query<DeclaracionOutput>({
          query: datosParejaQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();

      this.declaracionId = data.declaracion._id;
      if (data.declaracion.datosPareja) {
        this.setupForm(data.declaracion.datosPareja);
      }
    } catch (error) {
      console.log(error);
    }
  }

  lugarDondeResideChanged(value: string) {
    const domicilioMexico = this.datosParejaForm.get('domicilioMexico');
    const domicilioExtranjero = this.datosParejaForm.get('domicilioExtranjero');

    switch (value) {
      case 'MEXICO':
        domicilioMexico.enable();
        domicilioExtranjero.disable();
        break;
      case 'EXTRANJERO':
        domicilioMexico.disable();
        domicilioExtranjero.enable();
        break;
      default:
        domicilioMexico.disable();
        domicilioExtranjero.disable();
        break;
    }

    this.tipoDomicilio = value;
  }

  async ngOnInit() {
    this.getUserInfo();
  }

  noCouple() {
    this.saveInfo({ ninguno: true });
  }

  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  removeItem() {
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
        this.noCouple();
      }
    });
  }

  async saveInfo(form: DatosPareja) {
    try {
      this.isLoading = true;

      const declaracion = {
        datosPareja: form,
      };

      const { data } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: datosParejaMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();
      this.isLoading = false;
      this.openSnackBar('Información actualizada', 'Aceptar');

      if (data.declaracion.datosPareja) {
        this.setupForm(data.declaracion.datosPareja);
      }
      this.editMode = false;
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
    finally{
      this.isLoading = false;
    }
  }

  setSelectedOptions() {
    const { actividadLaboral, domicilioExtranjero, domicilioMexico } = this.datosParejaForm.value;

    if (actividadLaboral) {
      this.datosParejaForm
        .get('actividadLaboral')
        .setValue(findOption(this.actividadLaboralCatalogo, actividadLaboral.clave));

      if (actividadLaboral.clave == 'PRI') {
        const { sector } = this.datosParejaForm.value.actividadLaboralSectorPrivadoOtro;
        if (sector) {
          this.datosParejaForm
            .get('actividadLaboralSectorPrivadoOtro.sector')
            .setValue(findOption(this.sectorCatalogo, sector.clave));
        }
      }
    }

    if (domicilioMexico) {
      this.datosParejaForm
        .get('domicilioMexico.entidadFederativa')
        .setValue(findOption(this.estadosCatalogo, domicilioMexico.entidadFederativa?.clave));
      this.datosParejaForm
        .get('domicilioMexico.municipioAlcaldia')
        .setValue(
          findOption(this.municipiosCatalogo[this.estado?.clave] || [], domicilioMexico.municipioAlcaldia?.clave)
        );
      this.lugarDondeResideChanged('MEXICO');
    } else if (domicilioExtranjero) {
      this.datosParejaForm
        .get('domicilioExtranjero.pais')
        .setValue(findOption(this.paisesCatalogo, domicilioExtranjero.pais).clave);
      this.lugarDondeResideChanged('EXTRANJERO');
    }
  }

  setupForm(datosPareja: DatosPareja) {
    if (datosPareja.ninguno) {
      this.datosParejaForm.get('ninguno').patchValue(true);
      this.pareja = null;
    } else {
      this.pareja = datosPareja;
      this.fillForm(datosPareja);
      this.datosParejaForm.get('ninguno').patchValue(false);
    }
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.datosParejaForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }

}
