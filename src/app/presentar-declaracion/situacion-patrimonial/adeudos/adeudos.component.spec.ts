import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdeudosComponent } from './adeudos.component';

describe('AdeudosComponent', () => {
  let component: AdeudosComponent;
  let fixture: ComponentFixture<AdeudosComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AdeudosComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AdeudosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
