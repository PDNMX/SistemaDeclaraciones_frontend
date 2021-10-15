import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
class Inversiones {
  constructor() {}
  async deleteItem() {
    await t.click(Selector('button > span').withText('ELIMINAR').nth(-1));
    await t.click(Selector('button > span').withText('Eliminar')).wait(3000);
  }

  async fill(
    replace = false,
    textFieldContent = 'Texto de Prueba',
    numberFieldContent = '5432',
    tipoInversion = 'FONDOS DE INVERSIÓN',
    titular = 'CÓNYUGE',
    rfcTercero = 'CUPU800825569',
    tipoPersonaTercero = 'Física',
    localizacionInversion = 'EN MÉXICO',
    rfcLocalizacion = 'PRO840423SG8',
    pais = 'MÉXICO',
    moneda = 'MXN - PESO MEXICANO'
  ) {
    await selectField.fill('[formcontrolname="tipoInversion"]', tipoInversion);
    await t
      .click(Selector('[formcontrolname="subTipoInversion"]'))
      .click(Selector(`[role="listbox"] > .mat-option > .mat-option-text`).nth(0));
    await selectField.fill('[formcontrolname="titular"]', titular);
    await textField.fill('[formGroupName="tercero"] [formcontrolname="nombreRazonSocial"]', textFieldContent, replace);
    await textField.fill('[formGroupName="tercero"] [formcontrolname="rfc"]', rfcTercero, replace);
    await selectField.fill('[formGroupName="tercero"] [formControlName="tipoPersona"]', tipoPersonaTercero);
    await selectField.fill(Selector('[formGroupName="localizacionInversion"]').nth(0), localizacionInversion);
    await textField.fill('[formcontrolname="institucionRazonSocial"]', textFieldContent, replace);
    if (localizacionInversion == 'EN MÉXICO') {
      await textField.fill('[formGroupName="localizacionInversion"] [formcontrolname="rfc"]', rfcLocalizacion, replace);
    } else {
      await selectField.fill('[formGroupName="localizacionInversion"] [formControlName="pais"]', pais);
    }
    await textField.fill(
      '[formGroupName="saldoSituacionActual"] [formcontrolname="valor"]',
      numberFieldContent,
      replace
    );
    await selectField.fill('[formGroupName="saldoSituacionActual"] [formcontrolname="moneda"]', moneda);
    await textField.fill('[formcontrolname="numeroCuentaContrato"]', numberFieldContent, replace);
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
  async modifyProperty(
    replace = true,
    textFieldContent = 'Texto modificado de prueba',
    numberFieldContent = '1234',
    tipoInversion = 'SEGUROS',
    titular = 'CONVIVIENTE',
    rfcTercero = 'PRO840423SG8',
    tipoPersonaTercero = 'Moral',
    localizacionInversion = 'EN EL EXTRANJERO',
    rfcLocalizacion = 'PRO840423SG8',
    pais = 'ALEMANIA',
    moneda = 'MXN - PESO MEXICANO'
  ) {
    await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
    await this.fill(
      replace,
      textFieldContent,
      numberFieldContent,
      tipoInversion,
      titular,
      rfcTercero,
      tipoPersonaTercero,
      localizacionInversion,
      rfcLocalizacion,
      pais,
      moneda
    );
    await this.save();
  }
  async newProperty() {
    if (await Selector('button > span').withText('AGREGAR INVERSIÓN').exists) {
      await t.click(Selector('button > span').withText('AGREGAR INVERSIÓN'));
    } else if (await Selector('button > span').withText('AGREGAR VALOR').exists) {
      await t.click(Selector('button > span').withText('AGREGAR VALOR'));
    }
    await this.fill();
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
const nversiones = new Inversiones();
export default nversiones;
