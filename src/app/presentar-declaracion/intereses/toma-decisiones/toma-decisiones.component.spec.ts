import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TomaDecisionesComponent } from './toma-decisiones.component';

describe('TomaDecisionesComponent', () => {
  let component: TomaDecisionesComponent;
  let fixture: ComponentFixture<TomaDecisionesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TomaDecisionesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TomaDecisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
