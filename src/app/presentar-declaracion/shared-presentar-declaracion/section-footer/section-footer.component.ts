import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { firmarDeclaracion } from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { PreviewDeclarationComponent } from '@shared/preview-declaration/preview-declaration.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AcuseService } from '@app/services/acuse.service';

@Component({
  selector: 'section-footer',
  templateUrl: './section-footer.component.html',
  styleUrls: ['./section-footer.component.scss'],
})
export class SectionFooterComponent implements OnInit {
  @Input() declaracionId: string = null;

  constructor(
    private apollo: Apollo,
    private acuseService: AcuseService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  confirmFinish() {
    const dialogRef = this.dialog.open(PreviewDeclarationComponent, {
      data: {
        id: this.declaracionId,
        signDeclaration: true,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        try {
          await this.signDeclaration();
          const info: any = await this.acuseService.downloadAcuse(this.declaracionId);
          const blob = new Blob([info], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
          this.finishDeclaration();
        } catch (error) {
          console.log(error);
          this.openSnackBar('ERROR: No pudo firmar la declaración', 'Aceptar');
        }
      }
    });
  }

  async finishDeclaration() {
    try {
      this.presentSuccessAlert();
      this.router.navigate([`/declaraciones`], {
        replaceUrl: true,
      });
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se guardaron los cambios', 'Aceptar');
    }
  }

  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  presentSuccessAlert() {
    this.dialog.open(DialogComponent, {
      data: {
        title: 'Información actualizada',
        message: 'Se han guardado tus cambios',
        trueText: 'Aceptar',
      },
    });
  }

  async signDeclaration() {
    try {
      const result = await this.apollo
        .mutate({
          mutation: firmarDeclaracion,
          variables: {
            id: this.declaracionId,
          },
        })
        .toPromise();

      console.log('FIRMADA', result);
    } catch (error) {
      console.log(error);
      this.openSnackBar('ERROR: No se pudo firmar la declaración', 'Aceptar');
    }
  }
}
