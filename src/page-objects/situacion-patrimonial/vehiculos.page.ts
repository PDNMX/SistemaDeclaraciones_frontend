import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
import radioButtonInput from '../general-fields/radio-button';
class Vehiculos {
  constructor() {}
  async deleteItem() {
    await t.click(Selector('button > span').withText('ELIMINAR').nth(-1));
    await t.click(Selector('button > span').withText('Eliminar')).wait(3000);
  }

  async fill(
    replace = false,
    textFieldContent = 'Texto de Prueba',
    numberFieldContent = '2020',
    tipoVehiculo = 'AERONAVE',
    titular = 'CÓNYUGE',
    tipoPersonaTercero = 'Persona Física',
    rfcTercero = 'CUPU800825569',
    tipoPersonaTransmisor = 'Persona Física',
    rfcTransmisor = 'CUPU800825569',
    relacionTransmisión = 'BISNIETO(A)',
    lugarRegistro = 'En México',
    entidadFedertiva = 'AGUASCALIENTES',
    pais = 'ALBANIA',
    formaAdquisicion = 'CESIÓN',
    formaPago = 'CREDITO',
    moneda = 'MXN - PESO MEXICANO',
    fechaAdquisicion = '20/02/2015'
  ) {
    await selectField.fill('[formcontrolname="tipoVehiculo"]', tipoVehiculo);
    await selectField.fill('[formcontrolname="titular"]', titular);
    await radioButtonInput.select('[formGroupName="tercero"] [formControlName="tipoPersona"]', tipoPersonaTercero);
    await textField.fill('[formGroupName="tercero"] [formcontrolname="nombreRazonSocial"]', textFieldContent, replace);
    await textField.fill('[formGroupName="tercero"] [formcontrolname="rfc"]', rfcTercero, replace);
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
    await textField.fill('[formcontrolname="marca"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="modelo"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="anio"]', numberFieldContent, replace);
    await textField.fill('[formcontrolname="numeroSerieRegistro"]', numberFieldContent, replace);
    await selectField.fill(Selector('[formGroupName="lugarRegistro"]').nth(0), lugarRegistro);
    if (lugarRegistro == 'En México') {
      await selectField.fill('[formcontrolname="entidadFederativa"]', entidadFedertiva);
    } else if (lugarRegistro == 'En el extranjero') {
      await selectField.fill('[formcontrolname="pais"]', pais);
    }
    await selectField.fill('[formcontrolname="formaAdquisicion"]', formaAdquisicion);
    await selectField.fill('[formcontrolname="formaPago"]', formaPago);
    await textField.fill('[formGroupName="valorAdquisicion"] [formcontrolname="valor"]', numberFieldContent, replace);
    await selectField.fill('[formGroupName="valorAdquisicion"] [formcontrolname="moneda"]', moneda);
    await textField.fill('[formcontrolname="fechaAdquisicion"]', fechaAdquisicion, replace);
  }
  async login() {
    await loginPage.submitForm('prueba7@yopmail.com', '0123456789');
  }
  async modifyVehicle(
    replace = true,
    textFieldContent = 'Texto modificado de prueba',
    numberFieldContent = '2019',
    tipoVehiculo = 'BARCO/YATE',
    titular = 'CONVIVIENTE',
    tipoPersonaTercero = 'Persona Moral',
    rfcTercero = 'PRO840423SG8',
    tipoPersonaTransmisor = 'Persona Moral',
    rfcTransmisor = 'PRO840423SG8',
    relacionTransmisión = 'CONCUBINA O CONCUBINARIO',
    lugarRegistro = 'En el extranjero',
    entidadFedertiva = 'BAJA CALIFORNIA SUR',
    pais = 'ANGOLA',
    formaAdquisicion = 'COMPRAVENTA',
    formaPago = 'CREDITO',
    moneda = 'MXN - PESO MEXICANO',
    fechaAdquisicion = '15/05/2018'
  ) {
    await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
    await this.fill(
      replace,
      textFieldContent,
      numberFieldContent,
      tipoVehiculo,
      titular,
      tipoPersonaTercero,
      rfcTercero,
      tipoPersonaTransmisor,
      rfcTransmisor,
      relacionTransmisión,
      lugarRegistro,
      entidadFedertiva,
      pais,
      formaAdquisicion,
      formaPago,
      moneda,
      fechaAdquisicion
    );
    await this.save();
  }
  async newVehicle() {
    await t.click(Selector('button > span').withText('AGREGAR VEHÍCULO'));
    await this.fill();
    await this.save();
  }
  async noVehicle() {
    if (await Selector('button > span').withText('NINGUNO').exists) {
      await t.click(Selector('button > span').withText('NINGUNO')).wait(3000);
    }
  }
  async save() {
    await t.click(Selector('button > span').withText('GUARDAR CAMBIOS'));
  }
}
const vehiculos = new Vehiculos();
export default vehiculos;
