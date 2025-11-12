import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamosTercerosComponent } from './prestamos-terceros.component';

describe('PrestamosTercerosComponent', () => {
  let component: PrestamosTercerosComponent;
  let fixture: ComponentFixture<PrestamosTercerosComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PrestamosTercerosComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestamosTercerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
