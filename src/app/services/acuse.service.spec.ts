import { TestBed } from '@angular/core/testing';

import { AcuseService } from './acuse.service';

describe('AcuseService', () => {
  let service: AcuseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcuseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
