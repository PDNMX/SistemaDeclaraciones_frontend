import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
import radioButtonInput from '../general-fields/radio-button';
class BienesMuebles {
  constructor() {}
  async deleteItem() {
    await t.click(Selector('button > span').withText('ELIMINAR').nth(-1));
    await t.click(Selector('button > span').withText('Eliminar')).wait(3000);
  }

  async fill(
    replace = false,
    textFieldContent = 'Texto de Prueba',
    numberFieldContent = '2020',
    tipoBien = 'JOYAS',
    titular = 'CÓNYUGE',
    tipoPersonaTercero = 'Persona Física',
    rfcTercero = 'CUPU800825569',
    formaAdquisicion = 'CESIÓN',
    formaPago = 'CREDITO',
    relacionTransmisión = 'BISNIETO(A)',
    rfcTransmisor = 'CUPU800825569',
    tipoPersonaTransmisor = 'Física',
    moneda = 'MXN - PESO MEXICANO',
    fechaAdquisicion = '20/02/2015'
  ) {
    await selectField.fill('[formcontrolname="tipoBien"]', tipoBien);
    await selectField.fill('[formcontrolname="titular"]', titular);
    await radioButtonInput.select('[formGroupName="tercero"] [formControlName="tipoPersona"]', tipoPersonaTercero);
    await textField.fill('[formGroupName="tercero"] [formcontrolname="nombreRazonSocial"]', textFieldContent, replace);
    await textField.fill('[formGroupName="tercero"] [formcontrolname="rfc"]', rfcTercero, replace);
    await selectField.fill('[formcontrolname="formaAdquisicion"]', formaAdquisicion);
    await selectField.fill('[formcontrolname="formaPago"]', formaPago);
    await selectField.fill('[formGroupName="transmisor"] [formcontrolname="relacion"]', relacionTransmisión);
    await textField.fill(
      '[formGroupName="transmisor"] [formcontrolname="nombreRazonSocial"]',
      textFieldContent,
      replace
    );
    await textField.fill('[formGroupName="transmisor"] [formcontrolname="rfc"]', rfcTransmisor, replace);
    await selectField.fill('[formGroupName="transmisor"] [formControlName="tipoPersona"]', tipoPersonaTransmisor);
    await textField.fill('[formcontrolname="descripcionGeneralBien"]', textFieldContent, replace);
    await textField.fill('[formGroupName="valorAdquisicion"] [formcontrolname="valor"]', numberFieldContent, replace);
    await selectField.fill('[formGroupName="valorAdquisicion"] [formcontrolname="moneda"]', moneda);
    await textField.fill('[formcontrolname="fechaAdquisicion"]', fechaAdquisicion, replace);
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
  async modifyProperty(
    replace = true,
    textFieldContent = 'Texto modificado de prueba',
    numberFieldContent = '2019',
    tipoBien = 'COLECCIONES',
    titular = 'CONVIVIENTE',
    tipoPersonaTercero = 'Persona Moral',
    rfcTercero = 'PRO840423SG8',
    formaAdquisicion = 'COMPRAVENTA',
    formaPago = 'CREDITO',
    relacionTransmisión = 'CONCUBINA O CONCUBINARIO',
    rfcTransmisor = 'PRO840423SG8',
    tipoPersonaTransmisor = 'Moral',
    moneda = 'MXN - PESO MEXICANO',
    fechaAdquisicion = '15/05/2018'
  ) {
    await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
    await this.fill(
      replace,
      textFieldContent,
      numberFieldContent,
      tipoBien,
      titular,
      tipoPersonaTercero,
      rfcTercero,
      formaAdquisicion,
      formaPago,
      relacionTransmisión,
      rfcTransmisor,
      tipoPersonaTransmisor,
      moneda,
      fechaAdquisicion
    );
    await this.save();
  }
  async newProperty() {
    await t.click(Selector('button > span').withText('AGREGAR BIEN MUEBLE'));
    await this.fill();
    await this.save();
  }
  async noProperty() {
    if (await Selector('button > span').withText('NINGUNO').exists) {
      await t.click(Selector('button > span').withText('NINGUNO')).wait(3000);
    }
  }
  async save() {
    await t.click(Selector('button > span').withText('GUARDAR CAMBIOS'));
  }
}
const bienesMuebles = new BienesMuebles();
export default bienesMuebles;
