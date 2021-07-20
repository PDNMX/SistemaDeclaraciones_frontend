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
    numberFieldContent = '7564',
    tipoOperacion = 'AGREGAR',
    tipoBeneficio = 'SORTEO',
    beneficiarios = ['DECLARANTE'],
    tipoPersonaOtorgante = 'Persona Física',
    rfcOtorgante = 'CUPU800825569',
    formaRecepcion = 'MONETARIO',
    moneda = 'MXN - PESO MEXICANO',
    sector = 'MINERÍA'
  ) {
    await selectField.fill('[formControlName="tipoOperacion"]', tipoOperacion);
    await selectField.fill('[formControlName="tipoBeneficio"]', tipoBeneficio);
    await t.click(Selector('[formControlName="beneficiario"]'));
    for (const beneficiario of beneficiarios) {
      await t.click(Selector(`[role="listbox"] > .mat-option > .mat-option-text`).withText(beneficiario));
    }
    await t.pressKey('esc');
    await radioButtonInput.select('[formGroupName="otorgante"] [formControlName="tipoPersona"]', tipoPersonaOtorgante);
    await textField.fill(
      '[formGroupName="otorgante"] [formcontrolname="nombreRazonSocial"]',
      textFieldContent,
      replace
    );
    await textField.fill('[formGroupName="otorgante"] [formcontrolname="rfc"]', rfcOtorgante, replace);
    await selectField.fill('[formControlName="formaRecepcion"]', formaRecepcion);
    if (formaRecepcion == 'ESPECIE') {
      await textField.fill('[formcontrolname="especifiqueBeneficio"]', textFieldContent, replace);
    }
    await textField.fill(
      '[formGroupName="montoMensualAproximado"] [formcontrolname="valor"]',
      numberFieldContent,
      replace
    );
    await selectField.fill('[formGroupName="montoMensualAproximado"] [formcontrolname="moneda"]', moneda);
    await selectField.fill('[formControlName="sector"]', sector);
  }
  async login() {
    await loginPage.submitForm('prueba7@yopmail.com', '0123456789');
  }
  async modifyProfit(
    replace = true,
    textFieldContent = 'Texto modificado de prueba',
    numberFieldContent = '3545',
    tipoOperacion = 'MODIFICAR',
    tipoBeneficio = 'SORTEO',
    beneficiarios = ['CONVIVIENTE'],
    tipoPersonaOtorgante = 'Persona Física',
    rfcOtorgante = 'CUPU800825569',
    formaRecepcion = 'ESPECIE',
    moneda = 'MXN - PESO MEXICANO',
    sector = 'CONSTRUCCIÓN'
  ) {
    if (await Selector('button > span').withText('MODIFICAR').exists) {
      await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
      await t.click(Selector('button > span').withText('LIMPIAR FORMULARIO'));
      await this.fill(
        replace,
        textFieldContent,
        numberFieldContent,
        tipoOperacion,
        tipoBeneficio,
        beneficiarios,
        tipoPersonaOtorgante,
        rfcOtorgante,
        formaRecepcion,
        moneda,
        sector
      );
      await this.save();
    }
  }
  async newProfit() {
    if (await Selector('button > span').withText('AGREGAR BENEFICIO').exists) {
      await t.click(Selector('button > span').withText('AGREGAR BENEFICIO'));
    }
    await this.fill();
    await this.save();
  }
  async noProfits() {
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
