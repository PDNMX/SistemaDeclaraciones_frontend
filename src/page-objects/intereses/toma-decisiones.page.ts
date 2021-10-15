import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
import radioButtonInput from '../general-fields/radio-button';
class Participacion {
  constructor() {}
  async deleteItem() {
    await t.click(Selector('button > span').withText('ELIMINAR').nth(-1));
    await t.click(Selector('button > span').withText('Eliminar')).wait(3000);
  }

  async fill(
    replace = false,
    textFieldContent = 'Texto de Prueba',
    numberFieldContent = '7564',
    tipoRelacion = 'Declarante',
    tipoInstitucion = 'ORGANIZACIONES BENÉFICAS',
    rfc = 'CUPU800825569',
    fechaInicioParticipacion = '04/03/2020',
    recibeRemuneracion = 'No',
    ubicacion = 'En México',
    entidadFederativa = 'AGUASCALIENTES',
    pais = 'ALBANIA'
  ) {
    await selectField.fill('[formControlName="tipoRelacion"]', tipoRelacion);
    await selectField.fill('[formControlName="tipoInstitucion"]', tipoInstitucion);
    await textField.fill('[formcontrolname="nombreInstitucion"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="rfc"]', rfc, replace);
    await textField.fill('[formcontrolname="puestoRol"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="fechaInicioParticipacion"]', fechaInicioParticipacion, replace);
    await radioButtonInput.select('[formControlName="recibeRemuneracion"]', recibeRemuneracion);
    if (recibeRemuneracion == 'Si') {
      await textField.fill('[formGroupName="montoMensual"] [formcontrolname="valor"]', numberFieldContent, replace);
    }
    await selectField.fill(Selector('[formGroupName="ubicacion"] mat-form-field').nth(0), ubicacion);
    if (ubicacion == 'En México') {
      await selectField.fill('[formcontrolname="entidadFederativa"]', entidadFederativa);
    } else if (ubicacion == 'En el extranjero') {
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
  async modifyParticipation(
    replace = true,
    textFieldContent = 'Texto modificado de prueba',
    numberFieldContent = '3545',
    tipoRelacion = 'Pareja',
    tipoInstitucion = 'PARTIDOS POLÍTICOS',
    rfc = 'MRGB800825569',
    fechaInicioParticipacion = '12/05/2021',
    recibeRemuneracion = 'No',
    ubicacion = 'En México',
    entidadFederativa = 'COLIMA',
    pais = 'ARMENIA'
  ) {
    if (await Selector('button > span').withText('MODIFICAR').exists) {
      await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
      await this.fill(
        replace,
        textFieldContent,
        numberFieldContent,
        tipoRelacion,
        tipoInstitucion,
        rfc,
        fechaInicioParticipacion,
        recibeRemuneracion,
        ubicacion,
        entidadFederativa,
        pais
      );
      await this.save();
    }
  }
  async newParticipation() {
    if (await Selector('button > span').withText('AGREGAR PARTICIPACIÓN').exists) {
      await t.click(Selector('button > span').withText('AGREGAR PARTICIPACIÓN'));
    }
    await this.fill();
    await this.save();
  }
  async noParticipation() {
    if (await Selector('button > span').withText('NINGUNO').exists) {
      await t.click(Selector('button > span').withText('NINGUNO')).wait(3000);
    }
  }
  async save() {
    await t.click(Selector('button > span').withText('GUARDAR CAMBIOS'));
  }
}
const participacion = new Participacion();
export default participacion;
