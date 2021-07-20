import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
class ExperienciaLaboral {
  constructor() {}
  async deleteItem() {
    await t.click(Selector('button > span').withText('ELIMINAR').nth(-1));
    await t.click(Selector('button > span').withText('Eliminar')).wait(3000);
  }
  async clickAgregarButton() {
    if (await Selector('button > span').withText('AGREGAR EXPERIENCIA').exists) {
      await t.click(Selector('button > span').withText('AGREGAR EXPERIENCIA'));
    } else if (await Selector('button > span').withText('AGREGAR EMPLEO').exists) {
      await t.click(Selector('button > span').withText('AGREGAR EMPLEO'));
    }
  }

  async fillSectorPrivado(
    replace = false,
    textFieldContent = 'Texto de Prueba',
    rfc = 'PRO840423SG8',
    sector = 'TRANSPORTE',
    fechaIngreso = '15/08/2000',
    fechaEgreso = '21/12/2020',
    ubicacion = 'EN MÉXICO'
  ) {
    await selectField.fill('[formcontrolname="ambitoSector"]', 'PRIVADO');
    await textField.fill('[formcontrolname="nombreEmpresaSociedadAsociacion"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="rfc"]', rfc, replace);
    await textField.fill('[formcontrolname="area"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="puesto"]', textFieldContent, replace);
    await selectField.fill('[formcontrolname="sector"]', sector);
    await textField.fill('[formcontrolname="fechaIngreso"]', fechaIngreso, replace);
    await textField.fill('[formcontrolname="fechaEgreso"]', fechaEgreso, replace);
    await selectField.fill('[formcontrolname="ubicacion"]', ubicacion);
    await this.save();
  }
  async fillSectorPublicoFields(
    replace = false,
    textFieldContent = 'Texto de Prueba',
    nivelOrdenGobierno = 'FEDERAL',
    ambitoPublico = 'EJECUTIVO',
    fechaIngreso = '15/08/2000',
    fechaEgreso = '21/12/2020',
    ubicacion = 'EN EL EXTRANJERO'
  ) {
    await selectField.fill('[formcontrolname="ambitoSector"]', 'PÚBLICO');
    await selectField.fill('[formcontrolname="nivelOrdenGobierno"]', nivelOrdenGobierno);
    await selectField.fill('[formcontrolname="ambitoPublico"]', ambitoPublico);
    await textField.fill('[formcontrolname="nombreEntePublico"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="areaAdscripcion"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="empleoCargoComision"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="funcionPrincipal"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="fechaIngreso"]', fechaIngreso, replace);
    await textField.fill('[formcontrolname="fechaEgreso"]', fechaEgreso, replace);
    await selectField.fill('[formcontrolname="ubicacion"]', ubicacion);
    await this.save();
  }
  async login() {
    await loginPage.submitForm('prueba7@yopmail.com', '0123456789');
  }
  async modifyPublicItem() {
    await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
    await this.fillSectorPublicoFields(
      true,
      'Texto modificado de Prueba',
      'ESTATAL',
      'JUDICIAL',
      '10/04/2000',
      '15/08/2020',
      'EN MÉXICO'
    );
  }
  async modifyPrivateItem() {
    await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
    await this.fillSectorPrivado(
      true,
      'Texto modificado de Prueba',
      'CPM110719SG3',
      'MINERÍA',
      '10/04/2000',
      '15/08/2020',
      'EN EL EXTRANJERO'
    );
  }
  async noneItem() {
    if (await Selector('button > span').withText('NINGUNO').exists) {
      await t.click(Selector('button > span').withText('NINGUNO'));
    }
  }
  async sectorPublico() {
    await this.clickAgregarButton();
    await this.fillSectorPublicoFields();
  }
  async sectorPrivado() {
    await this.clickAgregarButton();
    await this.fillSectorPrivado();
  }
  async save() {
    await t.click(Selector('button > span').withText('GUARDAR CAMBIOS'));
  }
}
const experienciaLaboral = new ExperienciaLaboral();
export default experienciaLaboral;
