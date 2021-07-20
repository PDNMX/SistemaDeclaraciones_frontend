import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
class DatosCurriculares {
  constructor() {}
  async deleteItem() {
    await t.click(Selector('button > span').withText('ELIMINAR').nth(-1));
    await t.click(Selector('button > span').withText('Eliminar')).wait(3000);
  }
  async fill(
    replace = true,
    textFieldContent = 'Texto de Prueba',
    nivel = 'SECUNDARIA',
    estatus = 'FINALIZADO',
    documentoObtenido = 'BOLETA',
    fechaObtencion = '25/09/1990',
    ubicacion = 'MÉXICO'
  ) {
    await selectField.fill('[formcontrolname="nivel"]', nivel);
    await textField.fill('[formcontrolname="nombre"]', textFieldContent, replace);
    await selectField.fill('[formcontrolname="estatus"]', estatus);
    await textField.fill('[formcontrolname="carreraAreaConocimiento"]', textFieldContent, replace);
    await selectField.fill('[formcontrolname="documentoObtenido"]', documentoObtenido);
    await textField.fill('[formcontrolname="fechaObtencion"]', fechaObtencion, replace);
    await selectField.fill('[formcontrolname="ubicacion"]', ubicacion);

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
  async modifySchool(
    replace = true,
    textFieldContent = 'Texto modificado de prueba',
    nivel = 'BACHILLERATO',
    estatus = 'CURSANDO',
    documentoObtenido = 'CONSTANCIA',
    fechaObtencion = '05/08/1990',
    ubicacion = 'EN EL EXTRANJERO'
  ) {
    if (await Selector('button > span').withText('MODIFICAR').exists) {
      await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
      await this.fill(replace, textFieldContent, nivel, estatus, documentoObtenido, fechaObtencion, ubicacion);
      await this.save();
    }
  }
  async newSchool() {
    if (await Selector('button > span').withText('AGREGAR ESCOLARIDAD').exists) {
      await t.click(Selector('button > span').withText('AGREGAR ESCOLARIDAD'));
    }
    await this.fill();
    await this.save();
  }
  async save() {
    await t.click(Selector('button > span').withText('GUARDAR CAMBIOS'));
  }
}
const datosCurriculares = new DatosCurriculares();
export default datosCurriculares;
