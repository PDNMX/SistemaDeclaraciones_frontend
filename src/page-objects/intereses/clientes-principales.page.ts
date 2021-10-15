import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
import radioButtonInput from '../general-fields/radio-button';
class Representaciones {
  constructor() {}
  async deleteItem() {
    await t.click(Selector('button > span').withText('ELIMINAR').nth(-1));
    await t.click(Selector('button > span').withText('Eliminar')).wait(3000);
  }

  async fill(
    replace = false,
    textFieldContent = 'Texto de Prueba',
    numberFieldContent = '7564',
    tipoOperacion = 'AGREGAR',
    realizaActividadLucrativa = 'Si',
    tipoRelacion = 'DECLARANTE',
    rfcEmpresa = 'PRO840423SG8',
    tipoPersonaCliente = 'Persona Física',
    rfcCliente = 'CUPU800825569',
    sector = 'MINERÍA',
    moneda = 'MXN - PESO MEXICANO',
    ubicacion = 'MÉXICO',
    entidadFederativa = 'AGUASCALIENTES',
    pais = 'ALBANIA'
  ) {
    await selectField.fill('[formControlName="tipoOperacion"]', tipoOperacion);
    await radioButtonInput.select('[formControlName="realizaActividadLucrativa"]', realizaActividadLucrativa);
    await selectField.fill('[formControlName="tipoRelacion"]', tipoRelacion);
    await textField.fill(
      '[formGroupName="empresa"] [formcontrolname="nombreEmpresaServicio"]',
      textFieldContent,
      replace
    );
    await textField.fill('[formGroupName="empresa"] [formcontrolname="rfc"]', rfcEmpresa, replace);
    await radioButtonInput.select(
      '[formGroupName="clientePrincipal"] [formControlName="tipoPersona"]',
      tipoPersonaCliente
    );
    await textField.fill(
      '[formGroupName="clientePrincipal"] [formcontrolname="nombreRazonSocial"]',
      textFieldContent,
      replace
    );
    await textField.fill('[formGroupName="clientePrincipal"] [formcontrolname="rfc"]', rfcCliente, replace);
    await selectField.fill('[formControlName="sector"]', sector);
    await textField.fill(
      '[formGroupName="montoAproximadoGanancia"] [formcontrolname="valor"]',
      numberFieldContent,
      replace
    );
    await selectField.fill('[formGroupName="montoAproximadoGanancia"] [formcontrolname="moneda"]', moneda);
    await selectField.fill(Selector('[formGroupName="ubicacion"] mat-select').nth(0), ubicacion);
    if (ubicacion == 'MÉXICO') {
      await selectField.fill('[formControlName="entidadFederativa"]', entidadFederativa);
    } else if (ubicacion == 'EN EL EXTRANJERO') {
      await selectField.fill('[formControlName="pais"]', pais);
    }
    if (await Selector('button > span').withText('AGREGAR ACLARACIONES / OBSERVACIONES').exists) {
      await t.click(Selector('button > span').withText('AGREGAR ACLARACIONES / OBSERVACIONES'));
    }
    if (await Selector('[formcontrolname="aclaracionesObservaciones"]').exists) {
      await textField.fill('[formcontrolname="aclaracionesObservaciones"]', textFieldContent, replace);
    }
  }
  async login() {
    await loginPage.submitForm('prueba7@yopmail.com', '0123456789');
  }
  async modifyCustomer(
    replace = true,
    textFieldContent = 'Texto modificado de prueba',
    numberFieldContent = '3545',
    tipoOperacion = 'MODIFICAR',
    realizaActividadLucrativa = 'Si',
    tipoRelacion = 'PAREJA',
    rfcEmpresa = 'PRO840423SG8',
    tipoPersonaCliente = 'Persona Física',
    rfcCliente = 'CUPU800825569',
    sector = 'CONSTRUCCIÓN',
    moneda = 'MXN - PESO MEXICANO',
    ubicacion = 'EN EL EXTRANJERO',
    entidadFederativa = 'CAMPECHE',
    pais = 'ALBANIA'
  ) {
    if (await Selector('button > span').withText('MODIFICAR').exists) {
      await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
      await this.fill(
        replace,
        textFieldContent,
        numberFieldContent,
        tipoOperacion,
        realizaActividadLucrativa,
        tipoRelacion,
        rfcEmpresa,
        tipoPersonaCliente,
        rfcCliente,
        sector,
        moneda,
        ubicacion,
        entidadFederativa,
        pais
      );
      await this.save();
    }
  }
  async newCustomer() {
    if (await Selector('button > span').withText('AGREGAR CLIENTE').exists) {
      await t.click(Selector('button > span').withText('AGREGAR CLIENTE'));
    }
    await this.fill();
    await this.save();
  }
  async noCustomers() {
    if (await Selector('button > span').withText('NINGUNO').exists) {
      await t.click(Selector('button > span').withText('NINGUNO')).wait(3000);
    }
  }
  async save() {
    await t.click(Selector('button > span').withText('GUARDAR CAMBIOS'));
  }
}
const representacion = new Representaciones();
export default representacion;
