import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import ingresosNetos from '../../page-objects/situacion-patrimonial/ingresos-netos.page';

fixture`Book Collection`.page`${environment.pageUrl}/inicial/situacion-patrimonial/ingresos-netos`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test('fill all', async (t) => {
  await ingresosNetos.login();
  await ingresosNetos.fill();
});

test('fill second elements', async (t) => {
  await ingresosNetos.login();
  await ingresosNetos.fillMidSections();
  await ingresosNetos.save();
});

test('delete all', async (t) => {
  await ingresosNetos.login();
  await ingresosNetos.deleteSections();
});
