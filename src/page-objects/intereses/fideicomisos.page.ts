import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
import radioButtonInput from '../general-fields/radio-button';
class Benedicios {
  constructor() {}
  async deleteItem() {
    await t.click(Selector('button > span').withText('ELIMINAR').nth(-1));
    await t.click(Selector('button > span').withText('Eliminar')).wait(3000);
  }

  async fill(
    replace = false,
    textFieldContent = 'Texto de Prueba',
    tipoOperacion = 'AGREGAR',
    tipoRelacion = 'PAREJA',
    tipoFideicomiso = 'PUBLICO',
    tipoParticipacion = 'FIDEICOMITENTE',
    rfcFideicomiso = 'PRO840423SG8',
    tipoPersonaFideicomitente = 'Persona Moral',
    rfcFideicomitente = 'PRO840423SG8',
    rfcFiduciario = 'PRO840423SG8',
    tipoPersonaFideicomisario = 'Persona Moral',
    rfcFideicomisario = 'PRO840423SG8',
    sector = 'MINERÍA',
    extranjero = 'En México'
  ) {
    await selectField.fill('[formControlName="tipoOperacion"]', tipoOperacion);
    await selectField.fill('[formControlName="tipoRelacion"]', tipoRelacion);
    await selectField.fill('[formControlName="tipoFideicomiso"]', tipoFideicomiso);
    await selectField.fill('[formControlName="tipoParticipacion"]', tipoParticipacion);
    await textField.fill('[formcontrolname="rfcFideicomiso"]', rfcFideicomiso, replace);
    if (tipoParticipacion == 'FIDEICOMITENTE') {
      await radioButtonInput.select(
        '[formGroupName="fideicomitente"] [formControlName="tipoPersona"]',
        tipoPersonaFideicomitente
      );
      await textField.fill(
        '[formGroupName="fideicomitente"] [formcontrolname="nombreRazonSocial"]',
        textFieldContent,
        replace
      );
      await textField.fill('[formGroupName="fideicomitente"] [formcontrolname="rfc"]', rfcFideicomitente, replace);
    } else if (tipoParticipacion == 'FIDUCIARIO') {
      await textField.fill(
        '[formGroupName="fiduciario"] [formcontrolname="nombreRazonSocial"]',
        textFieldContent,
        replace
      );
      await textField.fill('[formGroupName="fiduciario"] [formcontrolname="rfc"]', rfcFiduciario, replace);
    } else if (tipoParticipacion == 'FIDEICOMISARIO') {
      await radioButtonInput.select(
        '[formGroupName="fideicomisario"] [formControlName="tipoPersona"]',
        tipoPersonaFideicomisario
      );
      await textField.fill(
        '[formGroupName="fideicomisario"] [formcontrolname="nombreRazonSocial"]',
        textFieldContent,
        replace
      );
      await textField.fill('[formGroupName="fideicomisario"] [formcontrolname="rfc"]', rfcFideicomisario, replace);
    }
    await selectField.fill('[formControlName="sector"]', sector);
    await selectField.fill('[formControlName="extranjero"]', extranjero);
  }
  async login() {
    await loginPage.submitForm('prueba7@yopmail.com', '0123456789');
  }
  async modifyTrust(
    replace = true,
    textFieldContent = 'Texto modificado de prueba',
    tipoOperacion = 'MODIFICAR',
    tipoRelacion = 'DECLARANTE',
    tipoFideicomiso = 'MIXTO',
    tipoParticipacion = 'FIDEICOMISARIO',
    rfcFideicomiso = 'PRO840423SG8',
    tipoPersonaFideicomitente = 'Persona Física',
    rfcFideicomitente = 'CUPU800825569',
    rfcFiduciario = 'CUPU800825569',
    tipoPersonaFideicomisario = 'Persona Física',
    rfcFideicomisario = 'CUPU800825569',
    sector = 'CONSTRUCCIÓN',
    extranjero = 'En el extranjero'
  ) {
    if (await Selector('button > span').withText('MODIFICAR').exists) {
      await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
      await t.click(Selector('button > span').withText('LIMPIAR FORMULARIO'));
      await this.fill(
        replace,
        textFieldContent,
        tipoOperacion,
        tipoRelacion,
        tipoFideicomiso,
        tipoParticipacion,
        rfcFideicomiso,
        tipoPersonaFideicomitente,
        rfcFideicomitente,
        rfcFiduciario,
        tipoPersonaFideicomisario,
        rfcFideicomisario,
        sector,
        extranjero
      );
      await this.save();
    }
  }
  async newTrust() {
    if (await Selector('button > span').withText('AGREGAR FIDEICOMISO').exists) {
      await t.click(Selector('button > span').withText('AGREGAR FIDEICOMISO'));
    }
    await this.fill();
    await this.save();
  }
  async noTrusts() {
    if (await Selector('button > span').withText('NINGUNO').exists) {
      await t.click(Selector('button > span').withText('NINGUNO'));
    }
  }
  async save() {
    await t.click(Selector('button > span').withText('GUARDAR CAMBIOS'));
  }
}
const beneficio = new Benedicios();
export default beneficio;
