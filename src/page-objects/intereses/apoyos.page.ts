import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
class Apoyos {
  constructor() {}
  async deleteItem() {
    await t.click(Selector('button > span').withText('ELIMINAR').nth(-1));
    await t.click(Selector('button > span').withText('Eliminar')).wait(3000);
  }

  async fill(
    replace = false,
    textFieldContent = 'Texto de Prueba',
    numberFieldContent = '7564',
    beneficiarioPrograma = 'CÓNYUGE',
    tipoPersona = 'FÍSICA',
    nivelOrdenGobierno = 'FEDERAL',
    tipoApoyo = 'SUBSIDIO',
    formaRecepcion = 'MONETARIO'
  ) {
    await selectField.fill('[formControlName="beneficiarioPrograma"]', beneficiarioPrograma);
    await selectField.fill('[formControlName="tipoPersona"]', tipoPersona);
    await textField.fill('[formcontrolname="nombrePrograma"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="institucionOtorgante"]', textFieldContent, replace);
    await selectField.fill('[formControlName="nivelOrdenGobierno"]', nivelOrdenGobierno);
    await selectField.fill('[formControlName="tipoApoyo"]', tipoApoyo);
    await selectField.fill('[formControlName="formaRecepcion"]', formaRecepcion);
    await textField.fill('[formGroupName="montoApoyoMensual"] [formcontrolname="valor"]', numberFieldContent, replace);
    await textField.fill('[formcontrolname="especifiqueApoyo"]', textFieldContent, replace);
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
  async modifySupport(
    replace = true,
    textFieldContent = 'Texto modificado de prueba',
    numberFieldContent = '3545',
    beneficiarioPrograma = 'CONVIVIENTE',
    tipoPersona = 'MORAL',
    nivelOrdenGobierno = 'ESTATAL',
    tipoApoyo = 'SERVICIO',
    formaRecepcion = 'ESPECIE'
  ) {
    if (await Selector('button > span').withText('MODIFICAR').exists) {
      await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
      await this.fill(
        replace,
        textFieldContent,
        numberFieldContent,
        beneficiarioPrograma,
        tipoPersona,
        nivelOrdenGobierno,
        tipoApoyo,
        formaRecepcion
      );
      await this.save();
    }
  }
  async newSupport() {
    if (await Selector('button > span').withText('AGREGAR APOYO O BENEFICIO').exists) {
      await t.click(Selector('button > span').withText('AGREGAR APOYO O BENEFICIO'));
    } else if (await Selector('button > span').withText('AGREGAR APOYO').exists) {
      await t.click(Selector('button > span').withText('AGREGAR APOYO'));
    }
    await this.fill();
    await this.save();
  }
  async noSupport() {
    if (await Selector('button > span').withText('NINGUNO').exists) {
      await t.click(Selector('button > span').withText('NINGUNO')).wait(3000);
    }
  }
  async save() {
    await t.click(Selector('button > span').withText('GUARDAR CAMBIOS'));
  }
}
const apoyo = new Apoyos();
export default apoyo;
