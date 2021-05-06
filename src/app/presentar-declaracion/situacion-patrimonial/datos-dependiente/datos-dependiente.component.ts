import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { datosDependientesEconomicosMutation, datosDependientesEconomicosQuery } from '@api/declaracion';

import { DeclarationErrorStateMatcher } from '@app/presentar-declaracion/shared-presentar-declaracion/declaration-error-state-matcher';
import { UntilDestroy, untilDestroyed } from '@core';
import { Catalogo, DependienteEconomico, DatosDependientesEconomicos, DeclaracionOutput } from '@models/declaracion';
import ActividadLaboral from '@static/catalogos/actividadLaboral.json';
import AmbitoPublico from '@static/catalogos/ambitoPublico.json';
import AmbitoSector from '@static/catalogos/ambitoSector.json';
import Estados from '@static/catalogos/estados.json';
import LugarDondeReside from '@static/catalogos/lugarDondeReside.json';
import Monedas from '@static/catalogos/monedas.json';
import Municipios from '@static/catalogos/municipios.json';
import NivelOrdenGobierno from '@static/catalogos/nivelOrdenGobierno.json';
import Paises from '@static/catalogos/paises.json';
import ParentescoRelacion from '@static/catalogos/parentescoRelacion.json';
import Sector from '@static/catalogos/sector.json';
import { tooltipData } from '@static/tooltips/situacion-patrimonial/datos-dependiente';
import { findOption } from '@utils/utils';

@UntilDestroy()
@Component({
  selector: 'app-datos-dependiente',
  templateUrl: './datos-dependiente.component.html',
  styleUrls: ['./datos-dependiente.component.scss'],
})
export class DatosDependienteComponent implements OnInit {
  aclaraciones = false;
  aclaracionesText: string = null;
  datosDependientesEconomicosForm: FormGroup;
  dependienteEconomico: DependienteEconomico[] = [];
  editMode = false;
  estado: Catalogo = null;
  editIndex: number = null;
  isLoading = false;

  @ViewChild('otroActividadLaboral') otroActividadLaboral: ElementRef;
  @ViewChild('otroParentesco') otroParentesco: ElementRef;
  @ViewChild('otroSector') otroSector: ElementRef;

  actividadLaboralCatalogo = ActividadLaboral;
  ambitoPublicoCatalogo = AmbitoPublico;
  ambitoSectorCatalogo = AmbitoSector;
  estadosCatalogo = Estados;
  lugarDondeResideCatalogo = LugarDondeReside;
  monedasCatalogo = Monedas;
  municipiosCatalogo = Municipios;
  nivelOrdenGobiernoCatalogo = NivelOrdenGobierno;
  paisesCatalogo = Paises;
  parentescoRelacionCatalogo = ParentescoRelacion;
  sectorCatalogo = Sector;

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

  actividadLaboralChanged(value: any) {
    const actividadLaboralSectorPublico = this.datosDependientesEconomicosForm.get(
      'dependienteEconomico.actividadLaboralSectorPublico'
    );

    const actividadLaboralSectorPrivadoOtro = this.datosDependientesEconomicosForm.get(
      'dependienteEconomico.actividadLaboralSectorPrivadoOtro'
    );

    const clave = value?.clave || null;

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
    this.datosDependientesEconomicosForm.reset();
    this.datosDependientesEconomicosForm.get('ninguno').patchValue(false);
    this.setAclaraciones(this.aclaracionesText);
    this.editMode = true;
    this.editIndex = null;
  }

  cancelEditMode() {
    this.editMode = false;
    this.editIndex = null;
  }

  createForm() {
    this.datosDependientesEconomicosForm = this.formBuilder.group({
      ninguno: [false],
      dependienteEconomico: this.formBuilder.group({
        nombre: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        primerApellido: [null, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        segundoApellido: [null, [Validators.pattern(/^\S.*\S$/)]],
        fechaNacimiento: [null, [Validators.required]],
        rfc: [
          null,
          [
            Validators.required,
            Validators.pattern(
              /^([A-ZÑ&]{4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?(([A-Z\d]{2})([A\d]))?$/i
            ),
          ],
        ],
        parentescoRelacion: [null, [Validators.required]],
        extranjero: [null, [Validators.required]],
        curp: [
          null,
          [
            Validators.pattern(
              /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/i
            ),
          ],
        ],
        habitaDomicilioDeclarante: [null, [Validators.required]],
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
            valor: [
              { disabled: true, value: 0 },
              [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)],
            ],
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
            valor: [
              { disabled: true, value: 0 },
              [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)],
            ],
            moneda: [{ disabled: true, value: null }, [Validators.required]],
          }),
          proveedorContratistaGobierno: [{ disabled: true, value: false }],
        }),
      }),
      aclaracionesObservaciones: [
        { disabled: true, value: null },
        [Validators.required, Validators.pattern(/^\S.*\S$/)],
      ],
    });

    const dependienteEconomico = this.datosDependientesEconomicosForm.get('dependienteEconomico');

    const actividadLaboral = dependienteEconomico.get('actividadLaboral');
    actividadLaboral.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      this.actividadLaboralChanged(value);
    });

    const estado = dependienteEconomico.get('domicilioMexico.entidadFederativa');
    estado.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      const municipio = dependienteEconomico.get('domicilioMexico.municipioAlcaldia');

      if (value) {
        municipio.enable();
      } else {
        municipio.disable();
        municipio.reset();
      }
      this.estado = value;
    });

    const habitaDomicilioDeclarante = dependienteEconomico.get('habitaDomicilioDeclarante');
    habitaDomicilioDeclarante.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      const lugarDondeReside = dependienteEconomico.get('lugarDondeReside');

      if (value) {
        lugarDondeReside.disable();
        lugarDondeReside.reset();
      } else {
        lugarDondeReside.enable();
      }
    });

    const lugarDondeReside = dependienteEconomico.get('lugarDondeReside');
    lugarDondeReside.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      this.lugarDondeResideChanged(value);
    });
  }

  editItem(index: number) {
    this.setEditMode();
    this.fillForm(this.dependienteEconomico[index]);
    this.editIndex = index;
  }

  fillForm(dependienteEconomico: DependienteEconomico) {
    const dependienteEconomicoForm = this.datosDependientesEconomicosForm.get('dependienteEconomico');

    dependienteEconomicoForm.patchValue(dependienteEconomico || {});

    this.tipoDomicilio = dependienteEconomico.lugarDondeReside;

    if (!dependienteEconomico.domicilioExtranjero) {
      dependienteEconomicoForm.get('domicilioExtranjero').disable();
    }
    if (!dependienteEconomico.domicilioMexico) {
      dependienteEconomicoForm.get('domicilioMexico').disable();
    }
    if (dependienteEconomico.actividadLaboral?.clave === 'OTR') {
      this.otroActividadLaboral.nativeElement.value = dependienteEconomico.actividadLaboral?.valor;
    }
    if (dependienteEconomico.parentescoRelacion?.clave === 'OTRO') {
      this.otroParentesco.nativeElement.value = dependienteEconomico.parentescoRelacion?.valor;
    }
    if (dependienteEconomico.actividadLaboralSectorPrivadoOtro?.sector?.clave === 'OTRO') {
      this.otroSector.nativeElement.value = dependienteEconomico.actividadLaboralSectorPrivadoOtro?.sector?.valor;
    }

    this.setAclaraciones(this.aclaracionesText);
    this.setSelectedOptions();
  }

  async getUserInfo() {
    try {
      const { data, errors } = await this.apollo
        .query<DeclaracionOutput>({
          query: datosDependientesEconomicosQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();

      if (errors) {
        throw errors;
      }

      this.declaracionId = data.declaracion._id;
      if (data.declaracion.datosDependientesEconomicos) {
        this.setupForm(data.declaracion.datosDependientesEconomicos);
      }
    } catch (error) {
      console.log(error);
      this.openSnackBar('[ERROR: No se pudo recuperar la información]', 'Aceptar');
    }
  }

  get finalDependienteEconomicoForm() {
    const form = JSON.parse(JSON.stringify(this.datosDependientesEconomicosForm.value.dependienteEconomico)); // Deep copy

    if (form.actividadLaboral?.clave === 'OTR') {
      form.actividadLaboral.valor = this.otroActividadLaboral.nativeElement.value;
    }
    if (form.parentescoRelacion?.clave === 'OTRO') {
      form.parentescoRelacion.valor = this.otroParentesco.nativeElement.value;
    }
    if (form.actividadLaboralSectorPrivadoOtro?.sector?.clave === 'OTRO') {
      form.actividadLaboralSectorPrivadoOtro.sector.valor = this.otroSector.nativeElement.value;
    }

    return form;
  }

  inputsAreValid(): boolean {
    let result = true;
    const dependienteEconomico = this.datosDependientesEconomicosForm.value.dependienteEconomico;

    if (dependienteEconomico.actividadLaboral?.clave === 'OTR') {
      result = result && this.otroActividadLaboral.nativeElement.value?.match(/^\S.*\S$/);
    }
    if (dependienteEconomico.parentescoRelacion?.clave === 'OTRO') {
      result = result && this.otroParentesco.nativeElement.value?.match(/^\S.*\S$/);
    }
    if (dependienteEconomico.actividadLaboralSectorPrivadoOtro?.sector?.clave === 'OTRO') {
      result = result && this.otroSector.nativeElement.value?.match(/^\S.*\S$/);
    }

    return result;
  }

  lugarDondeResideChanged(value: string) {
    const domicilioMexico = this.datosDependientesEconomicosForm.get('dependienteEconomico.domicilioMexico');
    const domicilioExtranjero = this.datosDependientesEconomicosForm.get('dependienteEconomico.domicilioExtranjero');

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

  ngOnInit(): void {}

  noDependent() {
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
        const dependienteEconomico = [
          ...this.dependienteEconomico.slice(0, index),
          ...this.dependienteEconomico.slice(index + 1),
        ];

        const aclaracionesObservaciones = this.datosDependientesEconomicosForm.value.aclaracionesObservaciones;
        this.saveInfo({
          dependienteEconomico,
          aclaracionesObservaciones,
        });
      }
    });
  }

  async saveInfo(form: DatosDependientesEconomicos) {
    try {
      const declaracion = {
        datosDependientesEconomicos: form,
      };

      const { data, errors } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: datosDependientesEconomicosMutation,
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
      if (data?.declaracion.datosDependientesEconomicos) {
        this.setupForm(data?.declaracion.datosDependientesEconomicos);
      }
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('[ERROR: No se guardaron los cambios]', 'Aceptar');
    }
  }

  saveItem() {
    let dependienteEconomico = [...this.dependienteEconomico];
    const aclaracionesObservaciones = this.datosDependientesEconomicosForm.value.aclaracionesObservaciones;
    const newItem = this.finalDependienteEconomicoForm;

    if (this.editIndex === null) {
      dependienteEconomico = [...dependienteEconomico, newItem];
    } else {
      dependienteEconomico[this.editIndex] = newItem;
    }

    this.isLoading = true;

    this.saveInfo({
      dependienteEconomico,
      aclaracionesObservaciones,
    });

    this.isLoading = false;
  }

  setAclaraciones(aclaraciones?: string) {
    this.datosDependientesEconomicosForm.get('aclaracionesObservaciones').patchValue(aclaraciones || null);
    this.aclaracionesText = aclaraciones || null;
    this.toggleAclaraciones(!!aclaraciones);
  }

  setEditMode() {
    this.datosDependientesEconomicosForm.reset();
    this.datosDependientesEconomicosForm.get('ninguno').setValue(false);
    this.editMode = true;
    this.editIndex = null;
  }

  setSelectedOptions() {
    const {
      actividadLaboral,
      parentescoRelacion,
      domicilioExtranjero,
      domicilioMexico,
    } = this.datosDependientesEconomicosForm.value.dependienteEconomico;

    if (actividadLaboral) {
      this.datosDependientesEconomicosForm
        .get('dependienteEconomico.actividadLaboral')
        .setValue(findOption(this.actividadLaboralCatalogo, actividadLaboral.clave));
    }
    if (parentescoRelacion) {
      this.datosDependientesEconomicosForm
        .get('dependienteEconomico.parentescoRelacion')
        .setValue(findOption(this.parentescoRelacionCatalogo, parentescoRelacion.clave));
    }
    if (actividadLaboral.clave == 'PRI' || actividadLaboral.clave === 'OTR') {
      const {
        sector,
      } = this.datosDependientesEconomicosForm.value.dependienteEconomico.actividadLaboralSectorPrivadoOtro;
      if (sector) {
        this.datosDependientesEconomicosForm
          .get('dependienteEconomico.actividadLaboralSectorPrivadoOtro.sector')
          .setValue(findOption(this.sectorCatalogo, sector.clave));
      }
    }

    if (domicilioMexico) {
      this.datosDependientesEconomicosForm
        .get('dependienteEconomico.domicilioMexico.entidadFederativa')
        .setValue(findOption(this.estadosCatalogo, domicilioMexico.entidadFederativa.clave));
      this.datosDependientesEconomicosForm
        .get('dependienteEconomico.domicilioMexico.municipioAlcaldia')
        .setValue(
          findOption(this.municipiosCatalogo[this.estado?.clave] || [], domicilioMexico.municipioAlcaldia.clave)
        );
      this.lugarDondeResideChanged('MEXICO');
    } else if (domicilioExtranjero) {
      this.datosDependientesEconomicosForm
        .get('dependienteEconomico.domicilioExtranjero.pais')
        .setValue(findOption(this.paisesCatalogo, domicilioExtranjero.pais).clave);
      this.lugarDondeResideChanged('EXTRANJERO');
    }
  }

  setupForm(datosDependientesEconomicos: DatosDependientesEconomicos) {
    this.dependienteEconomico = datosDependientesEconomicos.dependienteEconomico;
    const aclaraciones = datosDependientesEconomicos.aclaracionesObservaciones;

    if (datosDependientesEconomicos.ninguno) {
      this.datosDependientesEconomicosForm.get('ninguno').patchValue(true);
    }

    if (aclaraciones) {
      this.setAclaraciones(aclaraciones);
    }
  }

  toggleAclaraciones(value: boolean) {
    const aclaraciones = this.datosDependientesEconomicosForm.get('aclaracionesObservaciones');
    if (value) {
      aclaraciones.enable();
    } else {
      aclaraciones.disable();
      aclaraciones.reset();
    }
    this.aclaraciones = value;
  }
}
