import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import inversiones from '../../page-objects/situacion-patrimonial/inversiones.page';

fixture`Book Collection`.page`${environment.pageUrl}/inicial/situacion-patrimonial/inversiones`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test('no investment', async (t) => {
  await inversiones.login();
  await inversiones.noProperty();
});

test('fill form', async (t) => {
  await inversiones.login();
  await inversiones.newProperty();
});

test('modify last investment', async (t) => {
  await inversiones.login();
  await inversiones.modifyProperty();
});

test('delete item', async (t) => {
  await inversiones.login();
  await inversiones.deleteItem();
});
