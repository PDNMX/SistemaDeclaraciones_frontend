import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclaracionesComponent } from './declaraciones.component';

describe('DeclaracionesComponent', () => {
  let component: DeclaracionesComponent;
  let fixture: ComponentFixture<DeclaracionesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DeclaracionesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclaracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
