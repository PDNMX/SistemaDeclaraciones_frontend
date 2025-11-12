import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosParejaComponent } from './datos-pareja.component';

describe('DatosParejaComponent', () => {
  let component: DatosParejaComponent;
  let fixture: ComponentFixture<DatosParejaComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DatosParejaComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosParejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
