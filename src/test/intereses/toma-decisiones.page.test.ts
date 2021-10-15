import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import tomaDecisiones from '../../page-objects/intereses/toma-decisiones.page';

fixture`situacion patrimonial`.page`${environment.pageUrl}/inicial/intereses/toma-decisiones`.beforeEach(async (t) => {
  await waitForAngular();
});

test.skip('no participation', async (t) => {
  await tomaDecisiones.login();
  await tomaDecisiones.noParticipation();
});

test('fill form', async (t) => {
  await tomaDecisiones.login();
  await tomaDecisiones.newParticipation();
});

test('modify', async (t) => {
  await tomaDecisiones.login();
  await tomaDecisiones.modifyParticipation();
});

test('delete item', async (t) => {
  await tomaDecisiones.login();
  await tomaDecisiones.deleteItem();
});
