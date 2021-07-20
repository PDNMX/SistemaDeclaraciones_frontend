import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import bienesInmuebles from '../../page-objects/situacion-patrimonial/bienes-inmuebles.page';

fixture`Book Collection`.page`${environment.pageUrl}/inicial/situacion-patrimonial/bienes-inmuebles`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test('no property', async (t) => {
  await bienesInmuebles.login();
  await bienesInmuebles.noProperty();
});

test('fill form', async (t) => {
  await bienesInmuebles.login();
  await bienesInmuebles.newProperty();
});

test('modify last property', async (t) => {
  await bienesInmuebles.login();
  await bienesInmuebles.modifyProperty();
});

test('delete item', async (t) => {
  await bienesInmuebles.login();
  await bienesInmuebles.deleteItem();
});
