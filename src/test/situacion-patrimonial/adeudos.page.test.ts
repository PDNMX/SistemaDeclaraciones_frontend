import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import adeudos from '../../page-objects/situacion-patrimonial/adeudos.page';

fixture`Book Collection`.page`${environment.pageUrl}/inicial/situacion-patrimonial/adeudos`.beforeEach(async (t) => {
  await waitForAngular();
});

test('no investment', async (t) => {
  await adeudos.login();
  await adeudos.noLiabilities();
});

test('fill form', async (t) => {
  await adeudos.login();
  await adeudos.newLiability();
});

test('modify last liability', async (t) => {
  await adeudos.login();
  await adeudos.modifyLiability();
});

test('delete item', async (t) => {
  await adeudos.login();
  await adeudos.deleteItem();
});
