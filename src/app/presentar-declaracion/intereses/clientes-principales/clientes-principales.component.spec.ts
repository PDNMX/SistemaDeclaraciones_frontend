import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesPrincipalesComponent } from './clientes-principales.component';

describe('ClientesPrincipalesComponent', () => {
  let component: ClientesPrincipalesComponent;
  let fixture: ComponentFixture<ClientesPrincipalesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ClientesPrincipalesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientesPrincipalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
