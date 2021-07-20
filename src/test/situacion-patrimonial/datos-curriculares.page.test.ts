import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import datosCurriculares from '../../page-objects/situacion-patrimonial/datos-curriculares.page';

fixture`Book Collection`.page`${environment.pageUrl}/inicial/situacion-patrimonial/datos-curriculares`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test('fill form', async (t) => {
  await datosCurriculares.login();
  await datosCurriculares.newSchool();
});

test('modify', async (t) => {
  await datosCurriculares.login();
  await datosCurriculares.modifySchool();
});

test('delete item', async (t) => {
  await datosCurriculares.login();
  await datosCurriculares.deleteItem();
});
