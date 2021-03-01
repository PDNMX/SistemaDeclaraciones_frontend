import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipacionEmpresaComponent } from './participacion-empresa.component';

describe('ParticipacionEmpresaComponent', () => {
  let component: ParticipacionEmpresaComponent;
  let fixture: ComponentFixture<ParticipacionEmpresaComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ParticipacionEmpresaComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipacionEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
