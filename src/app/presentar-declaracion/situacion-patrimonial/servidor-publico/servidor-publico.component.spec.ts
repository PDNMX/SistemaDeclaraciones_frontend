import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServidorPublicoComponent } from './servidor-publico.component';

describe('ServidorPublicoComponent', () => {
  let component: ServidorPublicoComponent;
  let fixture: ComponentFixture<ServidorPublicoComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ServidorPublicoComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ServidorPublicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
