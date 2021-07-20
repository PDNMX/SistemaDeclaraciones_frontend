import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
class Domicilio {
  constructor() {}
  async fill(
    replace = true,
    textFieldContent = 'Texto de Prueba',
    domicilio = 'EN EL EXTRANJERO',
    numeroExterior = '25',
    numeroInterior = '65',
    codigoPostal = '65465',
    entidadFederativa = 'AGUASCALIENTES',
    pais = 'ALBANIA'
  ) {
    await selectField.fill(Selector('mat-form-field').nth(0), domicilio);
    if (domicilio == 'MÉXICO') {
      await this.fillDomicilioMexico(
        replace,
        textFieldContent,
        numeroExterior,
        numeroInterior,
        codigoPostal,
        entidadFederativa
      );
    } else if (domicilio == 'EN EL EXTRANJERO') {
      await this.fillDomicilioExtranjero(replace, textFieldContent, numeroExterior, numeroInterior, codigoPostal, pais);
    }
    if (await Selector('button > span').withText('AGREGAR ACLARACIONES / OBSERVACIONES').exists) {
      await t.click(Selector('button > span').withText('AGREGAR ACLARACIONES / OBSERVACIONES'));
    }
    if (await Selector('[formcontrolname="aclaracionesObservaciones"]').exists) {
      await textField.fill('[formcontrolname="aclaracionesObservaciones"]', textFieldContent, replace);
    }
    await this.save();
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
  async login() {
    await loginPage.submitForm('prueba7@yopmail.com', '0123456789');
  }
  async save() {
    await t.click(Selector('button > span').withText('GUARDAR CAMBIOS'));
    await t.click(Selector('button > span').withText('Guardar'));
  }
}
const domicilio = new Domicilio();
export default domicilio;
