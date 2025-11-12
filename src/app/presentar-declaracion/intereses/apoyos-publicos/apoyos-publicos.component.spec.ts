import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApoyosPublicosComponent } from './apoyos-publicos.component';

describe('ApoyosPublicosComponent', () => {
  let component: ApoyosPublicosComponent;
  let fixture: ComponentFixture<ApoyosPublicosComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ApoyosPublicosComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ApoyosPublicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
