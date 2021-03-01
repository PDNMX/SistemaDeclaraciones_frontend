import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LlenadoDeDeclaracionesComponent } from './llenado-de-declaraciones.component';

describe('LlenadoDeDeclaracionesComponent', () => {
  let component: LlenadoDeDeclaracionesComponent;
  let fixture: ComponentFixture<LlenadoDeDeclaracionesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LlenadoDeDeclaracionesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LlenadoDeDeclaracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
