import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import prestamos from '../../page-objects/situacion-patrimonial/prestamos-terceros.page';

fixture`Book Collection`.page`${environment.pageUrl}/inicial/situacion-patrimonial/prestamos-terceros`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test('no investment', async (t) => {
  await prestamos.login();
  await prestamos.noDebts();
});

test('fill form', async (t) => {
  await prestamos.login();
  await prestamos.newDebt();
});

test('modify last liability', async (t) => {
  await prestamos.login();
  await prestamos.modifyDebt();
});

test('delete item', async (t) => {
  await prestamos.login();
  await prestamos.deleteItem();
});
