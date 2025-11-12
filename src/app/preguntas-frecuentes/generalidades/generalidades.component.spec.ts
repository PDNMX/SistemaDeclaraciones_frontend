import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralidadesComponent } from './generalidades.component';

describe('GeneralidadesComponent', () => {
  let component: GeneralidadesComponent;
  let fixture: ComponentFixture<GeneralidadesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GeneralidadesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
