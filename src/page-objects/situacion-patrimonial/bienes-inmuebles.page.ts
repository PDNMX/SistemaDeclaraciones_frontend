import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
import radioButtonInput from '../general-fields/radio-button';
class DatosDependiente {
  constructor() {}
  async deleteItem() {
    await t.click(Selector('button > span').withText('ELIMINAR').nth(-1));
    await t.click(Selector('button > span').withText('Eliminar')).wait(3000);
  }

  async fill(
    replace = false,
    textFieldContent = 'Texto de Prueba',
    numberFieldContent = '75',
    tipoInmueble = 'DEPARTAMENTO',
    titular = 'CÓNYUGE',
    tipoPersonaTercero = 'Persona Física',
    rfcTercero = 'CUPU800825569',
    tipoPersonaTransmisor = 'Persona Física',
    formaAdquisicion = 'CESIÓN',
    formaPago = 'CONTADO',
    rfcTransmisor = 'CUPU800825569',
    relacionTransmisión = 'BISNIETO(A)',
    monedaValorAdquisicion = 'MGA - ARIARY MALGACHE',
    fechaAdquisicion = '15/08/2000',
    valorConformeA = 'SENTENCIA'
  ) {
    await selectField.fill('[formcontrolname="tipoInmueble"]', tipoInmueble);
    await selectField.fill('[formcontrolname="titular"]', titular);
    await radioButtonInput.select('[formGroupName="tercero"] [formControlName="tipoPersona"]', tipoPersonaTercero);
    await textField.fill('[formGroupName="tercero"] [formcontrolname="nombreRazonSocial"]', textFieldContent, replace);
    await textField.fill('[formGroupName="tercero"] [formcontrolname="rfc"]', rfcTercero, replace);
    await textField.fill('[formcontrolname="porcentajePropiedad"]', numberFieldContent, replace);
    await textField.fill('[formGroupName="superficieTerreno"] [formcontrolname="valor"]', numberFieldContent, replace);
    await textField.fill(
      '[formGroupName="superficieConstruccion"] [formcontrolname="valor"]',
      numberFieldContent,
      replace
    );
    await selectField.fill('[formcontrolname="formaAdquisicion"]', formaAdquisicion);
    await selectField.fill('[formcontrolname="formaPago"]', formaPago);
    await radioButtonInput.select(
      '[formGroupName="transmisor"] [formControlName="tipoPersona"]',
      tipoPersonaTransmisor
    );
    await textField.fill(
      '[formGroupName="transmisor"] [formcontrolname="nombreRazonSocial"]',
      textFieldContent,
      replace
    );
    await textField.fill('[formGroupName="transmisor"] [formcontrolname="rfc"]', rfcTransmisor, replace);
    await selectField.fill('[formGroupName="transmisor"] [formcontrolname="relacion"]', relacionTransmisión);
    await textField.fill('[formGroupName="valorAdquisicion"] [formcontrolname="valor"]', numberFieldContent, replace);
    await selectField.fill('[formGroupName="valorAdquisicion"] [formcontrolname="moneda"]', monedaValorAdquisicion);
    await textField.fill(Selector('[formcontrolname="fechaAdquisicion"]'), fechaAdquisicion, replace);
    await textField.fill('[formcontrolname="datoIdentificacion"]', textFieldContent, replace);
    await selectField.fill('[formcontrolname="valorConformeA"]', valorConformeA);
  }
  async fillDomicilioExtranjero(
    replace = false,
    textFieldContent = 'Texto de Prueba',
    numeroExterior = '25',
    numeroInterior = '65',
    codigoPostal = '65465',
    pais = 'ALBANIA'
  ) {
    await selectField.fill('[data-test="ubicacion"]', 'En el extranjero');
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
    await selectField.fill('[data-test="ubicacion"]', 'México');
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
  async login() {
    await loginPage.submitForm('prueba7@yopmail.com', '0123456789');
  }
  async modifyProperty(
    replace = true,
    textFieldContent = 'Texto modificado de prueba',
    numberFieldContent = '54',
    tipoInmueble = 'CASA',
    titular = 'CONVIVIENTE',
    tipoPersonaTercero = 'Persona Moral',
    rfcTercero = 'PRO840423SG8',
    tipoPersonaTransmisor = 'Persona Moral',
    formaAdquisicion = 'PERMUTA',
    formaPago = 'CREDITO',
    rfcTransmisor = 'PRO840423SG8',
    relacionTransmisión = 'CONCUBINA O CONCUBINARIO',
    monedaValorAdquisicion = 'MXN - PESO MEXICANO',
    fechaAdquisicion = '20/04/2015',
    valorConformeA = 'CONTRATO',
    ubicacion = 'mexico',
    numExterior = '75',
    numInterior = '98',
    cp = '56472'
  ) {
    await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
    await this.fill(
      replace,
      textFieldContent,
      numberFieldContent,
      tipoInmueble,
      titular,
      tipoPersonaTercero,
      rfcTercero,
      tipoPersonaTransmisor,
      formaAdquisicion,
      formaPago,
      rfcTransmisor,
      relacionTransmisión,
      monedaValorAdquisicion,
      fechaAdquisicion,
      valorConformeA
    );
    if (ubicacion == 'mexico') {
      await this.fillDomicilioMexico(replace, textFieldContent, numExterior, numInterior, cp, 'CAMPECHE');
    } else if (ubicacion == 'extranjero') {
      await this.fillDomicilioExtranjero(replace, textFieldContent, numExterior, numInterior, cp, 'ALBANIA');
    }
    await this.save();
  }
  async newProperty(ubicacion = 'mexico') {
    await t.click(Selector('button > span').withText('AGREGAR BIEN INMUEBLE'));
    await this.fill();
    if (ubicacion == 'mexico') {
      await this.fillDomicilioMexico();
    } else if (ubicacion == 'extranjero') {
      await this.fillDomicilioExtranjero();
    }
    await this.save();
  }
  async noProperty() {
    if (await Selector('button > span').withText('NINGUNO').exists) {
      await t.click(Selector('button > span').withText('NINGUNO')).wait(3000);
    }
  }
  async save() {
    await t.click(Selector('button > span').withText('GUARDAR CAMBIOS'));
  }
}
const datosDependiente = new DatosDependiente();
export default datosDependiente;
