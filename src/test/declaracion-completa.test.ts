import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../environments/environment';
import declaracionCompleta from '../page-objects/declaracion-completa';

fixture`declaracion completa`.page`${environment.pageUrl}/inicial/situacion-patrimonial/datos-generales`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test('declaracion completa', async (t) => {
  await declaracionCompleta.login();
  await declaracionCompleta.fill();
});
