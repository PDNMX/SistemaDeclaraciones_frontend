import { Selector, t } from 'testcafe';
import loginPage from '../login.page';
import selectField from '../general-fields/select-fields';
import textField from '../general-fields/text-fields';
import radioButtonInput from '../general-fields/radio-button';
class IngresosNetos {
  constructor() {}
  async deleteSections() {
    await textField.fill('[formGroupName="remuneracionNetaCargoPublico"] [formControlName="valor"]', '0', true);
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
    /* enajenación de bienes */
    while (await Selector('[formGroupName="enajenacionBienes"] button span').withText('Eliminar').exists) {
      await t
        .click(Selector('[formGroupName="enajenacionBienes"] button span').withText('Eliminar').nth(-1))
        .click(Selector('.mat-dialog-container button span').withText('Eliminar'));
    }
    /* otros ingresos */
    while (await Selector('[formGroupName="otrosIngresos"] button span').withText('Eliminar').exists) {
      await t
        .click(Selector('[formGroupName="otrosIngresos"] button span').withText('Eliminar').nth(-1))
        .click(Selector('.mat-dialog-container button span').withText('Eliminar'));
    }
    /* ingresos netos de la pareja */
    await textField.fill('[formGroupName="ingresoNetoAnualParejaDependiente"] [formControlName="valor"]', '0', true);
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
    servidorPublicoAnioAnterior = 'Si',
    replace = true,
    textFieldContent = 'Texto de Prueba',
    fechaIngreso = '17/03/2009',
    fechaConclusion = '20/05/2020',
    valorMonetario = '12345',
    tipoInstrumento = 'BONOS',
    tipoBienEnajenado = 'MUEBLE'
  ) {
    await radioButtonInput.select('[formControlName="servidorPublicoAnioAnterior"]', servidorPublicoAnioAnterior);
    if (servidorPublicoAnioAnterior == 'Si') {
      await textField.fill(Selector('[formcontrolname="fechaIngreso"]'), fechaIngreso, replace);
      await textField.fill(Selector('[formcontrolname="fechaConclusion"]'), fechaConclusion, replace);
      await textField.fill(
        '[formGroupName="remuneracionNetaCargoPublico"] [formControlName="valor"]',
        valorMonetario,
        true
      );
      /* mid sections */
      await this.fillMidSections(replace, textFieldContent, valorMonetario, tipoInstrumento, tipoBienEnajenado);
      /* ingresos netos de la pareja */
      await textField.fill(
        '[formGroupName="ingresoNetoAnualParejaDependiente"] [formControlName="valor"]',
        valorMonetario,
        true
      );
      /* aclaraciones y observaciones */
      if (await Selector('button span').withText('AGREGAR ACLARACIONES / OBSERVACIONES').exists) {
        await t.click(Selector('button span').withText('AGREGAR ACLARACIONES / OBSERVACIONES'));
      }
      await textField.fill('[formControlName="aclaracionesObservaciones"]', textFieldContent, replace);
    }
    await this.save();
  }
  async fillMidSections(
    replace = true,
    textFieldContent = 'Texto de Prueba',
    valorMonetario = '65734',
    tipoInstrumento = 'BONOS',
    tipoBienEnajenado = 'MUEBLE'
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
    /* enajenación de bienes */
    await t.click(Selector('[formGroupName="enajenacionBienes"] button span').withText('Agregar'));
    await textField.fill(
      Selector('[formGroupName="enajenacionBienes"] [formGroupName="remuneracion"] [formControlName="valor"]').nth(-1),
      valorMonetario,
      true
    );
    await selectField.fill(
      Selector('[formGroupName="enajenacionBienes"] [formControlName="tipoBienEnajenado"]').nth(-1),
      tipoBienEnajenado
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
