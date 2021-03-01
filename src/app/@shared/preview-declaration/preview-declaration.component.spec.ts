import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDeclarationComponent } from './preview-declaration.component';

describe('PreviewDeclarationComponent', () => {
  let component: PreviewDeclarationComponent;
  let fixture: ComponentFixture<PreviewDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviewDeclarationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
