import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@env/environment';

export interface ResetEmailContext {
  username: string;
}

export interface ResetPasswordContext {
  contrasena: string;
  token: string;
}

/**
 * Provides a base for reset password workflow.
 *
 */
@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  constructor(private http: HttpClient) {}

  sendResetPasswordEmail(context: ResetEmailContext): Promise<any> {
    return this.http
      .post(`${environment.serverUrl}/forgot_password`, context)
      .toPromise()
      .then((result: any) => {
        return result.success;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  resetPassword(context: ResetPasswordContext): Promise<boolean> {
    return this.http
      .post(`${environment.serverUrl}/reset_password`, context)
      .toPromise()
      .then((result: any) => {
        return result.success;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }
}
