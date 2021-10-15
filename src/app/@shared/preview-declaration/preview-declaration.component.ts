import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AcuseService } from '@app/services/acuse.service';

export interface DialogData {
  id: string;
  publicVersion?: boolean;
  signDeclaration: boolean | null;
}

@Component({
  selector: 'app-preview-declaration',
  templateUrl: './preview-declaration.component.html',
  styleUrls: ['./preview-declaration.component.scss'],
})
export class PreviewDeclarationComponent implements OnInit {
  url: string = '';

  constructor(private acuseService: AcuseService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  async viewDeclaration() {
    try {
      const info: any = await this.acuseService.downloadAcuse(this.data.id, this.data.publicVersion ?? false);
      const blob = new Blob([info], { type: 'application/pdf' });
      this.url = window.URL.createObjectURL(blob);
      const blobIframe: any = document.querySelector('#acuse');
      blobIframe.src = this.url;
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    this.viewDeclaration();
  }
}
