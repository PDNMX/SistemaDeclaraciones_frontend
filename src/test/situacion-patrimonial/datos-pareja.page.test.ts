import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import datosPareja from '../../page-objects/situacion-patrimonial/datos-pareja.page';

fixture`Book Collection`.page`${environment.pageUrl}/inicial/situacion-patrimonial/datos-pareja`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test('no couple', async (t) => {
  await datosPareja.login();
  await datosPareja.noCouple();
});

test('fill form', async (t) => {
  await datosPareja.login();
  await datosPareja.fill();
});

test('modify first section', async (t) => {
  await datosPareja.login();
  await datosPareja.modifyFirstSection();
});

test('modify foreign address section', async (t) => {
  await datosPareja.login();
  await datosPareja.modifyDomicilioExtranjeroSection();
});

test('modify mexican address section', async (t) => {
  await datosPareja.login();
  await datosPareja.modifyDomicilioMexicoSection();
});

test('modify private section', async (t) => {
  await datosPareja.login();
  await datosPareja.modifyPrivateSection();
});

test('modify public section', async (t) => {
  await datosPareja.login();
  await datosPareja.modifyPublicSection();
});

test('delete item', async (t) => {
  await datosPareja.login();
  await datosPareja.deleteItem();
});
