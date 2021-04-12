import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { datosDependientesEconomicosMutation, datosCurricularesDeclaranteQuery } from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import AmbitoSector from '@static/catalogos/ambitoSector.json';
import ParentescoRelacion from '@static/catalogos/parentescoRelacion.json';
import LugarDondeReside from '@static/catalogos/lugarDondeReside.json';
import ActividadLaboral from '@static/catalogos/actividadLaboral.json';
import NivelOrdenGobierno from '@static/catalogos/nivelOrdenGobierno.json';
import AmbitoPublico from '@static/catalogos/ambitoPublico.json';
import Sector from '@static/catalogos/sector.json';
import Estados from '@static/catalogos/estados.json';
import Municipios from '@static/catalogos/municipios.json';
import Paises from '@static/catalogos/paises.json';

import { tooltipData } from '@static/tooltips/datos-dependiente';

import { Catalogo, DependienteEconomico, DatosDependientesEconomicos, DeclaracionOutput } from '@models/declaracion';

import { findOption, ifExistEnableFields } from '@utils/utils';

@Component({
  selector: 'app-datos-dependiente',
  templateUrl: './datos-dependiente.component.html',
  styleUrls: ['./datos-dependiente.component.scss'],
})
export class DatosDependienteComponent implements OnInit {
  aclaraciones = false;
  datosDependientesEconomicosForm: FormGroup;
  dependienteEconomico: DependienteEconomico[] = [];
  editMode = false;
  estado: Catalogo = null;
  editIndex: number = null;
  isLoading = false;

  ambitoSectorCatalogo = AmbitoSector;
  parentescoRelacionCatalogo = ParentescoRelacion;
  lugarDondeResideCatalogo = LugarDondeReside;
  actividadLaboralCatalogo = ActividadLaboral;
  nivelOrdenGobiernoCatalogo = NivelOrdenGobierno;
  ambitoPublicoCatalogo = AmbitoPublico;
  sectorCatalogo = Sector;
  estadosCatalogo = Estados;
  municipiosCatalogo = Municipios;
  paisesCatalogo = Paises;

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

  actividadLaboralChanged(value: any) {
    const actividadLaboralSectorPublico = this.datosDependientesEconomicosForm
      .get('dependienteEconomico')
      .get('actividadLaboralSectorPublico');

    const actividadLaboralSectorPrivadoOtro = this.datosDependientesEconomicosForm
      .get('dependienteEconomico')
      .get('actividadLaboralSectorPrivadoOtro');

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
    this.datosDependientesEconomicosForm.reset();
    this.datosDependientesEconomicosForm.get('ninguno').setValue(false);
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
        nombre: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        primerApellido: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        segundoApellido: ['', [Validators.pattern(/^\S.*\S$/)]],
        fechaNacimiento: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        rfc: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
        parentescoRelacion: ['', [Validators.required]],
        extranjero: [false, [Validators.required]],
        curp: [
          '',
          [
            Validators.pattern(
              /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/i
            ),
          ],
        ],
        habitaDomicilioDeclarante: [false, [Validators.required]],
        lugarDondeReside: ['', [Validators.required]],
        domicilioMexico: this.formBuilder.group({
          calle: ['', [Validators.required, Validators.pattern(/^\S.*$/)]],
          numeroExterior: ['', [Validators.required, Validators.pattern(/^\S.*$/)]],
          numeroInterior: ['', [Validators.pattern(/^\S.*$/)]],
          coloniaLocalidad: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
          municipioAlcaldia: [{ disabled: true, value: { clave: '', valor: '' } }, [Validators.required]],
          entidadFederativa: [{ clave: '', valor: '' }, [Validators.required]],
          codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/i)]],
        }),
        domicilioExtranjero: this.formBuilder.group({
          calle: ['', [Validators.required, Validators.pattern(/^\S.*$/)]],
          numeroExterior: ['', [Validators.required, Validators.pattern(/^\S.*$/)]],
          numeroInterior: ['', [Validators.pattern(/^\S.*$/)]],
          ciudadLocalidad: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],
          estadoProvincia: ['', [Validators.required]],
          pais: ['', [Validators.required]],
          codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/i)]],
        }),
        actividadLaboral: ['', [Validators.required]],
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
          rfc: ['', [Validators.required]],
          fechaIngreso: ['', [Validators.required]],
          sector: ['', [Validators.required]],
          salarioMensualNeto: this.formBuilder.group({
            valor: [0, [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/), Validators.min(0)]],
            moneda: ['MXN'],
          }),
          proveedorContratistaGobierno: [false, [Validators.required]],
        }),
      }),
      aclaracionesObservaciones: [{ disabled: true, value: '' }, [Validators.required, Validators.pattern(/^\S.*\S$/)]],
    });

    const estado = this.datosDependientesEconomicosForm
      .get('dependienteEconomico.domicilioMexico')
      .get('entidadFederativa');
    estado.valueChanges.subscribe((value) => {
      const municipio = this.datosDependientesEconomicosForm
        .get('dependienteEconomico.domicilioMexico')
        .get('municipioAlcaldia');

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
    this.fillForm(this.dependienteEconomico[index]);
    this.editIndex = index;
  }

  fillForm(dependienteEconomico: DependienteEconomico) {
    Object.keys(dependienteEconomico)
      .filter((field) => dependienteEconomico[field] !== null)
      .forEach((field) =>
        this.datosDependientesEconomicosForm
          .get(`dependienteEconomico.${field}`)
          .patchValue(dependienteEconomico[field])
      );

    this.tipoDomicilio = dependienteEconomico.lugarDondeReside;

    ifExistEnableFields(
      dependienteEconomico.domicilioMexico,
      this.datosDependientesEconomicosForm,
      'dependienteEconomico.domicilioMexico'
    );
    ifExistEnableFields(
      dependienteEconomico.domicilioExtranjero,
      this.datosDependientesEconomicosForm,
      'dependienteEconomico.domicilioExtranjero'
    );
    ifExistEnableFields(
      dependienteEconomico.actividadLaboralSectorPublico,
      this.datosDependientesEconomicosForm,
      'dependienteEconomico.actividadLaboralSectorPublico'
    );
    ifExistEnableFields(
      dependienteEconomico.actividadLaboralSectorPrivadoOtro,
      this.datosDependientesEconomicosForm,
      'dependienteEconomico.actividadLaboralSectorPrivadoOtro'
    );

    if (dependienteEconomico.aclaracionesObservaciones) {
      this.toggleAclaraciones(true);
    }

    this.setSelectedOptions();
  }

  async getUserInfo() {
    try {
      const { data } = await this.apollo
        .query<DeclaracionOutput>({
          query: datosCurricularesDeclaranteQuery,
          variables: {
            tipoDeclaracion: this.tipoDeclaracion.toUpperCase(),
          },
        })
        .toPromise();

      this.declaracionId = data.declaracion._id;
      if (data.declaracion.datosDependientesEconomicos) {
        this.setupForm(data.declaracion.datosDependientesEconomicos);
      }
    } catch (error) {
      console.log(error);
    }
  }

  lugarDondeResideChanged(value: string) {
    const domicilioMexico = this.datosDependientesEconomicosForm.get('dependienteEconomico').get('domicilioMexico');

    const domicilioExtranjero = this.datosDependientesEconomicosForm
      .get('dependienteEconomico')
      .get('domicilioExtranjero');

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

      const { data } = await this.apollo
        .mutate<DeclaracionOutput>({
          mutation: datosDependientesEconomicosMutation,
          variables: {
            id: this.declaracionId,
            declaracion,
          },
        })
        .toPromise();

      this.editMode = false;
      if (data.declaracion.datosDependientesEconomicos) {
        this.setupForm(data.declaracion.datosDependientesEconomicos);
      }
      this.presentSuccessAlert();
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
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
        .setValue(findOption(this.parentescoRelacionCatalogo, parentescoRelacion));
    }
    if (actividadLaboral.clave == 'PRI') {
      const {
        sector,
      } = this.datosDependientesEconomicosForm.value.dependienteEconomico.actividadLaboralSectorPrivadoOtro;
      if (sector) {
        this.datosDependientesEconomicosForm
          .get('dependienteEconomico.actividadLaboralSectorPrivadoOtro.sector')
          .setValue(findOption(this.sectorCatalogo, sector));
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

  saveItem() {
    let dependienteEconomico = this.dependienteEconomico;
    const aclaracionesObservaciones = this.datosDependientesEconomicosForm.value.aclaracionesObservaciones;
    const newItem = this.datosDependientesEconomicosForm.value.dependienteEconomico;

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

  setEditMode() {
    this.datosDependientesEconomicosForm.reset();
    this.datosDependientesEconomicosForm.get('ninguno').setValue(false);
    this.editMode = true;
    this.editIndex = null;
  }

  setupForm(datosDependientesEconomicos: DatosDependientesEconomicos) {
    this.dependienteEconomico = datosDependientesEconomicos.dependienteEconomico;
    const aclaraciones = datosDependientesEconomicos.aclaracionesObservaciones;

    if (datosDependientesEconomicos.ninguno) {
      this.datosDependientesEconomicosForm.get('ninguno').patchValue(true);
    }

    if (aclaraciones) {
      this.datosDependientesEconomicosForm.get('aclaracionesObservaciones').setValue(aclaraciones);
      this.toggleAclaraciones(true);
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
