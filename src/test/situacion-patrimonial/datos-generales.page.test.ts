import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import datosGenerales from '../../page-objects/situacion-patrimonial/datos-generales.page';

fixture`Book Collection`.page`${environment.pageUrl}/inicial/situacion-patrimonial/datos-generales`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test('fill form', async (t) => {
  await datosGenerales.login();
  await datosGenerales.fill();
});

test('modify', async (t) => {
  await datosGenerales.login();
  await datosGenerales.fill(
    true,
    'Texto modificado de prueba',
    '7564467856',
    'AADL950608MNLNZN07',
    'MCON800825',
    'P13',
    'modificado@yopmail.com',
    'CONCUBINA/CONCUBINARIO/UNIÓN LIBRE',
    'SOCIEDAD CONYUGAL',
    'MÉXICO',
    'MEXICANA'
  );
});
