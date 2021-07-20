import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import tomaDecisiones from '../../page-objects/intereses/apoyos.page';

fixture`situacion patrimonial`.page`${environment.pageUrl}/inicial/intereses/apoyos-publicos`.beforeEach(async (t) => {
  await waitForAngular();
});

test('no participation', async (t) => {
  await tomaDecisiones.login();
  await tomaDecisiones.noSupport();
});

test('fill form', async (t) => {
  await tomaDecisiones.login();
  await tomaDecisiones.newSupport();
});

test('modify', async (t) => {
  await tomaDecisiones.login();
  await tomaDecisiones.modifySupport();
});

test('delete item', async (t) => {
  await tomaDecisiones.login();
  await tomaDecisiones.deleteItem();
});
