import { Selector, t } from 'testcafe';

class RadioButtonInput {
  constructor() {}
  async select(radioButton: any, text: any) {
    await t.click(Selector(`${radioButton} label span.mat-radio-label-content`).withText(text));
  }
}
const radioButtonInput = new RadioButtonInput();
export default radioButtonInput;
