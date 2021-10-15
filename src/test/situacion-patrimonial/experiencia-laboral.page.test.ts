import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import experienciaLaboral from '../../page-objects/situacion-patrimonial/experiencia-laboral.page';

fixture`Book Collection`.page`${environment.pageUrl}/inicial/situacion-patrimonial/experiencia-laboral`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test('None item', async (t) => {
  await experienciaLaboral.login();
  await experienciaLaboral.noneItem();
});

test('fill public sector', async (t) => {
  await experienciaLaboral.login();
  await experienciaLaboral.sectorPublico();
});

test('fill private sector', async (t) => {
  await experienciaLaboral.login();
  await experienciaLaboral.sectorPrivado();
});

test('Modify last Item with private information', async (t) => {
  await experienciaLaboral.login();
  await experienciaLaboral.modifyPrivateItem();
});

test('Modify last Item with public information', async (t) => {
  await experienciaLaboral.login();
  await experienciaLaboral.modifyPublicItem();
});

test('Delete last Item', async (t) => {
  await experienciaLaboral.login();
  await experienciaLaboral.deleteItem();
});
