import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import servidorPublico from '../../page-objects/situacion-patrimonial/servidor-publico.page';

fixture`Book Collection`.page`${environment.pageUrl}/inicial/situacion-patrimonial/servidor-publico`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test('fill all', async (t) => {
  await servidorPublico.login();
  await servidorPublico.fill();
});

test('fill second elements', async (t) => {
  await servidorPublico.login();
  await servidorPublico.fillMidSections();
  await servidorPublico.save();
});

test('delete mid sections', async (t) => {
  await servidorPublico.login();
  await servidorPublico.deleteSections();
});

test('no public official', async (t) => {
  await servidorPublico.login();
  await servidorPublico.fill('No');
});
