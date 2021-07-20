import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import domicilioDeclarante from '../../page-objects/situacion-patrimonial/domicilio-declarante.page';

fixture`Book Collection`.page`${environment.pageUrl}/inicial/situacion-patrimonial/domicilio-declarante`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test('fill form', async (t) => {
  await domicilioDeclarante.login();
  await domicilioDeclarante.fill();
});

test('modify', async (t) => {
  await domicilioDeclarante.login();
  await domicilioDeclarante.fill(
    true,
    'Texto modificado de prueba',
    'MÉXICO',
    '36',
    '56',
    '63864',
    'COLIMA',
    'ARMENIA'
  );
});
