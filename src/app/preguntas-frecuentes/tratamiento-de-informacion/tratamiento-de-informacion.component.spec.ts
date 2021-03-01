import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TratamientoDeInformacionComponent } from './tratamiento-de-informacion.component';

describe('TratamientoDeInformacionComponent', () => {
  let component: TratamientoDeInformacionComponent;
  let fixture: ComponentFixture<TratamientoDeInformacionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TratamientoDeInformacionComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TratamientoDeInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
