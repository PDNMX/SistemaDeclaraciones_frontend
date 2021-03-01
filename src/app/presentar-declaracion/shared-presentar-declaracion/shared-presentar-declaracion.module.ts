import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { SectionFooterComponent } from './section-footer/section-footer.component';

@NgModule({
  imports: [FlexLayoutModule, MaterialModule, CommonModule],
  declarations: [SectionHeaderComponent, SectionFooterComponent],
  exports: [SectionHeaderComponent, SectionFooterComponent],
})
export class SharedPresentarDeclaracionModule {}
