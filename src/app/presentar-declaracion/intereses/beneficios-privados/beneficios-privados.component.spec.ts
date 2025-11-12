import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosPrivadosComponent } from './beneficios-privados.component';

describe('BeneficiosPrivadosComponent', () => {
  let component: BeneficiosPrivadosComponent;
  let fixture: ComponentFixture<BeneficiosPrivadosComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BeneficiosPrivadosComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiosPrivadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
