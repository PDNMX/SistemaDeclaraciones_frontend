import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import datosDependiente from '../../page-objects/situacion-patrimonial/datos-dependiente.page';

fixture`Book Collection`.page`${environment.pageUrl}/inicial/situacion-patrimonial/datos-dependiente`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test('no dependent', async (t) => {
  await datosDependiente.login();
  await datosDependiente.noDependent();
});

test('fill form', async (t) => {
  await datosDependiente.login();
  await datosDependiente.fill();
});

test('modify first section', async (t) => {
  await datosDependiente.login();
  await datosDependiente.modifyFirstSection();
});

test('modify foreign address section', async (t) => {
  await datosDependiente.login();
  await datosDependiente.modifyDomicilioExtranjeroSection();
});

test('modify mexican address section', async (t) => {
  await datosDependiente.login();
  await datosDependiente.modifyDomicilioMexicoSection();
});

test('modify private section', async (t) => {
  await datosDependiente.login();
  await datosDependiente.modifyPrivateSection();
});

test('modify public section', async (t) => {
  await datosDependiente.login();
  await datosDependiente.modifyPublicSection();
});

test('delete item', async (t) => {
  await datosDependiente.login();
  await datosDependiente.deleteItem();
});
