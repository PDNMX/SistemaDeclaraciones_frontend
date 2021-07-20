import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
class DatosGenerales {
  constructor() {}
  async fill(
    replace = true,
    textFieldContent = 'Texto de Prueba',
    numberFieldContent = '7564462543',
    curp = 'AURS931106HSPGZN00',
    rfc = 'CUPU800825',
    homoClave = 'N69',
    email = 'prueba@yopmail.com',
    situacionPersonalEstadoCivil = 'DIVORCIADO (A)',
    regimenMatrimonial = 'SEPARACIÓN DE BIENES',
    paisNacimiento = 'ALBANIA',
    nacionalidad = 'ALBANESA'
  ) {
    await textField.fill('[formcontrolname="nombre"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="primerApellido"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="segundoApellido"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="curp"]', curp, replace);
    await textField.fill('[formcontrolname="rfc"]', rfc, replace);
    await textField.fill('[formcontrolname="homoClave"]', homoClave, replace);
    await textField.fill('[formcontrolname="institucional"]', email, replace);
    await textField.fill('[formcontrolname="personal"]', email, replace);
    await textField.fill('[formcontrolname="casa"]', numberFieldContent, replace);
    await textField.fill('[formcontrolname="celularPersonal"]', numberFieldContent, replace);
    await selectField.fill('[formcontrolname="situacionPersonalEstadoCivil"]', situacionPersonalEstadoCivil);
    if (situacionPersonalEstadoCivil == 'CASADO (A)') {
      await selectField.fill('[formcontrolname="regimenMatrimonial"]', regimenMatrimonial);
    }
    await selectField.fill('[formcontrolname="paisNacimiento"]', paisNacimiento);
    await selectField.fill('[formcontrolname="nacionalidad"]', nacionalidad);
    if (await Selector('button > span').withText('AGREGAR ACLARACIONES / OBSERVACIONES').exists) {
      await t.click(Selector('button > span').withText('AGREGAR ACLARACIONES / OBSERVACIONES'));
    }
    if (await Selector('[formcontrolname="aclaracionesObservaciones"]').exists) {
      await textField.fill('[formcontrolname="aclaracionesObservaciones"]', textFieldContent, replace);
    }
    await this.save();
  }
  async login() {
    await loginPage.submitForm('prueba7@yopmail.com', '0123456789');
  }
  async save() {
    await t.click(Selector('button > span').withText('GUARDAR CAMBIOS'));
    await t.click(Selector('button > span').withText('Guardar'));
  }
}
const datosGenerales = new DatosGenerales();
export default datosGenerales;
