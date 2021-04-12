import { Injectable } from '@angular/core';

type Roles = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'ROOT';

export interface User {
  _id: string;
  username: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  curp: string;
  rfc: string;
  roles: Roles[];
}

export interface Credentials {
  refreshJwtToken: string;
  jwtToken: string;
  user: User;
}

const credentialsKey = 'credentials';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private _credentials: Credentials | null = null;

  constructor() {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Checks is the user is admin.
   * @return True if the user is admin.
   */
  isAdmin(): boolean {
    const userRoles = this.credentials?.user?.roles || [];
    return userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN') || userRoles.includes('ROOT');
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Checks is the user is a declarant.
   * @return True if the user is a declarant.
   */
  isDeclarant(): boolean {
    const userRoles = this.credentials?.user?.roles || [];
    return userRoles.includes('USER');
  }

  isSuperAdmin(): boolean {
    const userRoles = this.credentials?.user?.roles || [];
    return userRoles.includes('SUPER_ADMIN');
  }

  /**
   * Checks is the user is root admin.
   * @return True if the user is root admin.
   */
  isRoot(): boolean {
    const userRoles = this.credentials?.user?.roles || [];
    return userRoles.includes('ROOT');
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Gets the refresh token.
   * @return The refresh token or null if the user is not authenticated.
   */
  get refreshToken(): string | null {
    return this.isAuthenticated() ? this._credentials.refreshJwtToken : null;
  }

  /**
   * Gets the user token.
   * @return The user token or null if the user is not authenticated.
   */
  get token(): string | null {
    return this.isAuthenticated() ? this._credentials.jwtToken : null;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }
}
