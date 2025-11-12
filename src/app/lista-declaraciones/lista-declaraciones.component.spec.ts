import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDeclaracionesComponent } from './lista-declaraciones.component';

describe('ListaDeclaracionesComponent', () => {
  let component: ListaDeclaracionesComponent;
  let fixture: ComponentFixture<ListaDeclaracionesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ListaDeclaracionesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaDeclaracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
