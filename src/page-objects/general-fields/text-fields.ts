import { Selector, t } from 'testcafe';

class TextField {
  constructor() {}
  async fill(textField: any, text: string = 'Texto de Prueba', replace = false) {
    await t.typeText(textField, text, { replace: replace });
  }
}
const textField = new TextField();
export default textField;
