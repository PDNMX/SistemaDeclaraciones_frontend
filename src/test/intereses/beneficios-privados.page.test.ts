import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import beneficiosPrivados from '../../page-objects/intereses/beneficios-privados.page';

fixture`intereses`.page`${environment.pageUrl}/inicial/intereses/beneficios-privados`.beforeEach(async (t) => {
  await waitForAngular();
});

test('no profits', async (t) => {
  await beneficiosPrivados.login();
  await beneficiosPrivados.noProfits();
});

test('fill form', async (t) => {
  await beneficiosPrivados.login();
  await beneficiosPrivados.newProfit();
});

test('modify', async (t) => {
  await beneficiosPrivados.login();
  await beneficiosPrivados.modifyProfit();
});

test('delete item', async (t) => {
  await beneficiosPrivados.login();
  await beneficiosPrivados.deleteItem();
});
