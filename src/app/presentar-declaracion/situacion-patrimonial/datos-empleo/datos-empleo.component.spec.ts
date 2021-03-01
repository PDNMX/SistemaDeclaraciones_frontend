import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosEmpleoComponent } from './datos-empleo.component';

describe('DatosEmpleoComponent', () => {
  let component: DatosEmpleoComponent;
  let fixture: ComponentFixture<DatosEmpleoComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DatosEmpleoComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosEmpleoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
