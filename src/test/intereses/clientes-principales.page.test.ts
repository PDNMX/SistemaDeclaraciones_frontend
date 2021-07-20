import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import clientesPrincipales from '../../page-objects/intereses/clientes-principales.page';

fixture`intereses`.page`${environment.pageUrl}/inicial/intereses/clientes-principales`.beforeEach(async (t) => {
  await waitForAngular();
});

test('no participation', async (t) => {
  await clientesPrincipales.login();
  await clientesPrincipales.noCustomers();
});

test('fill form', async (t) => {
  await clientesPrincipales.login();
  await clientesPrincipales.newCustomer();
});

test('modify', async (t) => {
  await clientesPrincipales.login();
  await clientesPrincipales.modifyCustomer();
});

test('delete item', async (t) => {
  await clientesPrincipales.login();
  await clientesPrincipales.deleteItem();
});
