import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComienzaTuDeclaracionComponent } from './comienza-tu-declaracion.component';

describe('ComienzaTuDeclaracionComponent', () => {
  let component: ComienzaTuDeclaracionComponent;
  let fixture: ComponentFixture<ComienzaTuDeclaracionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ComienzaTuDeclaracionComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ComienzaTuDeclaracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
