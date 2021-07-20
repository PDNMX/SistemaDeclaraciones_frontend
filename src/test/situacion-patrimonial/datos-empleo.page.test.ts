import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import datosEmpleo from '../../page-objects/situacion-patrimonial/datos-empleo.page';

fixture`situacion patrimonial`.page`${environment.pageUrl}/inicial/situacion-patrimonial/datos-empleo`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test('fill form', async (t) => {
  await datosEmpleo.login();
  await datosEmpleo.fill();
});

test('modify', async (t) => {
  await datosEmpleo.login();
  await datosEmpleo.fill(
    true,
    'Texto modificado de prueba',
    'ESTATAL',
    'JUDICIAL',
    '16/01/2020',
    '5582342123',
    '321',
    'EN EL EXTRANJERO',
    '36',
    '56',
    '63864',
    'COLIMA',
    'ARMENIA'
  );
});
