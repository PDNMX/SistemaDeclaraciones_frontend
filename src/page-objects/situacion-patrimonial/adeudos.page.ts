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
    tipoAdeudo = 'CRÉDITO AUTOMOTRIZ',
    titular = 'CÓNYUGE',
    fechaAdquisicion = '20/02/2015',
    moneda = 'MXN - PESO MEXICANO',
    tipoPersonaTercero = 'Persona Física',
    rfcTercero = 'CUPU800825569',
    tipoPersonaOtorganteCredito = 'Persona Física',
    rfcOtorganteCredito = 'CUPU800825569',
    localizacionAdeudo = 'EN MÉXICO',
    pais = 'ALBANIA'
  ) {
    await selectField.fill('[formcontrolname="tipoAdeudo"]', tipoAdeudo);
    await selectField.fill('[formcontrolname="titular"]', titular);
    await textField.fill('[formcontrolname="numeroCuentaContrato"]', numberFieldContent, replace);
    await textField.fill('[formcontrolname="fechaAdquisicion"]', fechaAdquisicion, replace);
    await textField.fill('[formGroupName="montoOriginal"] [formcontrolname="valor"]', numberFieldContent, replace);
    await selectField.fill('[formGroupName="montoOriginal"] [formcontrolname="moneda"]', moneda);
    await radioButtonInput.select('[formGroupName="tercero"] [formControlName="tipoPersona"]', tipoPersonaTercero);
    await textField.fill('[formGroupName="tercero"] [formcontrolname="nombreRazonSocial"]', textFieldContent, replace);
    await textField.fill('[formGroupName="tercero"] [formcontrolname="rfc"]', rfcTercero, replace);
    await textField.fill(
      '[formGroupName="saldoInsolutoSituacionActual"] [formcontrolname="valor"]',
      numberFieldContent,
      replace
    );
    await selectField.fill('[formGroupName="saldoInsolutoSituacionActual"] [formcontrolname="moneda"]', moneda);
    await radioButtonInput.select(
      '[formGroupName="otorganteCredito"] [formControlName="tipoPersona"]',
      tipoPersonaOtorganteCredito
    );
    await textField.fill(
      '[formGroupName="otorganteCredito"] [formcontrolname="nombreInstitucion"]',
      textFieldContent,
      replace
    );
    await textField.fill('[formGroupName="otorganteCredito"] [formcontrolname="rfc"]', rfcOtorganteCredito, replace);
    await selectField.fill(Selector('[formGroupName="localizacionAdeudo"] mat-form-field').nth(0), localizacionAdeudo);
    if (localizacionAdeudo == 'EN EL EXTRANJERO') {
      await selectField.fill('[formcontrolname="pais"]', pais);
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
  async modifyLiability(
    replace = true,
    textFieldContent = 'Texto modificado de prueba',
    numberFieldContent = '3545',
    tipoAdeudo = 'TARJETA DE CRÉDITO DEPARTAMENTAL',
    titular = 'CONVIVIENTE',
    fechaAdquisicion = '15/05/2018',
    moneda = 'MXN - PESO MEXICANO',
    tipoPersonaTercero = 'Persona Moral',
    rfcTercero = 'PRO840423SG8',
    tipoPersonaOtorganteCredito = 'Persona Moral',
    rfcOtorganteCredito = 'PRO840423SG8',
    localizacionAdeudo = 'EN EL EXTRANJERO',
    pais = 'ANGOLA'
  ) {
    await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
    await this.fill(
      replace,
      textFieldContent,
      numberFieldContent,
      tipoAdeudo,
      titular,
      fechaAdquisicion,
      moneda,
      tipoPersonaTercero,
      rfcTercero,
      tipoPersonaOtorganteCredito,
      rfcOtorganteCredito,
      localizacionAdeudo,
      pais
    );
    await this.save();
  }
  async newLiability() {
    if (await Selector('button > span').withText('AGREGAR ADEUDOS/PASIVOS').exists) {
      await t.click(Selector('button > span').withText('AGREGAR ADEUDOS/PASIVOS'));
    } else if (await Selector('button > span').withText('AGREGAR PASIVO').exists) {
      await t.click(Selector('button > span').withText('AGREGAR PASIVO'));
    }
    await this.fill();
    await this.save();
  }
  async noLiabilities() {
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
