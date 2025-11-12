import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FideicomisosComponent } from './fideicomisos.component';

describe('FideicomisosComponent', () => {
  let component: FideicomisosComponent;
  let fixture: ComponentFixture<FideicomisosComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FideicomisosComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FideicomisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
