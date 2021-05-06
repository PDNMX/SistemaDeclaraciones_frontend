import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { datosParejaMutation, datosParejaQuery } from '@api/declaracion';
import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';
import { UntilDestroy, untilDestroyed } from '@core';
import { Catalogo, DatosPareja, DeclaracionOutput } from '@models/declaracion';
import ActividadLaboral from '@static/catalogos/actividadLaboral.json';
import AmbitoPublico from '@static/catalogos/ambitoPublico.json';
import Estados from '@static/catalogos/estados.json';
import LugarDondeReside from '@static/catalogos/lugarDondeReside.json';
import Monedas from '@static/catalogos/monedas.json';
import Municipios from '@static/catalogos/municipios.json';
import NivelOrdenGobierno from '@static/catalogos/nivelOrdenGobierno.json';
import Paises from '@static/catalogos/paises.json';
import RelacionConDeclarante from '@static/catalogos/relacionConDeclarante.json';
import Sector from '@static/catalogos/sector.json';
import { tooltipData } from '@static/tooltips/situacion-patrimonial/datos-pareja';
import { findOption } from '@utils/utils';

@UntilDestroy()
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

  @ViewChild('otroActividadLaboral') otroActividadLaboral: ElementRef;
  @ViewChild('otroSector') otroSector: ElementRef;

  relacionConDeclaranteCatalogo = RelacionConDeclarante;
  lugarDondeResideCatalogo = LugarDondeReside;
  actividadLaboralCatalogo = ActividadLaboral;
  nivelOrdenGobiernoCatalogo = NivelOrdenGobierno;
  ambitoPublicoCatalogo = AmbitoPublico;
  sectorCatalogo = Sector;
  estadosCatalogo = Estados;
  monedasCatalogo = Monedas;
  municipiosCatalogo = Municipios;
  paisesCatalogo = Paises;

  pareja: DatosPareja = null;

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
  }

  actividadLaboralChanged(value: any) {
    const actividadLaboralSectorPublico = this.datosParejaForm.get('actividadLaboralSectorPublico');
    const actividadLaboralSectorPrivadoOtro = this.datosParejaForm.get('actividadLaboralSectorPrivadoOtro');

    const clave = value.clave || null;

    if (clave === 'PUB') {
      actividadLaboralSectorPublico.enable();
      actividadLaboralSectorPrivadoOtro.disable();
    } else if (clave === 'PRI' || clave === 'OTR') {
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
        this.saveInfo(this.finalForm);
      }
    });
  }

  createForm() {
    this.datosParejaForm = this.formBuilder.group({
      ninguno: [false],
      nombre: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      primerApellido: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
      segundoApellido: [null, [Validators.pattern(/^\S.*\S$/)]],
      fechaNacimiento: [null, [Validators.required]],
      rfc: [
        null,
        [
          Validators.pattern(
            /^([A-ZÑ&]{4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
          ),
        ],
      ],
      relacionConDeclarante: [null, [Validators.required]],
      ciudadanoExtranjero: [false, [Validators.required]],
      curp: [
        null,
        [
          Validators.pattern(
            /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/i
          ),
        ],
      ],
      esDependienteEconomico: [false, [Validators.required]],
      habitaDomicilioDeclarante: [false, [Validators.required]],
      lugarDondeReside: [null, [Validators.required]],
      domicilioMexico: this.formBuilder.group({
        calle: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*$/)]],
        numeroExterior: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*$/)]],
        numeroInterior: [{ disabled: true, value: null }, [Validators.pattern(/^\S.*$/)]],
        coloniaLocalidad: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*$/)]],
        municipioAlcaldia: [{ disabled: true, value: null }, [Validators.required]],
        entidadFederativa: [{ disabled: true, value: null }, [Validators.required]],
        codigoPostal: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\d{5}$/i)]],
      }),
      domicilioExtranjero: this.formBuilder.group({
        calle: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*$/)]],
        numeroExterior: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*$/)]],
        numeroInterior: [{ disabled: true, value: null }, [Validators.pattern(/^\S.*$/)]],
        ciudadLocalidad: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*$/)]],
        estadoProvincia: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*$/)]],
        pais: [{ disabled: true, value: null }, [Validators.required]],
        codigoPostal: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\d{5}$/i)]],
      }),
      actividadLaboral: [null, [Validators.required]],
      actividadLaboralSectorPublico: this.formBuilder.group({
        nivelOrdenGobierno: [{ disabled: true, value: null }, [Validators.required]],
        ambitoPublico: [{ disabled: true, value: null }, [Validators.required]],
        nombreEntePublico: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        areaAdscripcion: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        empleoCargoComision: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        funcionPrincipal: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        salarioMensualNeto: this.formBuilder.group({
          valor: [{ disabled: true, value: 0 }, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
          moneda: [{ disabled: true, value: null }, [Validators.required]],
        }),
        fechaIngreso: [{ disabled: true, value: null }, [Validators.required]],
      }),
      actividadLaboralSectorPrivadoOtro: this.formBuilder.group({
        nombreEmpresaSociedadAsociacion: [
          { disabled: true, value: null },
          [Validators.required, Validators.pattern(/^\S.*\S$/)],
        ],
        empleoCargoComision: [{ disabled: true, value: null }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        rfc: [
          { disabled: true, value: null },
          [
            Validators.pattern(
              /^([A-ZÑ&]{3}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i
            ),
          ],
        ],
        fechaIngreso: [{ disabled: true, value: null }, [Validators.required]],
        sector: [{ disabled: true, value: null }, [Validators.required]],
        salarioMensualNeto: this.formBuilder.group({
          valor: [{ disabled: true, value: 0 }, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
          moneda: [{ disabled: true, value: null }, [Validators.required]],
        }),
        proveedorContratistaGobierno: [{ disabled: true, value: false }],
      }),
      aclaracionesObservaciones: [
        { disabled: true, value: null },
        [Validators.required, Validators.pattern(/^\S.*\S$/)],
      ],
    });

    const actividadLaboral = this.datosParejaForm.get('actividadLaboral');
    actividadLaboral.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      this.actividadLaboralChanged(value);
    });

    const estado = this.datosParejaForm.get('domicilioMexico.entidadFederativa');
    estado.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      const municipio = this.datosParejaForm.get('domicilioMexico.municipioAlcaldia');

      if (value) {
        municipio.enable();
      } else {
        municipio.disable();
        municipio.reset();
      }
      this.estado = value;
    });

    const habitaDomicilioDeclarante = this.datosParejaForm.get('habitaDomicilioDeclarante');
    habitaDomicilioDeclarante.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      const lugarDondeReside = this.datosParejaForm.get('lugarDondeReside');

      if (value) {
        lugarDondeReside.disable();
        lugarDondeReside.reset();
      } else {
        lugarDondeReside.enable();
      }
    });

    const lugarDondeReside = this.datosParejaForm.get('lugarDondeReside');
    lugarDondeReside.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      this.lugarDondeResideChanged(value);
    });
  }

  fillForm(datosPareja: DatosPareja) {
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
    if (datosPareja.actividadLaboral?.clave === 'OTR') {
      this.otroActividadLaboral.nativeElement.value = datosPareja.actividadLaboral?.valor;
    }
    if (datosPareja.actividadLaboralSectorPrivadoOtro?.sector?.clave === 'OTRO') {
      this.otroSector.nativeElement.value = datosPareja.actividadLaboralSectorPrivadoOtro?.sector?.valor;
    }

    this.setSelectedOptions();
  }

  async getUserInfo() {
    try {
      const { data, errors } = await this.apollo
        .query<DeclaracionOutput>({
          query: datosParejaQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();

      if (errors) {
        throw errors;
      }

      this.declaracionId = data.declaracion._id;
      if (data?.declaracion.datosPareja) {
        this.setupForm(data?.declaracion.datosPareja);
      }
    } catch (error) {
      console.log(error);
      this.openSnackBar('[ERROR: No se pudo recuperar la información]', 'Aceptar');
    }
  }

  get finalForm() {
    const form = JSON.parse(JSON.stringify(this.datosParejaForm.value)); // Deep copy

    if (form.actividadLaboral?.clave === 'OTR') {
      form.actividadLaboral.valor = this.otroActividadLaboral.nativeElement.value;
    }

    if (form.actividadLaboralSectorPrivadoOtro?.sector?.clave === 'OTRO') {
      form.actividadLaboralSectorPrivadoOtro.sector.valor = this.otroSector.nativeElement.value;
    }

    return form;
  }

  inputsAreValid(): boolean {
    let result = true;

    if (this.datosParejaForm.value.actividadLaboral?.clave === 'OTR') {
      result = result && this.otroActividadLaboral.nativeElement.value?.match(/^\S.*\S$/);
    }

    if (this.datosParejaForm.value.actividadLaboralSectorPrivadoOtro?.sector?.clave === 'OTRO') {
      result = result && this.otroSector.nativeElement.value?.match(/^\S.*\S$/);
    }

    return result;
  }

  lugarDondeResideChanged(value?: string) {
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

  presentSuccessAlert() {
    this.dialog.open(DialogComponent, {
      data: {
        title: 'Información actualizada',
        message: 'Se han guardado tus cambios',
        trueText: 'Aceptar',
      },
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

      const { data, errors } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: datosParejaMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();

      if (errors) {
        throw errors;
      }

      this.isLoading = false;
      this.editMode = false;

      if (data?.declaracion.datosPareja) {
        this.setupForm(data?.declaracion.datosPareja);
      }

      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('[ERROR: No se guardaron los cambios]', 'Aceptar');
    }
  }

  setSelectedOptions() {
    const { actividadLaboral, domicilioExtranjero, domicilioMexico } = this.datosParejaForm.value;

    if (actividadLaboral) {
      this.datosParejaForm
        .get('actividadLaboral')
        .setValue(findOption(this.actividadLaboralCatalogo, actividadLaboral.clave));
    }
    if (actividadLaboral.clave === 'PRI' || actividadLaboral.clave === 'OTR') {
      const { sector } = this.datosParejaForm.value.actividadLaboralSectorPrivadoOtro;
      if (sector) {
        this.datosParejaForm
          .get('actividadLaboralSectorPrivadoOtro.sector')
          .setValue(findOption(this.sectorCatalogo, sector.clave));
      }
    }

    if (domicilioMexico) {
      this.datosParejaForm
        .get('domicilioMexico.entidadFederativa')
        .setValue(findOption(this.estadosCatalogo, domicilioMexico.entidadFederativa.clave));
      this.datosParejaForm
        .get('domicilioMexico.municipioAlcaldia')
        .setValue(
          findOption(this.municipiosCatalogo[this.estado?.clave] || [], domicilioMexico.municipioAlcaldia.clave)
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
