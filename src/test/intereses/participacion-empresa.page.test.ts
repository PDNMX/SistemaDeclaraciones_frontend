import { waitForAngular } from 'testcafe-angular-selectors';
import { environment } from '../../environments/environment';
import participacionEmpresa from '../../page-objects/intereses/participacion-empresa.page';

fixture`situacion patrimonial`.page`${environment.pageUrl}/inicial/intereses/participacion-empresa`.beforeEach(
  async (t) => {
    await waitForAngular();
  }
);

test('no participation', async (t) => {
  await participacionEmpresa.login();
  await participacionEmpresa.noParticipation();
});

test('fill form', async (t) => {
  await participacionEmpresa.login();
  await participacionEmpresa.newParticipation();
});

test('modify', async (t) => {
  await participacionEmpresa.login();
  await participacionEmpresa.modifyParticipation();
});

test('delete item', async (t) => {
  await participacionEmpresa.login();
  await participacionEmpresa.deleteItem();
});
