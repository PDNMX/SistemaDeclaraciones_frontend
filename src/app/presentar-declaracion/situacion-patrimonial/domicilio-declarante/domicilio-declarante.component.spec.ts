import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomicilioDeclaranteComponent } from './domicilio-declarante.component';

describe('DomicilioDeclaranteComponent', () => {
  let component: DomicilioDeclaranteComponent;
  let fixture: ComponentFixture<DomicilioDeclaranteComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DomicilioDeclaranteComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DomicilioDeclaranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
