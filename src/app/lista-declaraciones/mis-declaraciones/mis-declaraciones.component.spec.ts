import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisDeclaracionesComponent } from './mis-declaraciones.component';

describe('MisDeclaracionesComponent', () => {
  let component: MisDeclaracionesComponent;
  let fixture: ComponentFixture<MisDeclaracionesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MisDeclaracionesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MisDeclaracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
