import { Selector, t } from 'testcafe';

class SelectField {
  constructor() {}
  async fill(selectField: any, option: any) {
    await t
      .click(Selector(selectField))
      .click(Selector(`[role="listbox"] > .mat-option > .mat-option-text`).withText(option));
  }
}
const selectField = new SelectField();
export default selectField;
