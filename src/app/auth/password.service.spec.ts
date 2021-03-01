import { TestBed, fakeAsync } from '@angular/core/testing';

import { PasswordService } from './password.service';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';

describe('PasswordService', () => {
  let passwordService: PasswordService;
  let credentialsService: MockCredentialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordService],
    });

    passwordService = TestBed.inject(PasswordService);
    credentialsService.credentials = null;
    spyOn(credentialsService, 'setCredentials').and.callThrough();
  });

  describe('Reset password', () => {
    it('should authenticate user', fakeAsync(() => {
      expect(credentialsService.isAuthenticated()).toBe(false);
    }));
  });
});
