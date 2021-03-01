import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { BienesInmueblesComponent } from './bienes-inmuebles.component';

describe('BienesInmueblesComponent', () => {
  let component: BienesInmueblesComponent;
  let fixture: ComponentFixture<BienesInmueblesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BienesInmueblesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BienesInmueblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
