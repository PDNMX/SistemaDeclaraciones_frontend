import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
import radioButtonInput from '../general-fields/radio-button';
class Adeudos {
  constructor() {}
  async deleteItem() {
    await t.click(Selector('button > span').withText('ELIMINAR').nth(-1));
    await t.click(Selector('button > span').withText('Eliminar')).wait(3000);
  }

  async fill(
    replace = false,
    textFieldContent = 'Texto de Prueba',
    numberFieldContent = '7564',
    tipoBien = 'Vehículos',
    tipoInmueble = 'DEPARTAMENTO',
    ubicacion = 'En el extranjero',
    numeroExterior = '25',
    numeroInterior = '65',
    codigoPostal = '65465',
    entidadFederativa = 'AGUASCALIENTES',
    pais = 'ALBANIA',
    tipoVehiculo = 'BARCO/YATE',
    lugarRegistro = 'EN EL EXTRANJERO',
    tipoDuenoTitular = 'Persona Física',
    rfcduenoTitular = 'CUPU800825569',
    relacionConTitular = 'BISNIETO(A)'
  ) {
    await selectField.fill(Selector('[formGroupName="tipoBien"] mat-form-field').nth(0), tipoBien);
    if (tipoBien == 'Inmueble') {
      await this.fillProperty(
        replace,
        tipoInmueble,
        ubicacion,
        textFieldContent,
        numeroExterior,
        numeroInterior,
        codigoPostal,
        entidadFederativa,
        pais
      );
    } else if (tipoBien == 'Vehículos') {
      await this.fillVeicles(
        replace,
        textFieldContent,
        numberFieldContent,
        tipoVehiculo,
        lugarRegistro,
        entidadFederativa,
        pais
      );
    }

    await radioButtonInput.select(
      '[formGroupName="duenoTitular"] [formControlName="tipoDuenoTitular"]',
      tipoDuenoTitular
    );
    await textField.fill('[formGroupName="duenoTitular"] [formcontrolname="nombreTitular"]', textFieldContent, replace);
    await textField.fill('[formGroupName="duenoTitular"] [formcontrolname="rfc"]', rfcduenoTitular, replace);
    await selectField.fill('[formGroupName="duenoTitular"] [formcontrolname="relacionConTitular"]', relacionConTitular);
    if (await Selector('button > span').withText('AGREGAR ACLARACIONES / OBSERVACIONES').exists) {
      await t.click(Selector('button > span').withText('AGREGAR ACLARACIONES / OBSERVACIONES'));
    }
    if (await Selector('[formcontrolname="aclaracionesObservaciones"]').exists) {
      await textField.fill('[formcontrolname="aclaracionesObservaciones"]', textFieldContent, replace);
    }
  }
  async fillDomicilioExtranjero(
    replace = false,
    textFieldContent = 'Texto de Prueba',
    numeroExterior = '25',
    numeroInterior = '65',
    codigoPostal = '65465',
    pais = 'ALBANIA'
  ) {
    await textField.fill('[formcontrolname="calle"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="numeroExterior"]', numeroExterior, replace);
    await textField.fill('[formcontrolname="numeroInterior"]', numeroInterior, replace);
    await textField.fill('[formcontrolname="codigoPostal"]', codigoPostal, replace);
    await selectField.fill('[formcontrolname="pais"]', pais);
    await textField.fill('[formcontrolname="estadoProvincia"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="ciudadLocalidad"]', textFieldContent, replace);
  }
  async fillDomicilioMexico(
    replace = false,
    textFieldContent = 'Texto de Prueba',
    numeroExterior = '25',
    numeroInterior = '65',
    codigoPostal = '65465',
    entidadFederativa = 'AGUASCALIENTES'
  ) {
    await textField.fill('[formcontrolname="calle"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="numeroExterior"]', numeroExterior, replace);
    await textField.fill('[formcontrolname="numeroInterior"]', numeroInterior, replace);
    await textField.fill('[formcontrolname="codigoPostal"]', codigoPostal, replace);
    await selectField.fill('[formcontrolname="entidadFederativa"]', entidadFederativa);
    await t
      .click(Selector('[formcontrolname="municipioAlcaldia"]'))
      .click(Selector(`[role="listbox"] > .mat-option`).nth(2));
    await textField.fill('[formcontrolname="coloniaLocalidad"]', textFieldContent, replace);
  }
  async fillProperty(
    replace: boolean,
    tipoInmueble: string,
    ubicacion: string,
    textFieldContent: string,
    numeroExterior: string,
    numeroInterior: string,
    codigoPostal: string,
    entidadFederativa: string,
    pais: string
  ) {
    await selectField.fill('[formcontrolname="tipoInmueble"]', tipoInmueble);
    await selectField.fill(Selector('[formGroupName="inmueble"] mat-form-field').nth(0), ubicacion);
    if (ubicacion == 'En México') {
      await this.fillDomicilioMexico(
        replace,
        textFieldContent,
        numeroExterior,
        numeroInterior,
        codigoPostal,
        entidadFederativa
      );
    } else if (ubicacion == 'En el extranjero') {
      await this.fillDomicilioExtranjero(replace, textFieldContent, numeroExterior, numeroInterior, codigoPostal, pais);
    }
  }
  async fillVeicles(
    replace: boolean,
    textFieldContent: string,
    numberFieldContent: string,
    tipoVehiculo: string,
    lugarRegistro: string,
    entidadFederativa: string,
    pais: string
  ) {
    await selectField.fill('[formcontrolname="tipo"]', tipoVehiculo);
    await textField.fill('[formcontrolname="marca"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="modelo"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="anio"]', numberFieldContent, replace);
    await textField.fill('[formcontrolname="numeroSerieRegistro"]', numberFieldContent, replace);
    await selectField.fill(Selector('[formGroupName="lugarRegistro"]').nth(0), lugarRegistro);
    if (lugarRegistro == 'EN MÉXICO') {
      await selectField.fill('[formcontrolname="entidadFederativa"]', entidadFederativa);
    } else if (lugarRegistro == 'EN EL EXTRANJERO') {
      await selectField.fill('[formcontrolname="pais"]', pais);
    }
  }
  async login() {
    await loginPage.submitForm('prueba7@yopmail.com', '0123456789');
  }
  async modifyDebt(
    replace = true,
    textFieldContent = 'Texto modificado de prueba',
    numberFieldContent = '3545',
    tipoBien = 'Vehículos',
    tipoInmueble = 'BODEGA',
    ubicacion = 'En el extranjero',
    numeroExterior = '36',
    numeroInterior = '56',
    codigoPostal = '63864',
    entidadFederativa = 'COLIMA',
    pais = 'ARMENIA',
    tipoVehiculo = 'AERONAVE',
    lugarRegistro = 'EN MÉXICO',
    tipoDuenoTitular = 'Persona Física',
    rfcduenoTitular = 'MRGB800825569',
    relacionConTitular = 'AHIJADO(A)'
  ) {
    await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
    await this.fill(
      replace,
      textFieldContent,
      numberFieldContent,
      tipoBien,
      tipoInmueble,
      ubicacion,
      numeroExterior,
      numeroInterior,
      codigoPostal,
      entidadFederativa,
      pais,
      tipoVehiculo,
      lugarRegistro,
      tipoDuenoTitular,
      rfcduenoTitular,
      relacionConTitular
    );
    await this.save();
  }
  async newDebt() {
    if (await Selector('button > span').withText('AGREGAR PRÉSTAMO O COMODATO').exists) {
      await t.click(Selector('button > span').withText('AGREGAR PRÉSTAMO O COMODATO'));
    } else if (await Selector('button > span').withText('AGREGAR PASIVO').exists) {
      await t.click(Selector('button > span').withText('AGREGAR PASIVO'));
    }
    await this.fill();
    await this.save();
  }
  async noDebts() {
    if (await Selector('button > span').withText('NINGUNO').exists) {
      await t.click(Selector('button > span').withText('NINGUNO')).wait(3000);
    }
  }
  async save() {
    await t.click(Selector('button > span').withText('GUARDAR CAMBIOS'));
  }
}
const adeudos = new Adeudos();
export default adeudos;
