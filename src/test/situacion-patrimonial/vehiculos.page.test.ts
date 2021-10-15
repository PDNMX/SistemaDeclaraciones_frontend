import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import vehiculos from '../../page-objects/situacion-patrimonial/vehiculos.page';

fixture`Book Collection`.page`${environment.pageUrl}/inicial/situacion-patrimonial/vehiculos`.beforeEach(async (t) => {
  await waitForAngular();
});

test('no property', async (t) => {
  await vehiculos.login();
  await vehiculos.noVehicle();
});

test('fill form', async (t) => {
  await vehiculos.login();
  await vehiculos.newVehicle();
});

test('modify last vehicule', async (t) => {
  await vehiculos.login();
  await vehiculos.modifyVehicle();
});

test('delete item', async (t) => {
  await vehiculos.login();
  await vehiculos.deleteItem();
});
