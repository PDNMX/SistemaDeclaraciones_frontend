import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
class IngresosNetos {
  constructor() {}
  async deleteSections() {
    await textField.fill('[formGroupName="remuneracionMensualCargoPublico"] [formControlName="valor"]', '0', true);
    /* actividad industrial*/
    while (
      await Selector('[formGroupName="actividadIndustrialComercialEmpresarial"] button span').withText('Eliminar')
        .exists
    ) {
      await t
        .click(
          Selector('[formGroupName="actividadIndustrialComercialEmpresarial"] button span').withText('Eliminar').nth(-1)
        )
        .click(Selector('.mat-dialog-container button span').withText('Eliminar'));
    }
    /* actividad financiera*/
    while (await Selector('[formGroupName="actividadFinanciera"] button span').withText('Eliminar').exists) {
      await t
        .click(Selector('[formGroupName="actividadFinanciera"] button span').withText('Eliminar').nth(-1))
        .click(Selector('.mat-dialog-container button span').withText('Eliminar'));
    }
    /* servicios profesionales */
    while (await Selector('[formGroupName="serviciosProfesionales"] button span').withText('Eliminar').exists) {
      await t
        .click(Selector('[formGroupName="serviciosProfesionales"] button span').withText('Eliminar').nth(-1))
        .click(Selector('.mat-dialog-container button span').withText('Eliminar'));
    }
    /* otros ingresos */
    while (await Selector('[formGroupName="otrosIngresos"] button span').withText('Eliminar').exists) {
      await t
        .click(Selector('[formGroupName="otrosIngresos"] button span').withText('Eliminar').nth(-1))
        .click(Selector('.mat-dialog-container button span').withText('Eliminar'));
    }
    /* ingresos netos de la pareja */
    await textField.fill('[formGroupName="ingresoMensualNetoParejaDependiente"] [formControlName="valor"]', '0', true);
    /* aclaraciones y observaciones */
    if (await Selector('button span').withText('CANCELAR').exists) {
      await t.click(Selector('button span').withText('CANCELAR'));
    }
    await this.save();
  }
  async login() {
    await loginPage.submitForm('prueba7@yopmail.com', '0123456789');
  }
  async fill(
    replace = true,
    textFieldContent = 'Texto de Prueba',
    valorMonetario = '12345',
    tipoInstrumento = 'BONOS'
  ) {
    await textField.fill(
      '[formGroupName="remuneracionMensualCargoPublico"] [formControlName="valor"]',
      valorMonetario,
      true
    );
    /* mid sections */
    await this.fillMidSections(replace, textFieldContent, valorMonetario, tipoInstrumento);
    /* ingresos netos de la pareja */
    await textField.fill(
      '[formGroupName="ingresoMensualNetoParejaDependiente"] [formControlName="valor"]',
      valorMonetario,
      true
    );
    /* aclaraciones y observaciones */
    if (await Selector('button span').withText('AGREGAR ACLARACIONES / OBSERVACIONES').exists) {
      await t.click(Selector('button span').withText('AGREGAR ACLARACIONES / OBSERVACIONES'));
    }
    await textField.fill('[formControlName="aclaracionesObservaciones"]', textFieldContent, replace);
    await this.save();
  }
  async fillMidSections(
    replace = true,
    textFieldContent = 'Texto de Prueba',
    valorMonetario = '65734',
    tipoInstrumento = 'BONOS'
  ) {
    /* actividad industrial*/
    await t.click(
      Selector('[formGroupName="actividadIndustrialComercialEmpresarial"] button span').withText('Agregar')
    );
    await textField.fill(
      Selector(
        '[formGroupName="actividadIndustrialComercialEmpresarial"] [formGroupName="remuneracion"] [formControlName="valor"]'
      ).nth(-1),
      valorMonetario,
      true
    );
    await textField.fill(
      Selector('[formGroupName="actividadIndustrialComercialEmpresarial"] [formControlName="nombreRazonSocial"]').nth(
        -1
      ),
      textFieldContent,
      replace
    );
    await textField.fill(
      Selector('[formGroupName="actividadIndustrialComercialEmpresarial"] [formControlName="tipoNegocio"]').nth(-1),
      textFieldContent,
      replace
    );
    /* actividad financiera*/
    await t.click(Selector('[formGroupName="actividadFinanciera"] button span').withText('Agregar'));
    await textField.fill(
      Selector('[formGroupName="actividadFinanciera"] [formGroupName="remuneracion"] [formControlName="valor"]').nth(
        -1
      ),
      valorMonetario,
      true
    );
    await selectField.fill(
      Selector('[formGroupName="actividadFinanciera"] [formControlName="tipoInstrumento"]').nth(-1),
      tipoInstrumento
    );
    /* servicios profesionales */
    await t.click(Selector('[formGroupName="serviciosProfesionales"] button span').withText('Agregar'));
    await textField.fill(
      Selector('[formGroupName="serviciosProfesionales"] [formGroupName="remuneracion"] [formControlName="valor"]').nth(
        -1
      ),
      valorMonetario,
      true
    );
    await textField.fill(
      Selector('[formGroupName="serviciosProfesionales"] [formControlName="tipoServicio"]').nth(-1),
      textFieldContent,
      replace
    );
    /* otros ingresos */
    await t.click(Selector('[formGroupName="otrosIngresos"] button span').withText('Agregar'));
    await textField.fill(
      Selector('[formGroupName="otrosIngresos"] [formGroupName="remuneracion"] [formControlName="valor"]').nth(-1),
      valorMonetario,
      true
    );
    await textField.fill(
      Selector('[formGroupName="otrosIngresos"] [formControlName="tipoIngreso"]').nth(-1),
      textFieldContent,
      replace
    );
  }
  async save() {
    await t
      .click(Selector('button > span').withText('GUARDAR CAMBIOS'))
      .click(Selector('button span').withText('Guardar'))
      .wait(5000);
  }
}
const ingresosNetos = new IngresosNetos();
export default ingresosNetos;
