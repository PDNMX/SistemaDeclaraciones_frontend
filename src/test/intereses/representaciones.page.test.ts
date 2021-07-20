import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import representaciones from '../../page-objects/intereses/representaciones.page';

fixture`intereses`.page`${environment.pageUrl}/inicial/intereses/representacion`.beforeEach(async (t) => {
  await waitForAngular();
});

test('no participation', async (t) => {
  await representaciones.login();
  await representaciones.noRepresentation();
});

test('fill form', async (t) => {
  await representaciones.login();
  await representaciones.newRepresentation();
});

test('modify', async (t) => {
  await representaciones.login();
  await representaciones.modifyRepresentation();
});

test('delete item', async (t) => {
  await representaciones.login();
  await representaciones.deleteItem();
});
