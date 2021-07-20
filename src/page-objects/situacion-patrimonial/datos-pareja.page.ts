import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
import radioButtonInput from '../general-fields/radio-button';
class DatosPareja {
  constructor() {}
  async deleteItem() {
    await t.click(Selector('button > span').withText('ELIMINAR').nth(-1));
    await t.click(Selector('button > span').withText('Eliminar')).wait(5000);
  }
  async getAgregarButton() {
    if (await Selector('button > span').withText('AGREGAR PAREJA').exists) {
      await t.click(Selector('button > span').withText('AGREGAR PAREJA'));
    }
    if (await Selector('button > span').withText('MODIFICAR').exists) {
      await t.click(Selector('button > span').withText('MODIFICAR'));
    }
  }
  async fill(
    replace = true,
    textFieldContent = 'Texto de Prueba',
    fechaNacimiento = '15/08/2000',
    relacionConDeclarante = 'CONYUGE',
    rfc = 'CUPU800825569',
    curp = 'FEPM890204HASRRN08',
    ubicacion = 'desconocido',
    actividadLaboral = 'publico'
  ) {
    await this.getAgregarButton();
    await textField.fill('[formcontrolname="nombre"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="primerApellido"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="segundoApellido"]', textFieldContent, replace);
    await textField.fill(Selector('[formcontrolname="fechaNacimiento"]'), fechaNacimiento, replace);
    await selectField.fill('[formcontrolname="relacionConDeclarante"]', relacionConDeclarante);
    await textField.fill('[formcontrolname="rfc"]', rfc, replace);
    await radioButtonInput.select('[formControlName="ciudadanoExtranjero"]', 'Sí');
    await textField.fill('[formcontrolname="curp"]', curp, replace);
    await radioButtonInput.select('[formControlName="esDependienteEconomico"]', 'Sí');
    await radioButtonInput.select('[formControlName="habitaDomicilioDeclarante"]', 'No');
    if (ubicacion == 'mexico') {
      await this.fillDomicilioMexico();
    } else if (ubicacion == 'extranjero') {
      await this.fillDomicilioExtranjero();
    } else {
      await this.locationUnknown();
    }
    if (actividadLaboral == 'privado') {
      await this.fillSectorPrivado();
    } else if (actividadLaboral == 'publico') {
      await this.fillSectorPublicoFields();
    } else {
      await this.noWorkActivity();
    }
    await this.save();
  }
  async fillDomicilioExtranjero(
    replace = true,
    textFieldContent = 'Texto de Prueba',
    numeroExterior = '25',
    numeroInterior = '65',
    codigoPostal = '65465',
    pais = 'ALBANIA'
  ) {
    await selectField.fill('[formcontrolname="lugarDondeReside"]', 'EXTRANJERO');
    await textField.fill('[formcontrolname="calle"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="numeroExterior"]', numeroExterior, replace);
    await textField.fill('[formcontrolname="numeroInterior"]', numeroInterior, replace);
    await textField.fill('[formcontrolname="codigoPostal"]', codigoPostal, replace);
    await selectField.fill('[formcontrolname="pais"]', pais);
    await textField.fill('[formcontrolname="estadoProvincia"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="ciudadLocalidad"]', textFieldContent, replace);
  }
  async fillDomicilioMexico(
    replace = true,
    textFieldContent = 'Texto de Prueba',
    numeroExterior = '25',
    numeroInterior = '65',
    codigoPostal = '65465',
    entidadFederativa = 'AGUASCALIENTES'
  ) {
    await selectField.fill('[formcontrolname="lugarDondeReside"]', 'MEXICO');
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
  async fillSectorPrivado(
    replace = true,
    textFieldContent = 'Texto de Prueba',
    rfc = 'PRO840423SG8',
    valor = '15000',
    moneda = 'MXN - PESO MEXICANO',
    sector = 'TRANSPORTE',
    fechaIngreso = '15/08/2000'
  ) {
    await selectField.fill('[formcontrolname="actividadLaboral"]', 'PRIVADO');
    await textField.fill('[formcontrolname="nombreEmpresaSociedadAsociacion"]', textFieldContent, replace);
    await textField.fill('[formGroupName="actividadLaboralSectorPrivadoOtro"] [formcontrolname="rfc"]', rfc, replace);
    await textField.fill('[formcontrolname="empleoCargoComision"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="valor"]', valor, true);
    await selectField.fill('[formcontrolname="moneda"]', moneda);
    await textField.fill(Selector('[formcontrolname="fechaIngreso"]'), fechaIngreso, replace);
    await radioButtonInput.select('[formControlName="proveedorContratistaGobierno"]', 'Sí');
    await selectField.fill('[formcontrolname="sector"]', sector);
  }
  async fillSectorPublicoFields(
    replace = true,
    textFieldContent = 'Texto de Prueba',
    nivelOrdenGobierno = 'FEDERAL',
    ambitoPublico = 'EJECUTIVO',
    valor = '15000',
    moneda = 'MXN - PESO MEXICANO',
    fechaIngreso = '15/08/2000'
  ) {
    await selectField.fill('[formcontrolname="actividadLaboral"]', 'PÚBLICO');
    await selectField.fill('[formcontrolname="nivelOrdenGobierno"]', nivelOrdenGobierno);
    await selectField.fill('[formcontrolname="ambitoPublico"]', ambitoPublico);
    await textField.fill('[formcontrolname="nombreEntePublico"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="areaAdscripcion"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="empleoCargoComision"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="valor"]', valor, true);
    await selectField.fill('[formcontrolname="moneda"]', moneda);
    await textField.fill('[formcontrolname="funcionPrincipal"]', textFieldContent, replace);
    await t.typeText(Selector('[formcontrolname="fechaIngreso"]'), fechaIngreso, { replace: replace });
  }
  async locationUnknown() {
    await selectField.fill('[formcontrolname="lugarDondeReside"]', 'SE DESCONOCE');
  }
  async login() {
    await loginPage.submitForm('prueba7@yopmail.com', '0123456789');
  }
  async modifyFirstSection(
    replace = true,
    textFieldContent = 'Texto modificado de Prueba',
    fechaNacimiento = '13/04/2010',
    relacionConDeclarante = 'CONCUBINA CONCUBINARIO UNION LIBRE',
    rfc = 'RTES800825683',
    curp = 'AUMV950427HGRBJN07'
  ) {
    await this.getAgregarButton();
    await textField.fill('[formcontrolname="nombre"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="primerApellido"]', textFieldContent, replace);
    await textField.fill('[formcontrolname="segundoApellido"]', textFieldContent, replace);
    await textField.fill(Selector('[formcontrolname="fechaNacimiento"]'), fechaNacimiento, replace);
    await selectField.fill('[formcontrolname="relacionConDeclarante"]', relacionConDeclarante);
    await textField.fill('[formcontrolname="rfc"]', rfc, replace);
    await radioButtonInput.select('[formControlName="ciudadanoExtranjero"]', 'Sí');
    await textField.fill('[formcontrolname="curp"]', curp, replace);
    await radioButtonInput.select('[formControlName="esDependienteEconomico"]', 'Sí');
    await radioButtonInput.select('[formControlName="habitaDomicilioDeclarante"]', 'No');
    await this.save();
  }
  async modifyDomicilioExtranjeroSection() {
    await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
    await this.fillDomicilioExtranjero(true, 'Texto modificado de Prueba', '75', '98', '23453', 'ALBANIA');
    await this.save();
  }
  async modifyDomicilioMexicoSection() {
    await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
    await this.fillDomicilioMexico(true, 'Texto modificado de Prueba', '75', '98', '23453', 'CAMPECHE');
    await this.save();
  }
  async modifyPublicSection() {
    await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
    await this.fillSectorPublicoFields(
      true,
      'Texto modificado de Prueba',
      'ESTATAL',
      'JUDICIAL',
      '14530',
      'AFN - AFGANI AFGANO',
      '20/12/2020'
    );
    await this.save();
  }
  async modifyPrivateSection() {
    await t.click(Selector('button > span').withText('MODIFICAR').nth(-1));
    await this.fillSectorPrivado(
      true,
      'Texto modificado de Prueba',
      'CPM110719SG3',
      '15670',
      'MXN - PESO MEXICANO',
      'MINERÍA',
      '15/08/2020'
    );
    await this.save();
  }
  async noCouple() {
    if (await Selector('button > span').withText('NINGUNA').exists) {
      await t.click(Selector('button > span').withText('NINGUNA')).wait(5000);
    }
  }
  async noWorkActivity() {
    await selectField.fill('[formcontrolname="actividadLaboral"]', 'NINGUNO');
  }
  async save() {
    await t
      .click(Selector('button > span').withText('GUARDAR CAMBIOS'))
      .click(Selector('button > span').withText('Guardar'))
      .wait(5000);
  }
}
const datosPareja = new DatosPareja();
export default datosPareja;
