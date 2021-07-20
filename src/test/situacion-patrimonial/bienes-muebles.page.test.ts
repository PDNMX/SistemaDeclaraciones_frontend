import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import bienesMuebles from '../../page-objects/situacion-patrimonial/bienes-muebles.page';

fixture`Book Collection`.page`${environment.pageUrl}/inicial/situacion-patrimonial/bienes-muebles`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test('no property', async (t) => {
  await bienesMuebles.login();
  await bienesMuebles.noProperty();
});

test('fill form', async (t) => {
  await bienesMuebles.login();
  await bienesMuebles.newProperty();
});

test('modify last vehicule', async (t) => {
  await bienesMuebles.login();
  await bienesMuebles.modifyProperty();
});

test('delete item', async (t) => {
  await bienesMuebles.login();
  await bienesMuebles.deleteItem();
});
