import { Selector, t } from 'testcafe';

class LoginPage {
  usernameField: any;
  passwordField: any;
  loginButton: any;
  constructor() {
    this.usernameField = Selector('input[formcontrolname="username"]');
    this.passwordField = Selector('input[formcontrolname="password"]');
    this.loginButton = Selector('button.login-btn');
  }

  async submitForm(username: string, password: string) {
    await t.typeText(this.usernameField, username).typeText(this.passwordField, password).click(this.loginButton);
  }
}

const loginPage = new LoginPage();
export default loginPage;
