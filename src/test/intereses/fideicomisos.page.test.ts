import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import fideicomisos from '../../page-objects/intereses/fideicomisos.page';

fixture`intereses`.page`${environment.pageUrl}/inicial/intereses/fideicomisos`.beforeEach(async (t) => {
  await waitForAngular();
});

test('no trusts', async (t) => {
  await fideicomisos.login();
  await fideicomisos.noTrusts();
});

test('fill form', async (t) => {
  await fideicomisos.login();
  await fideicomisos.newTrust();
});

test('modify', async (t) => {
  await fideicomisos.login();
  await fideicomisos.modifyTrust();
});

test('delete item', async (t) => {
  await fideicomisos.login();
  await fideicomisos.deleteItem();
});
