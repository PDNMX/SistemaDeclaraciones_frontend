import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../environments/environment';
import loginPage from '../page-objects/login.page';

fixture`Book Collection`.page`${environment.pageUrl}/inicial/situacion-patrimonial/datos-generales`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test.only('Login with a standard user credentials', async (t) => {
  await loginPage.submitForm('prueba7@yopmail.com', '0123456789');
});
