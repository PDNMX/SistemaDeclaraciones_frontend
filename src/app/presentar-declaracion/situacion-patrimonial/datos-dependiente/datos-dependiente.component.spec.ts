import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosDependienteComponent } from './datos-dependiente.component';

describe('DatosDependienteComponent', () => {
  let component: DatosDependienteComponent;
  let fixture: ComponentFixture<DatosDependienteComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DatosDependienteComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosDependienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
