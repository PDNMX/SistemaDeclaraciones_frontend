import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
import radioButtonInput from '../general-fields/radio-button';
class Representaciones {
  constructor() {}
  async deleteItem() {
    await t.click(Selector('button > span').withText('ELIMINAR').nth(-1));
    await t.click(Selector('button > span').withText('Eliminar')).wait(3000);
  }

  async fill(
    replace = false,
    textFieldContent = 'Texto de Prueba',
    numberFieldContent = '7564',
    tipoRelacion = 'PAREJA',
    tipoRepresentacion = 'REPRESENTANTE',
    tipoPersonaTercero = 'Persona Física',
    rfcTercero = 'CUPU800825569',
    recibeRemuneracion = 'Si',
    fechaInicioRepresentacion = '07/12/2019',
    ubicacion = 'En México',
    entidadFederativa = 'AGUASCALIENTES',
    pais = 'ALBANIA',
    sector = 'MINERÍA'
  ) {
    await selectField.fill('[formControlName="tipoRelacion"]', tipoRelacion);
    await selectField.fill('[formControlName="tipoRepresentacion"]', tipoRepresentacion);
    await radioButtonInput.select('[formControlName="tipoPersona"]', tipoPersonaTercero);
    await textField.fill('[formcontrolname="nombreRazonSocial"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="rfc"]', rfcTercero, replace);
    await radioButtonInput.select('[formControlName="recibeRemuneracion"]', recibeRemuneracion);
    if (recibeRemuneracion == 'Si') {
      await textField.fill('[formGroupName="montoMensual"] [formcontrolname="valor"]', numberFieldContent, replace);
    }
    await textField.fill('[formcontrolname="fechaInicioRepresentacion"]', fechaInicioRepresentacion, replace);
    await selectField.fill(Selector('[formGroupName="ubicacion"] mat-select').nth(0), ubicacion);
    if (ubicacion == 'En México') {
      await selectField.fill('[formControlName="entidadFederativa"]', entidadFederativa);
    } else if (ubicacion == 'En el extranjero') {
      await selectField.fill('[formControlName="pais"]', pais);
    }
    await selectField.fill('[formControlName="sector"]', sector);
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
  async modifyRepresentation(
    replace = true,
    textFieldContent = 'Texto modificado de prueba',
    numberFieldContent = '3545',
    tipoRelacion = 'DEPENDIENTE ECONOMICO',
    tipoRepresentacion = 'REPRESENTADO',
    tipoPersonaTercero = 'Persona Física',
    rfcTercero = 'CUPU800825569',
    recibeRemuneracion = 'No',
    fechaInicioRepresentacion = '17/02/2018',
    ubicacion = 'En el extranjero',
    entidadFederativa = 'CAMPECHE',
    pais = 'ALBANIA',
    sector = 'CONSTRUCCIÓN'
  ) {
    if (await Selector('button > span').withText('MODIFICAR').exists) {
      await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
      await this.fill(
        replace,
        textFieldContent,
        numberFieldContent,
        tipoRelacion,
        tipoRepresentacion,
        tipoPersonaTercero,
        rfcTercero,
        recibeRemuneracion,
        fechaInicioRepresentacion,
        ubicacion,
        entidadFederativa,
        pais,
        sector
      );
      await this.save();
    }
  }
  async newRepresentation() {
    if (await Selector('button > span').withText('AGREGAR REPRESENTACIÓN').exists) {
      await t.click(Selector('button > span').withText('AGREGAR REPRESENTACIÓN'));
    }
    await this.fill();
    await this.save();
  }
  async noRepresentation() {
    if (await Selector('button > span').withText('NINGUNO').exists) {
      await t.click(Selector('button > span').withText('NINGUNO')).wait(3000);
    }
  }
  async save() {
    await t.click(Selector('button > span').withText('GUARDAR CAMBIOS'));
  }
}
const representacion = new Representaciones();
export default representacion;
