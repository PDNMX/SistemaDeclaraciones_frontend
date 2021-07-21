import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Apollo } from 'apollo-angular';

import { Credentials, CredentialsService } from './credentials.service';

import { login, signup } from '@api/user';

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

export interface SignupContext {
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  username: string;
  curp: string;
  rfc: string;
  contrasena: string;
  institucion?: any;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private apollo: Apollo, private credentialsService: CredentialsService, private http: HttpClient) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    let credentials: Credentials = null;

    return from(
      this.apollo
        .query({
          query: login,
          variables: {
            username: context.username,
            password: context.password,
          },
        })
        .toPromise()
        .then(({ data }: any) => {
          credentials = data.login;
          this.credentialsService.setCredentials(credentials, context.remember);
          return credentials;
        })
    );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }

  /**
   * Creates a user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  signup(context: SignupContext): Observable<boolean> {
    const user = {
      username: context.username,
      password: context.contrasena,
      nombre: context.nombre,
      primerApellido: context.primerApellido,
      segundoApellido: context.segundoApellido || '',
      curp: context.curp,
      rfc: context.rfc,
      institucion: context.institucion ?? null,
    };

    return from(
      this.apollo
        .mutate({
          mutation: signup,
          variables: {
            user,
          },
        })
        .toPromise()
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        })
    );
  }
}
