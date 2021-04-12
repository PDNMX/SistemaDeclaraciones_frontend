import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignDeclarationComponent } from './sign-declaration.component';

describe('SignDeclarationComponent', () => {
  let component: SignDeclarationComponent;
  let fixture: ComponentFixture<SignDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignDeclarationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
