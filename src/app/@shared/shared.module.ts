import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';

import { DialogComponent } from './dialog/dialog.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { PreviewDeclarationComponent } from './preview-declaration/preview-declaration.component';
import { ReplacePipe } from './pipes/replace.pipe';

@NgModule({
  imports: [FlexLayoutModule, MaterialModule, CommonModule],
  declarations: [
    LoaderComponent,
    DialogComponent,
    FooterComponent,
    HeaderComponent,
    PaginatorComponent,
    PreviewDeclarationComponent,
    ReplacePipe,
  ],
  exports: [
    LoaderComponent,
    DialogComponent,
    FooterComponent,
    HeaderComponent,
    PaginatorComponent,
    PreviewDeclarationComponent,
    ReplacePipe,
  ],
})
export class SharedModule {}
