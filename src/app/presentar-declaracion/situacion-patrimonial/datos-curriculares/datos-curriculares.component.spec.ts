import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosCurricularesComponent } from './datos-curriculares.component';

describe('DatosCurricularesComponent', () => {
  let component: DatosCurricularesComponent;
  let fixture: ComponentFixture<DatosCurricularesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DatosCurricularesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosCurricularesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
