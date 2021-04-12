import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  tipoDeclaracion: string | null;
}

@Component({
  selector: 'app-sign-declaration',
  templateUrl: './sign-declaration.component.html',
  styleUrls: ['./sign-declaration.component.scss'],
})
export class SignDeclarationComponent implements OnInit {
  password: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {}
}
