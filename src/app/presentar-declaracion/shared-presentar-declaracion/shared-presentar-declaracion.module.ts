import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '@app/material.module';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { SectionFooterComponent } from './section-footer/section-footer.component';
import { SignDeclarationComponent } from './sign-declaration/sign-declaration.component';

@NgModule({
  imports: [FlexLayoutModule, MaterialModule, CommonModule, FormsModule],
  declarations: [SectionHeaderComponent, SectionFooterComponent, SignDeclarationComponent],
  exports: [SectionHeaderComponent, SectionFooterComponent, SignDeclarationComponent],
})
export class SharedPresentarDeclaracionModule {}
