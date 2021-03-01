import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresosNetosComponent } from './ingresos-netos.component';

describe('IngresosNetosComponent', () => {
  let component: IngresosNetosComponent;
  let fixture: ComponentFixture<IngresosNetosComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [IngresosNetosComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresosNetosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
